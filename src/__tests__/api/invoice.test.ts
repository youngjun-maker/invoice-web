import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock server-only modules before importing the route handler
vi.mock("@/lib/notion", () => ({
  getInvoiceById: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Import after mocks are set up
import { GET } from "@/app/api/invoice/[id]/route";
import { getInvoiceById } from "@/lib/notion";
import type { Invoice } from "@/types/invoice";

const mockGetInvoiceById = vi.mocked(getInvoiceById);

const VALID_ID = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4";

const MOCK_INVOICE: Invoice = {
  id: VALID_ID,
  invoiceNumber: "INV-001",
  clientName: "테스트 클라이언트",
  issueDate: "2024-01-15",
  validUntil: "2024-02-15",
  totalAmount: 1000000,
  status: "대기",
  items: [
    {
      id: "item-1",
      description: "디자인 작업",
      quantity: 1,
      unitPrice: 1000000,
      amount: 1000000,
    },
  ],
};

function makeRequest(id: string): [NextRequest, { params: Promise<{ id: string }> }] {
  const request = new NextRequest(`http://localhost:3000/api/invoice/${id}`);
  const context = { params: Promise.resolve({ id }) };
  return [request, context];
}

describe("GET /api/invoice/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for an invalid Notion ID", async () => {
    const [req, ctx] = makeRequest("invalid-id");
    const response = await GET(req, ctx);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.code).toBe("INVALID_ID");
  });

  it("returns 400 for an empty ID", async () => {
    const [req, ctx] = makeRequest("");
    const response = await GET(req, ctx);

    expect(response.status).toBe(400);
  });

  it("returns 404 when getInvoiceById returns null", async () => {
    mockGetInvoiceById.mockResolvedValueOnce(null);

    const [req, ctx] = makeRequest(VALID_ID);
    const response = await GET(req, ctx);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe("NOT_FOUND");
    expect(mockGetInvoiceById).toHaveBeenCalledWith(VALID_ID);
  });

  it("returns 200 with invoice data when found", async () => {
    mockGetInvoiceById.mockResolvedValueOnce(MOCK_INVOICE);

    const [req, ctx] = makeRequest(VALID_ID);
    const response = await GET(req, ctx);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.invoice).toEqual(MOCK_INVOICE);
    expect(mockGetInvoiceById).toHaveBeenCalledWith(VALID_ID);
  });

  it("returns 200 with Cache-Control header on success", async () => {
    mockGetInvoiceById.mockResolvedValueOnce(MOCK_INVOICE);

    const [req, ctx] = makeRequest(VALID_ID);
    const response = await GET(req, ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=60");
  });

  it("returns 500 when getInvoiceById throws an error", async () => {
    mockGetInvoiceById.mockRejectedValueOnce(new Error("Notion API timeout"));

    const [req, ctx] = makeRequest(VALID_ID);
    const response = await GET(req, ctx);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("NOTION_ERROR");
  });

  it("accepts a hyphenated UUID-format Notion ID", async () => {
    const hyphenatedId = "a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4";
    mockGetInvoiceById.mockResolvedValueOnce(MOCK_INVOICE);

    const [req, ctx] = makeRequest(hyphenatedId);
    const response = await GET(req, ctx);

    expect(response.status).toBe(200);
  });
});
