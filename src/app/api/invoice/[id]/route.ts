import { NextResponse, type NextRequest } from "next/server";
import { getInvoiceById } from "@/lib/notion";
import { isValidNotionId } from "@/lib/utils";
import { logger } from "@/lib/logger";
import type { InvoiceApiResponse, InvoiceErrorResponse } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<InvoiceApiResponse | InvoiceErrorResponse>> {
  const { id } = await params;

  if (!isValidNotionId(id)) {
    return NextResponse.json(
      { error: "유효하지 않은 견적서 ID입니다.", code: "INVALID_ID" },
      { status: 400 }
    );
  }

  try {
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다.", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { invoice },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    logger.error("Invoice fetch failed", {
      invoiceId: id,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Internal server error", code: "NOTION_ERROR" },
      { status: 500 }
    );
  }
}
