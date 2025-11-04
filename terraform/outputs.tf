# Database outputs
output "database_connection_string" {
  value       = digitalocean_database_cluster.postgres.uri
  sensitive   = true
  description = "Full PostgreSQL connection string (sensitive)"
}

output "database_info" {
  value = {
    host = digitalocean_database_cluster.postgres.host
    port = digitalocean_database_cluster.postgres.port
    user = digitalocean_database_cluster.postgres.user
    name = digitalocean_database_cluster.postgres.database
  }
  description = "Database connection information"
}

# Storage outputs
output "cdn_url" {
  value       = "https://${digitalocean_cdn.assets_cdn.endpoint}"
  description = "Full CDN URL"
}

output "storage_info" {
  value = {
    bucket_name   = digitalocean_spaces_bucket.assets.name
    bucket_domain = digitalocean_spaces_bucket.assets.bucket_domain_name
    cdn_endpoint  = digitalocean_cdn.assets_cdn.endpoint
  }
  description = "Object storage and CDN information"
}
