output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.api.name
}

output "function_app_default_hostname" {
  description = "Default hostname of the Function App"
  value       = azurerm_linux_function_app.api.default_hostname
}

output "function_app_url" {
  description = "URL of the Function App API"
  value       = "https://${azurerm_linux_function_app.api.default_hostname}/api"
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgresql_database_name" {
  description = "Name of the PostgreSQL database"
  value       = azurerm_postgresql_flexible_server_database.main.name
}

output "static_web_app_prod_url" {
  description = "Default URL of the production Static Web App"
  value       = jsondecode(azapi_resource.static_web_app_prod.output).properties.defaultHostname
}

output "static_web_app_staging_url" {
  description = "Default URL of the staging Static Web App"
  value       = jsondecode(azapi_resource.static_web_app_staging.output).properties.defaultHostname
}

output "static_web_app_prod_deployment_token" {
  description = "Deployment token for production Static Web App (sensitive)"
  value       = azapi_resource.static_web_app_prod.identity
  sensitive   = true
}

output "static_web_app_staging_deployment_token" {
  description = "Deployment token for staging Static Web App (sensitive)"
  value       = azapi_resource.static_web_app_staging.identity
  sensitive   = true
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Application Insights connection string"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}

output "setup_instructions" {
  description = "Next steps after infrastructure deployment"
  sensitive   = true
  value       = <<-EOT
    ✅ Infrastructure deployed successfully!
    
    Next steps:
    
    1. Run database migrations:
       cd ../db
       psql "host=${azurerm_postgresql_flexible_server.main.fqdn} port=5432 dbname=${azurerm_postgresql_flexible_server_database.main.name} user=${var.db_admin_username}" -f schema.sql
    
    2. Get Static Web App deployment tokens (for GitHub Actions):
       az staticwebapp secrets list --name ${var.static_web_app_name} --resource-group ${azurerm_resource_group.main.name} --query "properties.apiKey" -o tsv
       az staticwebapp secrets list --name ${var.static_web_app_name}-staging --resource-group ${azurerm_resource_group.main.name} --query "properties.apiKey" -o tsv
    
    3. Update GitHub repository secrets:
       - AZURE_STATIC_WEB_APPS_API_TOKEN (production)
       - AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING (staging)
    
    4. Deploy Function App code:
       cd ../api
       func azure functionapp publish ${azurerm_linux_function_app.api.name}
    
    5. Configure custom domains (optional):
       - sheepsheet.io → Production Static Web App
       - dev.sheepsheet.io → Staging Static Web App
    
    6. Test endpoints:
       - API: https://${azurerm_linux_function_app.api.default_hostname}/api/farm-statistics
       - Frontend: https://${jsondecode(azapi_resource.static_web_app_prod.output).properties.defaultHostname}
  EOT
}
