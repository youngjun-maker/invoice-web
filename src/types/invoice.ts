// Invoice data types based on Notion database schema

export type InvoiceStatus = "대기" | "승인" | "거절";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  validUntil: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: InvoiceStatus;
}

// Notion API response types (raw)
export interface NotionInvoiceProperties {
  "견적서 번호": { title: Array<{ plain_text: string }> };
  "클라이언트명": { rich_text: Array<{ plain_text: string }> };
  "발행일": { date: { start: string } | null };
  "유효기간": { date: { start: string } | null };
  "총 금액": { number: number | null };
  "상태": { select: { name: InvoiceStatus } | null };
  "항목": { relation: Array<{ id: string }> };
}

export interface NotionItemProperties {
  "항목명": { title: Array<{ plain_text: string }> };
  "수량": { number: number | null };
  "단가": { number: number | null };
  "금액": { formula: { number: number } | null };
}

// API response types
export interface InvoiceApiResponse {
  invoice: Invoice;
}

export interface InvoiceErrorResponse {
  error: string;
  code: "NOT_FOUND" | "INVALID_ID" | "NOTION_ERROR" | "UNKNOWN";
}
