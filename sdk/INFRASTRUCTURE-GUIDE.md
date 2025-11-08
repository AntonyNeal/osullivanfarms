# Infrastructure Guide

Complete guide to the cloud-agnostic infrastructure abstraction layer in the Service Booking Platform SDK.

## Overview

The infrastructure module provides platform-agnostic interfaces for deploying and managing cloud resources across multiple providers. Switch between Azure, DigitalOcean, AWS, GCP, Vercel, and Netlify without changing your code.

### Key Features

- **Platform Agnostic**: Write once, deploy anywhere
- **Type Safe**: Full TypeScript support with interfaces
- **Stack-Based**: Deploy multiple resources together
- **IaC Export**: Generate Terraform configurations
- **Extensible**: Easy to add new cloud providers

### Supported Providers

- ✅ **Azure**: Resource Groups, PostgreSQL, Static Web Apps, App Service, CDN, DNS, Storage
- ✅ **DigitalOcean**: Projects, Managed Databases, App Platform, Spaces, CDN, DNS
- 🔜 **AWS**: CloudFormation, RDS, Amplify, CloudFront, Route 53, S3
- 🔜 **GCP**: Projects, Cloud SQL, App Engine, Cloud CDN, Cloud DNS, Cloud Storage
- 🔜 **Vercel**: Projects, deployments, domains, edge config
- 🔜 **Netlify**: Sites, deployments, domains, edge functions

## Quick Start

### 1. Install SDK

```bash
npm install @your-org/booking-platform-sdk
```

### 2. Basic Deployment

```typescript
import { createProvider, createStack } from '@your-org/booking-platform-sdk';

// Create provider (Azure with CLI auth)
const provider = createProvider({ provider: 'azure' });

// Define infrastructure
const stack = createStack(provider, {
  resourceGroup: {
    name: 'my-booking-app',
    location: 'eastus'
  },
  database: {
    name: 'bookings-db',
    engine: 'postgres',
    version: '15',
    tier: 'basic',
    adminUsername: 'dbadmin',
    adminPassword: process.env.DB_PASSWORD!
  },
  staticWebApp: {
    name: 'booking-web',
    repositoryUrl: 'https://github.com/user/repo',
    branch: 'main',
    buildCommand: 'npm run build',
    outputDirectory: 'dist'
  }
});

// Deploy
const result = await stack.deploy();
console.log('Deployed:', result.staticWebApp?.defaultHostname);
```

### 3. Quick Deploy Helper

```typescript
import { quickDeploy } from '@your-org/booking-platform-sdk';

const result = await quickDeploy({
  provider: 'digitalocean',
  credentials: { apiToken: process.env.DO_TOKEN },
  stack: {
    resourceGroup: { name: 'my-app', location: 'nyc3' },
    staticWebApp: {
      name: 'my-web',
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    }
  }
});
```

## Provider Setup

### Azure

**Authentication**: Uses Azure CLI by default

```bash
# Install Azure CLI
# https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Set subscription (optional)
az account set --subscription "your-subscription-id"
```

**Usage**:

```typescript
import { createProvider } from '@your-org/booking-platform-sdk';

// Default (uses Azure CLI)
const azure = createProvider({ provider: 'azure' });

// Specific subscription
const azure = createProvider({
  provider: 'azure',
  credentials: { subscriptionId: 'your-sub-id' }
});
```

### DigitalOcean

**Authentication**: Requires API token

```bash
# Get token from: https://cloud.digitalocean.com/account/api/tokens
export DO_TOKEN="your_digitalocean_api_token"
```

**Usage**:

```typescript
import { createProvider } from '@your-org/booking-platform-sdk';

const ocean = createProvider({
  provider: 'digitalocean',
  credentials: { apiToken: process.env.DO_TOKEN }
});

// With Spaces (S3-compatible storage)
const ocean = createProvider({
  provider: 'digitalocean',
  credentials: {
    apiToken: process.env.DO_TOKEN,
    spacesKey: process.env.SPACES_KEY,
    spacesSecret: process.env.SPACES_SECRET
  }
});
```

### Auto-Configure

Automatically detect provider from environment:

```typescript
import { autoConfigureProvider } from '@your-org/booking-platform-sdk';

// Checks for:
// - AZURE_SUBSCRIPTION_ID or ARM_SUBSCRIPTION_ID
// - DO_TOKEN or DIGITALOCEAN_TOKEN

const provider = autoConfigureProvider();
if (!provider) {
  throw new Error('No cloud provider configured');
}
```

## Stack Configuration

