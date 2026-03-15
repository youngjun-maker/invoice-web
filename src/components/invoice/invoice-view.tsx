"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS, SITE_CONFIG } from "@/lib/constants";
import type { Invoice } from "@/types";

interface InvoiceViewProps {
  invoice: Invoice;
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadPDF() {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/pdf?id=${invoice.id}`);
      if (!response.ok) {
        throw new Error("PDF 생성에 실패했습니다.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `견적서_${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      // PDF download failure — surface via UI in a future iteration
    } finally {
      setIsDownloading(false);
    }
  }

  const statusVariant = INVOICE_STATUS_COLORS[invoice.status];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {SITE_CONFIG.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              견적서 번호: {invoice.invoiceNumber}
            </p>
          </div>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            size="lg"
            className="shrink-0"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                PDF 다운로드
              </>
            )}
          </Button>
        </div>

        {/* Invoice Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          {/* Invoice Meta */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold">견적서</h2>
              <Badge variant={statusVariant}>
                {INVOICE_STATUS_LABELS[invoice.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  수신인
                </p>
                <p className="mt-1 text-base font-semibold">
                  {invoice.clientName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  발행일
                </p>
                <p className="mt-1 text-base">
                  {invoice.issueDate ? formatDate(invoice.issueDate) : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  유효기간
                </p>
                <p
                  className={cn(
                    "mt-1 text-base",
                    invoice.validUntil &&
                      new Date(invoice.validUntil) < new Date() &&
                      "text-destructive"
                  )}
                >
                  {invoice.validUntil ? formatDate(invoice.validUntil) : "-"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div className="p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              견적 항목
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full">항목</TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      수량
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      단가
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      금액
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                      >
                        견적 항목이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="p-6">
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>소계</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>합계</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          본 견적서는 {SITE_CONFIG.name}을 통해 발행되었습니다.
        </p>
      </div>
    </div>
  );
}
