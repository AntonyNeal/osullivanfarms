terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

# Database
resource "digitalocean_database_cluster" "postgres" {
  name       = "sw-website-db"
  engine     = "pg"
  version    = "15"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1

  tags = ["production", "sw-website"]
}

# Database connection pool
resource "digitalocean_database_connection_pool" "pool" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "app-pool"
  mode       = "transaction"
  size       = 20
  db_name    = "defaultdb"
  user       = "doadmin"
}

# Spaces (Object Storage)
resource "digitalocean_spaces_bucket" "assets" {
  name   = "sw-website-assets"
  region = "nyc3"
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

# CDN Endpoint
resource "digitalocean_cdn" "assets_cdn" {
  origin = digitalocean_spaces_bucket.assets.bucket_domain_name
}

# Outputs
output "database_url" {
  value     = digitalocean_database_cluster.postgres.uri
  sensitive = true
  description = "PostgreSQL connection string"
}

output "database_host" {
  value       = digitalocean_database_cluster.postgres.host
  description = "PostgreSQL host"
}

output "database_port" {
  value       = digitalocean_database_cluster.postgres.port
  description = "PostgreSQL port"
}

output "cdn_endpoint" {
  value       = digitalocean_cdn.assets_cdn.endpoint
  description = "CDN endpoint URL"
}

output "spaces_bucket_name" {
  value       = digitalocean_spaces_bucket.assets.name
  description = "Spaces bucket name"
}

output "spaces_bucket_domain" {
  value       = digitalocean_spaces_bucket.assets.bucket_domain_name
  description = "Spaces bucket domain"
}