### Resource Group

Container for all resources (Azure) or Project (DigitalOcean).

```typescript
const stack = createStack(provider, {
  resourceGroup: {
    name: 'my-app',
    location: 'eastus', // Azure: eastus, westus, etc. | DO: nyc3, sfo3, etc.
  }
});
```

### Database

Managed PostgreSQL, MySQL, or MariaDB database.

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  database: {
    name: 'my-db',
    engine: 'postgresql', // or 'mysql', 'mariadb'
    version: '15', // PostgreSQL: 11-16 | MySQL: 5.7, 8.0
    tier: 'basic', // 'free', 'basic', 'standard', 'premium'
    storage: 32, // GB
    adminUsername: 'dbadmin',
    adminPassword: process.env.DB_PASSWORD!
  }
});

// Get connection info
const result = await stack.deploy();
console.log('Host:', result.database?.host);
console.log('Connection:', result.database?.connectionString);
```

**Tier Mapping**:
- `free`: Azure B1ms (1 vCore, 1GB) | DO db-s-1vcpu-1gb
- `basic`: Azure B1ms | DO db-s-1vcpu-1gb
- `standard`: Azure GP_Standard_D2s_v3 | DO db-s-2vcpu-2gb
- `premium`: Azure GP_Standard_D4s_v3 | DO db-s-4vcpu-8gb

### Static Web App

SPA hosting (React, Vue, Angular, etc.).

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  staticWebApp: {
    name: 'my-web',
    repositoryUrl: 'https://github.com/user/repo', // Optional
    branch: 'main',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install' // Optional
  }
});

// Add custom domain
const app = result.staticWebApp;
await app?.addCustomDomain('www.example.com');
```

**Providers**:
- **Azure**: Static Web Apps (Free tier)
- **DigitalOcean**: App Platform (static site)

### App Service

Node.js, Python, .NET, Java, or PHP application hosting.

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  appService: {
    name: 'my-api',
    runtime: 'node', // or 'python', 'dotnet', 'java', 'php'
    runtimeVersion: '20', // Node: 18, 20 | Python: 3.9, 3.10, 3.11
    tier: 'basic',
    environmentVariables: {
      NODE_ENV: 'production',
      DATABASE_URL: '${database.connectionString}', // Reference other resources
      API_KEY: process.env.API_KEY
    }
  }
});
```

**Tier Mapping**:
- `free`: Azure F1 | DO basic-xxs
- `basic`: Azure B1 | DO basic-xxs
- `standard`: Azure S1 | DO basic-xs
- `premium`: Azure P1v2 | DO professional-xs

### Storage

Object storage (blob/file storage).

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  storage: {
    name: 'myappstorage', // Must be unique globally
    tier: 'standard',
    public: true // Allow public read access
  }
});

// Upload files
const storage = result.storage;
await storage?.upload('path/to/file.jpg', Buffer.from('...'), 'image/jpeg');
await storage?.upload('data.json', JSON.stringify({...}), 'application/json');

// List files
const files = await storage?.listFiles();
files?.forEach(file => console.log(file.name, file.size, file.url));
```

**Providers**:
- **Azure**: Blob Storage (LRS)
- **DigitalOcean**: Spaces (S3-compatible)

### CDN

Content Delivery Network for caching and global distribution.

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  staticWebApp: { /* ... */ },
  cdn: {
    name: 'my-cdn',
    origin: '${staticWebApp.defaultHostname}', // Reference other resources
    cacheRules: {
      queryStringCaching: 'IgnoreQueryString',
      compressionEnabled: true
    }
  }
});

// Purge cache
await result.cdn?.purge();
await result.cdn?.purge(['/api/*', '/assets/*']);
```

### DNS

Domain name management.

```typescript
const stack = createStack(provider, {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  staticWebApp: { /* ... */ },
  dns: {
    name: 'example.com',
    records: [
      { name: '@', type: 'A', value: '203.0.113.1', ttl: 3600 },
      { name: 'www', type: 'CNAME', value: '${staticWebApp.defaultHostname}', ttl: 3600 },
      { name: '_verification', type: 'TXT', value: 'google-site-verification=...', ttl: 3600 }
    ]
  }
});

// Add records dynamically
await result.dnsZone?.addRecord({
  name: 'api',
  type: 'CNAME',
  value: result.appService!.defaultHostname,
  ttl: 3600
});
```

## Complete Example

Full-stack booking platform deployment:

```typescript
import { createProvider, createStack } from '@your-org/booking-platform-sdk';

const provider = createProvider({ provider: 'azure' });

