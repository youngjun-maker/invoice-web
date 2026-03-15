import { NextResponse, type NextRequest } from "next/server";
import { getInvoiceById } from "@/lib/notion";
import { isValidNotionId } from "@/lib/utils";
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

    return NextResponse.json({ invoice }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "견적서를 불러오는 중 오류가 발생했습니다.", code: "NOTION_ERROR" },
      { status: 500 }
    );
  }
}
