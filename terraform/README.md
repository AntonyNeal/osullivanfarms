# Terraform Configuration for SW Website

This directory contains Terraform infrastructure-as-code (IaC) for deploying DigitalOcean resources.

## Prerequisites

- Terraform >= 1.0
- DigitalOcean API token
- DigitalOcean CLI (doctl) configured

## Resources Created

- Managed PostgreSQL database cluster
- Database connection pool
- Spaces bucket for static assets
- CDN endpoint for content delivery

## Usage

### Initialize Terraform

```bash
cd terraform
terraform init
```

### Plan deployment

```bash
terraform plan -var="do_token=YOUR_DIGITALOCEAN_TOKEN"
```

### Apply changes

```bash
terraform apply -var="do_token=YOUR_DIGITALOCEAN_TOKEN"
```

### Using a variables file (recommended)

Create `terraform.tfvars`:

```hcl
do_token     = "your-digitalocean-token"
region       = "nyc1"
project_name = "sw-website"
environment  = "production"
```

Then run:

```bash
terraform apply
```

### Destroy resources

```bash
terraform destroy -var="do_token=YOUR_DIGITALOCEAN_TOKEN"
```

## Outputs

After applying, Terraform will output:
- Database connection string (sensitive)
- Database host, port, user, and name
- CDN endpoint URL
- Spaces bucket information

View outputs:

```bash
terraform output
```

View sensitive outputs:

```bash
terraform output database_connection_string
```

## Cost Estimation

- PostgreSQL (1GB): ~$15/month
- Spaces (250GB): ~$5/month
- CDN: Usage-based

Total: ~$20-25/month for basic setup