const stack = createStack(provider, {
  resourceGroup: {
    name: 'booking-platform-prod',
    location: 'eastus',
  },
  database: {
    name: 'bookings-db',
    engine: 'postgresql',
    version: '15',
    tier: 'standard',
    storage: 64,
    adminUsername: 'dbadmin',
    adminPassword: process.env.DB_PASSWORD!,
  },
  staticWebApp: {
    name: 'booking-web',
    repositoryUrl: 'https://github.com/user/booking-web',
    branch: 'main',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
  },
  appService: {
    name: 'booking-api',
    runtime: 'node',
    runtimeVersion: '20',
    tier: 'standard',
    environmentVariables: {
      NODE_ENV: 'production',
      DATABASE_URL: '${database.connectionString}',
      JWT_SECRET: process.env.JWT_SECRET,
      STRIPE_KEY: process.env.STRIPE_KEY,
    },
  },
  storage: {
    name: 'bookingfiles',
    tier: 'standard',
    public: false,
  },
  cdn: {
    name: 'booking-cdn',
    origin: '${staticWebApp.defaultHostname}',
  },
  dns: {
    name: 'bookingapp.com',
    records: [
      { name: 'www', type: 'CNAME', value: '${staticWebApp.defaultHostname}', ttl: 3600 },
      { name: 'api', type: 'CNAME', value: '${appService.defaultHostname}', ttl: 3600 },
    ],
  },
});

// Deploy everything
console.log('Deploying infrastructure...');
const result = await stack.deploy();

console.log('✅ Deployed successfully!');
console.log('Web:', result.staticWebApp?.defaultHostname);
console.log('API:', result.appService?.defaultHostname);
console.log('Database:', result.database?.host);

// Check status
const status = await stack.getStatus();
console.log('Stack state:', status.state);
console.log('Resources:', Object.keys(status.resources));

// Teardown (when done)
// await stack.destroy();
```

## Multi-Provider Deployment

Deploy to multiple clouds simultaneously:

```typescript
import { multiProviderDeploy } from '@your-org/booking-platform-sdk';

const results = await multiProviderDeploy({
  providers: [
    { provider: 'azure' },
    { provider: 'digitalocean', credentials: { apiToken: process.env.DO_TOKEN } }
  ],
  stack: {
    resourceGroup: { name: 'my-app', location: 'eastus' },
    staticWebApp: {
      name: 'my-web',
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    }
  }
});

console.log('Azure:', results.azure.staticWebApp?.defaultHostname);
console.log('DigitalOcean:', results.digitalocean.staticWebApp?.defaultHostname);
```

## Terraform Export

Generate Infrastructure as Code for version control and GitOps:

```typescript
import { generateTerraformModule, writeTerraformFiles } from '@your-org/booking-platform-sdk';

// Generate Terraform configuration
const tfModule = generateTerraformModule('azure', {
  resourceGroup: { name: 'my-app', location: 'eastus' },
  database: { /* ... */ },
  staticWebApp: { /* ... */ }
});

// Write files
const files = writeTerraformFiles(tfModule, './terraform');
// Creates: main.tf, variables.tf, outputs.tf, terraform.tfvars, README.md

