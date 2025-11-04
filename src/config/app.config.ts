const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  functionsUrl: import.meta.env.VITE_FUNCTIONS_URL || '',
  gaTrackingId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID || '',
  gtmId: import.meta.env.VITE_GTM_ID || '',
  assessmentEnabled: import.meta.env.VITE_ASSESSMENT_ENABLED === 'true',
};

export default config;
