/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FUNCTIONS_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_GOOGLE_ADS_ID: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_ASSESSMENT_ENABLED: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_HALAXY_BOOKING_URL: string;
  readonly VITE_HALAXY_AVAILABILITY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
