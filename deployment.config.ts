/**
 * Deployment Configuration
 *
 * This file controls which cloud provider is used for deployment.
 * Set before first deployment to avoid conflicting CI/CD workflows.
 */

export type DeploymentProvider = 'azure' | 'digitalocean' | 'both' | 'none';

export interface DeploymentConfig {
  /**
   * Primary deployment provider
   * - 'azure': Azure Static Web Apps
   * - 'digitalocean': DigitalOcean App Platform
   * - 'both': Multi-cloud deployment
   * - 'none': Manual deployment only
   */
  provider: DeploymentProvider;

  /**
   * Enable GitHub Actions workflows
   */
  cicd: {
    azure: boolean;
    digitalocean: boolean;
  };

  /**
   * Custom configuration per provider
   */
  azure?: {
    resourceGroup: string;
    location: string;
    appName: string;
  };

  digitalocean?: {
    region: string;
    appName: string;
  };
}

/**
 * Current deployment configuration
 *
 * CHANGE THIS BEFORE FIRST DEPLOYMENT
 */
export const deploymentConfig: DeploymentConfig = {
  // Set to 'azure', 'digitalocean', 'both', or 'none'
  provider: 'azure',

  // Enable/disable CI/CD workflows
  cicd: {
    azure: true,
    digitalocean: false, // Disabled for Azure-only deployment
  },

  // Azure configuration
  azure: {
    resourceGroup: 'osullivanfarms-rg',
    location: 'eastus2',
    appName: 'osullivanfarms',
  },

  // DigitalOcean configuration (optional)
  digitalocean: {
    region: 'nyc3',
    appName: 'osullivanfarms',
  },
};

/**
 * Validate deployment configuration
 */
export function validateDeploymentConfig(config: DeploymentConfig): string[] {
  const errors: string[] = [];

  if (config.provider === 'azure' && !config.azure) {
    errors.push('Azure provider selected but no Azure configuration provided');
  }

  if (config.provider === 'digitalocean' && !config.digitalocean) {
    errors.push('DigitalOcean provider selected but no DigitalOcean configuration provided');
  }

  if (config.provider === 'both') {
    if (!config.azure) errors.push('Multi-cloud deployment requires Azure configuration');
    if (!config.digitalocean)
      errors.push('Multi-cloud deployment requires DigitalOcean configuration');
  }

  // Check CI/CD consistency
  if (config.provider === 'azure' && config.cicd.digitalocean) {
    errors.push(
      'Warning: Azure provider selected but DigitalOcean CI/CD is enabled. This may cause conflicts.'
    );
  }

  if (config.provider === 'digitalocean' && config.cicd.azure) {
    errors.push(
      'Warning: DigitalOcean provider selected but Azure CI/CD is enabled. This may cause conflicts.'
    );
  }

  return errors;
}

/**
 * Check if provider workflows are correctly configured
 */
export function checkWorkflowAlignment(): {
  aligned: boolean;
  issues: string[];
} {
  const config = deploymentConfig;
  const issues: string[] = [];

  // This would check actual workflow files in .github/workflows/
  // For now, just validate config consistency
  if (config.provider === 'azure' && config.cicd.digitalocean) {
    issues.push(
      'Azure deployment configured but DigitalOcean workflow is enabled. Disable .github/workflows/deploy.yml'
    );
  }

  if (config.provider === 'digitalocean' && config.cicd.azure) {
    issues.push(
      'DigitalOcean deployment configured but Azure workflow is enabled. Disable .github/workflows/azure-static-web-apps.yml'
    );
  }

  if (config.provider === 'none' && (config.cicd.azure || config.cicd.digitalocean)) {
    issues.push('Manual deployment selected but CI/CD workflows are enabled');
  }

  return {
    aligned: issues.length === 0,
    issues,
  };
}

/**
 * Get required environment variables/secrets for current provider
 */
export function getRequiredSecrets(config: DeploymentConfig): string[] {
  const secrets: string[] = [];

  if (config.provider === 'azure' || config.provider === 'both') {
    secrets.push('AZURE_STATIC_WEB_APPS_API_TOKEN');
  }

  if (config.provider === 'digitalocean' || config.provider === 'both') {
    secrets.push('DIGITALOCEAN_ACCESS_TOKEN', 'APP_ID');
  }

  return secrets;
}
