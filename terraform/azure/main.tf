terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

# Azure Static Web App for frontend
resource "azurerm_static_web_app" "swa" {
  name                = "${var.project_name}-swa"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "${var.project_name}-db"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "13"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  zone                   = "1"

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

# Storage Account for assets
resource "azurerm_storage_account" "storage" {
  name                     = "${replace(var.project_name, "-", "")}assets"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

resource "azurerm_storage_container" "assets" {
  name                  = "public-assets"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "blob"
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Azure Container Registry for API Docker images
resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.project_name, "-", "")}acr${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

# Container App Environment
resource "azurerm_container_app_environment" "env" {
  name                = "${var.project_name}-env"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}

# Container App for API
resource "azurerm_container_app" "api" {
  name                         = "${var.project_name}-api"
  resource_group_name          = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  template {
    container {
      name   = "api"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "8080"
      }

      env {
        name  = "ALLOWED_ORIGINS"
        value = "https://${azurerm_static_web_app.swa.default_host_name},http://localhost:5173"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = {
    Environment = "Production"
    Project     = var.project_name
  }
}
