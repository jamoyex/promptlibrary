/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_DASHBOARD_URL?: string;
  readonly VITE_EDIT_AGENT_BASE_URL?: string;
  readonly VITE_EDIT_VOICE_AGENT_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
