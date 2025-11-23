terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 1.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

provider "azapi" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  
  tags = var.tags
}

# Storage Account for Function App
resource "azurerm_storage_account" "function_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  tags = var.tags
}

# App Service Plan (Consumption plan for Functions)
resource "azurerm_service_plan" "function_plan" {
  name                = var.app_service_plan_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1" # Consumption plan
  
  tags = var.tags
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = var.log_analytics_workspace_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  
  tags = var.tags
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = var.app_insights_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  
  tags = var.tags
}

# Function App
resource "azurerm_linux_function_app" "api" {
  name                       = var.function_app_name
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  service_plan_id            = azurerm_service_plan.function_plan.id
  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  
  site_config {
    application_stack {
      node_version = "20"
    }
    
    cors {
      allowed_origins = [
        "https://sheepsheet.io",
        "https://www.sheepsheet.io",
        "https://dev.sheepsheet.io",
        "https://*.azurestaticapps.net"
      ]
      support_credentials = true
    }
  }
  
  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY"        = azurerm_application_insights.main.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.main.connection_string
    "FUNCTIONS_WORKER_RUNTIME"              = "node"
    "WEBSITE_NODE_DEFAULT_VERSION"          = "~20"
    "WEBSITE_RUN_FROM_PACKAGE"              = "1"
    "DB_HOST"                               = azurerm_postgresql_flexible_server.main.fqdn
    "DB_PORT"                               = "5432"
    "DB_NAME"                               = azurerm_postgresql_flexible_server_database.main.name
    "DB_USER"                               = var.db_admin_username
    "DB_PASSWORD"                           = var.db_admin_password
    "OPENAI_API_KEY"                        = var.openai_api_key
  }
  
  tags = merge(var.tags, {
    "hidden-link: /app-insights-resource-id" = azurerm_application_insights.main.id
  })
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = var.postgresql_server_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = var.db_location
  version                = "14"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  
  storage_mb = 32768
  sku_name   = "B_Standard_B1ms"
  
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  
  tags = var.tags
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.postgresql_database_name
  server_id = azurerm_postgresql_flexible_server.main.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# PostgreSQL Firewall Rule - Allow Azure Services
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# PostgreSQL Firewall Rule - Allow all (for initial setup - consider restricting in production)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  name             = "AllowAll"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

# Static Web App - Production
resource "azapi_resource" "static_web_app_prod" {
  type      = "Microsoft.Web/staticSites@2023-01-01"
  name      = var.static_web_app_name
  location  = var.location
  parent_id = azurerm_resource_group.main.id
  
  body = jsonencode({
    sku = {
      name = "Free"
      tier = "Free"
    }
    properties = {
      repositoryUrl    = var.github_repo_url
      branch           = "main"
      stagingEnvironmentPolicy = "Enabled"
      allowConfigFileUpdates   = true
      provider         = "GitHub"
      enterpriseGradeCdnStatus = "Disabled"
    }
  })
  
  tags = var.tags
}

# Static Web App - Staging
resource "azapi_resource" "static_web_app_staging" {
  type      = "Microsoft.Web/staticSites@2023-01-01"
  name      = "${var.static_web_app_name}-staging"
  location  = var.location
  parent_id = azurerm_resource_group.main.id
  
  body = jsonencode({
    sku = {
      name = "Free"
      tier = "Free"
    }
    properties = {
      repositoryUrl    = var.github_repo_url
      branch           = "staging"
      stagingEnvironmentPolicy = "Enabled"
      allowConfigFileUpdates   = true
      provider         = "GitHub"
      enterpriseGradeCdnStatus = "Disabled"
    }
  })
  
  tags = var.tags
}
