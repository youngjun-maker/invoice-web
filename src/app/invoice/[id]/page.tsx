import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvoiceById } from "@/lib/notion";
import { isValidNotionId } from "@/lib/utils";
import { InvoiceView } from "@/components/invoice/invoice-view";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params;

  if (!isValidNotionId(id)) {
    return { title: "견적서를 찾을 수 없습니다" };
  }

  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return { title: "견적서를 찾을 수 없습니다" };
  }

  return {
    title: `견적서 ${invoice.invoiceNumber}`,
    description: `${invoice.clientName} 견적서`,
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  // Validate Notion ID format before making an API call
  if (!isValidNotionId(id)) {
    notFound();
  }

  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceView invoice={invoice} />;
}
