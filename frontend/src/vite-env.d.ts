/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_BEDROCK_REGION: string
  readonly VITE_CACHE_TTL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
