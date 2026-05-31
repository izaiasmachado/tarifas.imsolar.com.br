/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint opcional para o formulário de reporte (Formspree/Web3Forms). */
  readonly VITE_REPORT_ENDPOINT?: string;
  /** Número de WhatsApp para contato/reporte (apenas dígitos, com DDI). */
  readonly VITE_WHATSAPP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
