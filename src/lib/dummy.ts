// src/lib/dummy.ts
import type { Invoice, InvoiceStatus } from "@/types/invoice";

// ──────────────────────────────────────────────
// 대기 상태 더미 견적서 (Notion 실제 데이터 기반: INV-2025-001)
// ──────────────────────────────────────────────
export const DUMMY_INVOICE: Invoice = {
  id: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
  invoiceNumber: "INV-2025-001",
  clientName: "ABC 주식회사",
  issueDate: "2025-10-07",
  validUntil: "2026-03-17",
  status: "대기",
  items: [
    {
      id: "11111111111111111111111111111111",
      description: "웹사이트 디자인",
      quantity: 1,
      unitPrice: 5_000_000,
      amount: 5_000_000,
    },
    {
      id: "22222222222222222222222222222222",
      description: "프론트엔드 개발",
      quantity: 1,
      unitPrice: 8_000_000,
      amount: 8_000_000,
    },
    {
      id: "33333333333333333333333333333333",
      description: "유지보수 (1개월)",
      quantity: 3,
      unitPrice: 500_000,
      amount: 1_500_000,
    },
  ],
  totalAmount: 14_500_000,
};

// ──────────────────────────────────────────────
// 대기 상태 더미 견적서
// ──────────────────────────────────────────────
export const DUMMY_INVOICE_PENDING: Invoice = {
  id: "b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5",
  invoiceNumber: "INV-2026-002",
  clientName: "홍길동 개인사업자",
  issueDate: "2026-03-10",
  validUntil: "2026-04-10",
  status: "대기",
  items: [
    {
      id: "44444444444444444444444444444444",
      description: "로고 디자인 제작",
      quantity: 1,
      unitPrice: 500_000,
      amount: 500_000,
    },
    {
      id: "55555555555555555555555555555555",
      description: "명함 및 브랜드 가이드라인",
      quantity: 1,
      unitPrice: 350_000,
      amount: 350_000,
    },
  ],
  totalAmount: 850_000,
};

// ──────────────────────────────────────────────
// 거절 상태 더미 견적서
// ──────────────────────────────────────────────
export const DUMMY_INVOICE_REJECTED: Invoice = {
  id: "c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6",
  invoiceNumber: "INV-2026-003",
  clientName: "(주)테스트코리아",
  issueDate: "2026-02-15",
  validUntil: "2026-03-15",
  status: "거절",
  items: [
    {
      id: "66666666666666666666666666666666",
      description: "모바일 앱 개발 (iOS/Android)",
      quantity: 1,
      unitPrice: 8_000_000,
      amount: 8_000_000,
    },
    {
      id: "77777777777777777777777777777777",
      description: "백엔드 API 서버 구축",
      quantity: 1,
      unitPrice: 3_500_000,
      amount: 3_500_000,
    },
    {
      id: "88888888888888888888888888888888",
      description: "QA 테스트 및 버그 수정",
      quantity: 2,
      unitPrice: 600_000,
      amount: 1_200_000,
    },
  ],
  totalAmount: 12_700_000,
};

// ──────────────────────────────────────────────
// 상태별 더미 견적서 맵
// ──────────────────────────────────────────────
const DUMMY_INVOICES_BY_STATUS: Record<InvoiceStatus, Invoice> = {
  승인: DUMMY_INVOICE,
  대기: DUMMY_INVOICE_PENDING,
  거절: DUMMY_INVOICE_REJECTED,
};

/**
 * id 또는 상태 키워드를 기반으로 더미 견적서를 반환한다.
 * - id가 "pending" 또는 "대기"이면 대기 상태 반환
 * - id가 "rejected" 또는 "거절"이면 거절 상태 반환
 * - 그 외 모든 경우 승인 상태(기본) 반환
 */
export function getDummyInvoice(id?: string): Invoice {
  if (id !== undefined) {
    const normalized = id.toLowerCase();
    if (normalized === "pending" || normalized === "대기") {
      return DUMMY_INVOICES_BY_STATUS["대기"];
    }
    if (normalized === "rejected" || normalized === "거절") {
      return DUMMY_INVOICES_BY_STATUS["거절"];
    }
  }
  return DUMMY_INVOICES_BY_STATUS["승인"];
}
