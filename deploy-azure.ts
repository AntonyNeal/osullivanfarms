#!/usr/bin/env ts-node
/**
 * Azure Static Web App Deployment Script
 * O'Sullivan Farms - Neo-Australian Agriculture Platform
 *
 * This script uses the SDK infrastructure module to deploy the app to Azure Static Web Apps
 *
 * Prerequisites:
 * 1. Azure CLI installed and logged in: `az login`
 * 2. GitHub repository configured
 * 3. Node.js 20+ installed
 *
 * Usage:
 *   npm run deploy:azure
 *   or
 *   npx ts-node deploy-azure.ts
 */

import { createProvider, createStack } from './sdk/src/infrastructure/factory';
import type { StackDeploymentResult } from './sdk/src/infrastructure/interfaces';

// Configuration
const CONFIG = {
  // Resource Group
  resourceGroupName: 'osullivanfarms-rg',
  location: 'eastus2', // Close to US East for demo, change as needed

  // Static Web App
  appName: 'osullivanfarms',
  repositoryUrl: 'https://github.com/AntonyNeal/osullivanfarms',
  branch: 'main',

  // Build configuration
  buildCommand: 'npm ci && npm run build',
  outputDirectory: 'dist',

  // Tags for resource organization
  tags: {
    project: 'osullivanfarms',
    environment: 'production',
    type: 'demo',
    framework: 'react-vite',
    theme: 'neo-australian',
  },
};

async function main() {
  console.log("🇦🇺 O'Sullivan Farms - Azure Deployment Script 🇦🇺\n");

  try {
    // Step 1: Create Azure provider
    console.log('📋 Step 1: Initializing Azure provider...');
    const provider = createProvider({ provider: 'azure' });
    console.log('✅ Azure provider initialized\n');

    // Step 2: Define infrastructure stack
    console.log('📋 Step 2: Defining infrastructure stack...');
    const stack = createStack(provider, {
      resourceGroup: {
        name: CONFIG.resourceGroupName,
        location: CONFIG.location,
        tags: CONFIG.tags,
      },
      staticWebApp: {
        name: CONFIG.appName,
        repositoryUrl: CONFIG.repositoryUrl,
        branch: CONFIG.branch,
        buildCommand: CONFIG.buildCommand,
        outputDirectory: CONFIG.outputDirectory,
      },
    });
    console.log('✅ Stack configured:\n');
    console.log(`   Resource Group: ${CONFIG.resourceGroupName}`);
    console.log(`   Location: ${CONFIG.location}`);
    console.log(`   App Name: ${CONFIG.appName}`);
    console.log(`   Repository: ${CONFIG.repositoryUrl}`);
    console.log(`   Branch: ${CONFIG.branch}\n`);

    // Step 3: Deploy infrastructure
    console.log('📋 Step 3: Deploying to Azure...');
    console.log('⏳ This may take 2-3 minutes...\n');

    const result: StackDeploymentResult = await stack.deploy();

    // Step 4: Display results
    console.log('\n✅ Deployment completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log("🎉 O'Sullivan Farms is now live on Azure!");
    console.log('═══════════════════════════════════════════════════════════\n');

    if (result.staticWebApp) {
      console.log('📍 Your URLs:');
      console.log(`   Default: https://${result.staticWebApp.defaultHostname}`);
      console.log(`   Preview: https://${CONFIG.appName}.azurestaticapps.net\n`);

      console.log('📊 Resource Details:');
      console.log(`   Resource Group: ${CONFIG.resourceGroupName}`);
      console.log(`   Location: ${CONFIG.location}`);
      console.log(`   App Name: ${CONFIG.appName}\n`);

      console.log('🔗 Next Steps:');
      console.log('   1. Visit your site at the URL above');
      console.log('   2. Configure custom domain in Azure Portal');
      console.log('   3. Set up GitHub Actions secret:');
      console.log('      - Go to GitHub → Settings → Secrets');
      console.log('      - Add: AZURE_STATIC_WEB_APPS_API_TOKEN');
      console.log('   4. Push to main branch to trigger auto-deployment\n');

      console.log('📚 Documentation:');
      console.log('   - Azure Portal: https://portal.azure.com');
      console.log('   - Custom Domains: See AZURE-DEPLOYMENT.md');
      console.log('   - GitHub Actions: .github/workflows/azure-static-web-apps.yml\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🦘 Fair dinkum deployment - no worries! 🇦🇺');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Export deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      provider: 'azure',
      resourceGroup: CONFIG.resourceGroupName,
      location: CONFIG.location,
      appName: CONFIG.appName,
      url: result.staticWebApp?.defaultHostname || 'pending',
      repository: CONFIG.repositoryUrl,
      branch: CONFIG.branch,
    };

    const fs = await import('fs');
    fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('💾 Deployment info saved to: deployment-info.json\n');
  } catch (error) {
    console.error('\n❌ Deployment failed!\n');

    if (error instanceof Error) {
      console.error('Error:', error.message);
      console.error('\nStack trace:', error.stack);

      // Provide helpful troubleshooting
      console.error('\n🔧 Troubleshooting:');

      if (error.message.includes('Azure CLI')) {
        console.error(
          '   - Install Azure CLI: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli'
        );
        console.error('   - Run: az login');
        console.error('   - Verify: az account show');
      } else if (error.message.includes('subscription')) {
        console.error('   - Set subscription: az account set --subscription "your-sub-id"');
        console.error('   - List subscriptions: az account list --output table');
      } else if (error.message.includes('GitHub')) {
        console.error('   - Check repository URL is correct');
        console.error('   - Verify GitHub account has repository access');
        console.error('   - Ensure repository is public or Azure has access');
      } else {
        console.error('   - Check Azure Portal for detailed error logs');
        console.error('   - Verify resource names are unique and valid');
        console.error('   - Ensure you have required Azure permissions');
      }

      console.error('\n📚 For more help:');
      console.error('   - See: AZURE-DEPLOYMENT.md');
      console.error('   - Azure docs: https://learn.microsoft.com/en-us/azure/static-web-apps/');
      console.error('   - SDK docs: sdk/INFRASTRUCTURE-GUIDE.md\n');
    } else {
      console.error('Unknown error:', error);
    }

    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Run deployment
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
