// PDF generation route — uses @react-pdf/renderer with NotoSansKR font
import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { InvoicePDF } from "@/components/invoice/invoice-pdf";
import { isValidNotionId } from "@/lib/utils";
import { getInvoiceById } from "@/lib/notion";
import type { InvoiceErrorResponse } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse | Response> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !isValidNotionId(id)) {
    return NextResponse.json(
      { error: "유효하지 않은 견적서 ID입니다.", code: "INVALID_ID" } satisfies InvoiceErrorResponse,
      { status: 400 }
    );
  }

  try {
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다.", code: "NOT_FOUND" } satisfies InvoiceErrorResponse,
        { status: 404 }
      );
    }

    // renderToBuffer returns a Buffer; convert to Uint8Array for the Web API Response
    const pdfBuffer = await renderToBuffer(
      createElement(InvoicePDF, { invoice }) as ReactElement<DocumentProps>
    );

    const filename = `견적서_${invoice.invoiceNumber}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg, code: "UNKNOWN" } satisfies InvoiceErrorResponse,
      { status: 500 }
    );
  }
}
