export const SITE_CONFIG = {
  name: "견적서 시스템",
  description: "노션 기반 견적서 관리 시스템",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invoice.example.com",
} as const;

export const INVOICE_STATUS_LABELS = {
  대기: "대기",
  승인: "승인",
  거절: "거절",
} as const;

export const INVOICE_STATUS_COLORS = {
  대기: "secondary",
  승인: "default",
  거절: "destructive",
} as const satisfies Record<string, "default" | "secondary" | "destructive">;
