import { Client, isFullPage } from "@notionhq/client";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types";

// Initialize the Notion client (server-side only)
function getNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY environment variable is not set");
  }
  return new Client({ auth: apiKey });
}

/**
 * Fetch an invoice page from Notion by page ID.
 * Returns null if the page does not exist.
 */
export async function getInvoiceById(pageId: string): Promise<Invoice | null> {
  const notion = getNotionClient();

  let page;
  try {
    page = await notion.pages.retrieve({ page_id: pageId });
  } catch (error: unknown) {
    // Notion API returns 404 for non-existent pages
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "object_not_found"
    ) {
      return null;
    }
    throw error;
  }

  if (!isFullPage(page)) {
    return null;
  }

  const props = page.properties as Record<string, unknown>;

  // Extract invoice number (Title field)
  const titleProp = props["견적서 번호"] as
    | { title: Array<{ plain_text: string }> }
    | undefined;
  const invoiceNumber = titleProp?.title[0]?.plain_text ?? "";

  // Extract client name
  const clientProp = props["클라이언트명"] as
    | { rich_text: Array<{ plain_text: string }> }
    | undefined;
  const clientName = clientProp?.rich_text[0]?.plain_text ?? "";

  // Extract dates
  const issueDateProp = props["발행일"] as
    | { date: { start: string } | null }
    | undefined;
  const issueDate = issueDateProp?.date?.start ?? "";

  const validUntilProp = props["유효기간"] as
    | { date: { start: string } | null }
    | undefined;
  const validUntil = validUntilProp?.date?.start ?? "";

  // Extract total amount
  const amountProp = props["총 금액"] as
    | { number: number | null }
    | undefined;
  const totalAmount = amountProp?.number ?? 0;

  // Extract status
  const statusProp = props["상태"] as
    | { select: { name: string } | null }
    | undefined;
  const status = (statusProp?.select?.name ?? "대기") as InvoiceStatus;

  // Extract related item IDs
  const itemRelation = props["항목"] as
    | { relation: Array<{ id: string }> }
    | undefined;
  const itemIds = itemRelation?.relation.map((r) => r.id) ?? [];

  // Fetch all item pages in parallel
  const items = await fetchInvoiceItems(notion, itemIds);

  return {
    id: page.id,
    invoiceNumber,
    clientName,
    issueDate,
    validUntil,
    items,
    totalAmount,
    status,
  };
}

/**
 * Fetch invoice line items from their Notion pages.
 */
async function fetchInvoiceItems(
  notion: Client,
  itemIds: string[]
): Promise<InvoiceItem[]> {
  if (itemIds.length === 0) return [];

  const itemPages = await Promise.all(
    itemIds.map((id) => notion.pages.retrieve({ page_id: id }))
  );

  return itemPages
    .filter(isFullPage)
    .map((itemPage) => {
      const p = itemPage.properties as Record<string, unknown>;

      const nameProp = p["항목명"] as
        | { title: Array<{ plain_text: string }> }
        | undefined;
      const description = nameProp?.title[0]?.plain_text ?? "";

      const qtyProp = p["수량"] as { number: number | null } | undefined;
      const quantity = qtyProp?.number ?? 0;

      const priceProp = p["단가"] as { number: number | null } | undefined;
      const unitPrice = priceProp?.number ?? 0;

      const amountProp = p["금액"] as
        | { formula: { number: number } | null }
        | undefined;
      const amount = amountProp?.formula?.number ?? quantity * unitPrice;

      return {
        id: itemPage.id,
        description,
        quantity,
        unitPrice,
        amount,
      };
    });
}
