variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc1"
}

variable "project_name" {
  description = "Project name for resource tagging"
  type        = string
  default     = "sw-website"
}

variable "environment" {
  description = "Environment (development, staging, production)"
  type        = string
  default     = "production"
}
