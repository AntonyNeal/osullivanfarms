variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "osullivanfarms-rg"
}

variable "location" {
  description = "Azure region for most resources"
  type        = string
  default     = "East US 2"
}

variable "db_location" {
  description = "Azure region for PostgreSQL (Australia East for lower latency)"
  type        = string
  default     = "Australia East"
}

variable "storage_account_name" {
  description = "Name of the storage account (must be globally unique, 3-24 chars, lowercase alphanumeric)"
  type        = string
  default     = "osullivanfarmsstorage"
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
  default     = "EastUS2LinuxDynamicPlan"
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace"
  type        = string
  default     = "workspace-osullivanfarmsrgpqlh"
}

variable "app_insights_name" {
  description = "Name of Application Insights"
  type        = string
  default     = "osullivanfarms-api"
}

variable "function_app_name" {
  description = "Name of the Function App"
  type        = string
  default     = "osullivanfarms-api"
}

variable "postgresql_server_name" {
  description = "Name of the PostgreSQL server (must be globally unique)"
  type        = string
  default     = "osullivanfarms-db"
}

variable "postgresql_database_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "sheepsheet"
}

variable "db_admin_username" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "sheepsheetadmin"
  sensitive   = true
}

variable "db_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key for farm advisor"
  type        = string
  sensitive   = true
}

variable "static_web_app_name" {
  description = "Name of the Static Web App"
  type        = string
  default     = "osullivanfarms"
}

variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/AntonyNeal/osullivanfarms"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Project     = "SheepSheet"
    ManagedBy   = "Terraform"
  }
}
