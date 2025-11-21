variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "osullivan-farms-rg"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US 2"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "osullivan-farms"
}

variable "db_admin_username" {
  description = "Database administrator username"
  type        = string
  default     = "pgadmin"
}

variable "db_admin_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}
