output "static_web_app_url" {
  value = azurerm_static_site.web.default_host_name
}

output "database_host" {
  value = azurerm_postgresql_flexible_server.db.fqdn
}

output "storage_account_name" {
  value = azurerm_storage_account.assets.name
}

output "assets_container_url" {
  value = "${azurerm_storage_account.assets.primary_blob_endpoint}${azurerm_storage_container.public.name}"
}
