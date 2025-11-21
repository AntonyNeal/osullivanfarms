output "static_web_app_url" {
  value       = azurerm_static_web_app.swa.default_host_name
  description = "Static Web App default hostname"
}

output "database_host" {
  value       = azurerm_postgresql_flexible_server.db.fqdn
  description = "PostgreSQL server FQDN"
}

output "storage_account_name" {
  value       = azurerm_storage_account.storage.name
  description = "Storage account name"
}

output "assets_container_url" {
  value       = "${azurerm_storage_account.storage.primary_blob_endpoint}${azurerm_storage_container.assets.name}"
  description = "URL for assets container"
}

output "container_registry_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Container Registry login server"
  sensitive   = false
}

output "container_registry_name" {
  value       = azurerm_container_registry.acr.name
  description = "Container Registry name"
}

output "api_url" {
  value       = "https://${azurerm_container_app.api.latest_revision_fqdn}"
  description = "API Container App URL"
}

output "api_fqdn" {
  value       = azurerm_container_app.api.latest_revision_fqdn
  description = "API fully qualified domain name"
}