// Use with Terraform CLI
// cd terraform
// terraform init
// terraform plan
// terraform apply
```

**Benefits**:
- **Version Control**: Track infrastructure changes in Git
- **GitOps**: Automated deployments via CI/CD
- **Review**: Pull request workflow for infra changes
- **Rollback**: Revert to previous infrastructure state
- **Documentation**: Self-documenting infrastructure

## API Reference

### Factory Functions

#### `createProvider(config: ProviderConfig): CloudProvider`

Create a cloud provider instance.

```typescript
const azure = createProvider({ provider: 'azure' });
const ocean = createProvider({
  provider: 'digitalocean',
  credentials: { apiToken: process.env.DO_TOKEN }
});
```

#### `createStack(provider: CloudProvider, config: StackConfig): IInfrastructureStack`

Create an infrastructure stack.

```typescript
const stack = createStack(provider, {
  resourceGroup: { /* ... */ },
  database: { /* ... */ }
});
```

#### `quickDeploy(config): Promise<StackDeploymentResult>`

One-liner deployment helper.

```typescript
const result = await quickDeploy({
  provider: 'azure',
  stack: { /* ... */ }
});
```

#### `multiProviderDeploy(config): Promise<Record<string, any>>`

Deploy to multiple providers.

```typescript
const results = await multiProviderDeploy({
  providers: [{ provider: 'azure' }, { provider: 'digitalocean', credentials: {...} }],
  stack: { /* ... */ }
});
```

#### `detectProvider(): 'azure' | 'digitalocean' | null`

Auto-detect provider from environment.

```typescript
const provider = detectProvider(); // Checks env vars
```

#### `autoConfigureProvider(): CloudProvider | null`

Auto-configure provider from environment.

```typescript
const provider = autoConfigureProvider(); // Ready to use
```

### Stack Methods

#### `stack.deploy(): Promise<StackDeploymentResult>`

Deploy all resources in the stack.

```typescript
const result = await stack.deploy();
```

#### `stack.destroy(): Promise<void>`

Delete all resources in the stack.

```typescript
await stack.destroy(); // Careful!
```

#### `stack.getStatus(): Promise<StackStatus>`

Get current status of the stack.

```typescript
const status = await stack.getStatus();
console.log(status.state); // 'ready', 'deploying', 'failed'
```

#### `stack.exportConfig(): Promise<string>`

Export stack configuration as JSON.

```typescript
const config = await stack.exportConfig();
fs.writeFileSync('stack.json', config);
```

### Terraform Functions

#### `generateTerraformModule(provider, config): TerraformModule`

Generate Terraform configuration.

```typescript
const tfModule = generateTerraformModule('azure', stackConfig);
```

#### `writeTerraformFiles(module, outputDir): Record<string, string>`

Write Terraform files to disk.

```typescript
const files = writeTerraformFiles(tfModule, './terraform');
```

## Troubleshooting

### Azure CLI Not Found

**Error**: `Azure CLI is not installed`

**Solution**:
```bash
# Install Azure CLI
# https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

# Verify installation
az version
```

### DigitalOcean API Token Invalid

**Error**: `DigitalOcean API token is required`

**Solution**:
```bash
# Create token: https://cloud.digitalocean.com/account/api/tokens
export DO_TOKEN="your_token_here"
```

### Resource Name Already Exists

**Error**: `Resource 'my-app' already exists`

**Solution**: Use unique names or delete existing resources

```typescript
// Add timestamp to ensure uniqueness
const stack = createStack(provider, {
  resourceGroup: {
    name: `my-app-${Date.now()}`,
    location: 'eastus'
  }
});
```

### Database Connection Failed

**Error**: `Connection to database failed`

**Solution**: Check firewall rules

```typescript
// Azure: Add firewall rule for Azure services
// Automatically added by SDK

// DigitalOcean: Add trusted sources in dashboard
// Or use App Platform connection (automatic)
```

## Best Practices

### 1. Use Environment Variables

```typescript
// ❌ Don't hardcode secrets
const password = 'SuperSecret123!';

// ✅ Use environment variables
const password = process.env.DB_PASSWORD!;
```

### 2. Tag Resources

```typescript
const stack = createStack(provider, {
  resourceGroup: {
    name: 'my-app',
    location: 'eastus',
    tags: {
      environment: 'production',
      project: 'booking-platform',
      owner: 'team-platform',
      costCenter: 'engineering'
    }
  }
});
```

### 3. Export Terraform for Production

```typescript
// Development: Direct deployment
await stack.deploy();

// Production: Export to Terraform for review & GitOps
const tfModule = generateTerraformModule('azure', stackConfig);
writeTerraformFiles(tfModule, './terraform');
// Commit to Git, review in PR, apply via CI/CD
```

### 4. Monitor Costs

```typescript
// Use smaller tiers for development
const devStack = createStack(provider, {
  database: { tier: 'free' },
  appService: { tier: 'free' }
});

// Scale up for production
const prodStack = createStack(provider, {
  database: { tier: 'standard' },
  appService: { tier: 'premium' }
});
```

### 5. Clean Up Resources

```typescript
// Always destroy test stacks
try {
  await testStack.deploy();
  // Run tests...
} finally {
  await testStack.destroy(); // Clean up
}
```

## Examples

See `/sdk/examples/infrastructure/` for more examples:

- **simple-web-app.ts**: Static site with custom domain
- **full-stack-app.ts**: Database + API + Frontend
- **multi-region.ts**: Deploy to multiple regions
- **blue-green.ts**: Blue-green deployment pattern
- **terraform-export.ts**: Generate IaC configurations

## Support

- **Issues**: https://github.com/your-org/booking-platform-sdk/issues
- **Discussions**: https://github.com/your-org/booking-platform-sdk/discussions
- **Docs**: https://docs.your-org.com/sdk/infrastructure

## License

MIT
