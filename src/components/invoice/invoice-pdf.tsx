import path from "path";
import { readFileSync } from "fs";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice } from "@/types";

// Register Noto Sans KR TTF fonts for Korean character support.
// Fonts are read with fs.readFileSync and embedded as base64 data URIs because:
//   1. @react-pdf/renderer v4 uses fetch() internally for font src strings.
//   2. On Windows, path.join() produces backslash paths that the library
//      rejects as "Unknown font format".
//   3. Node's fetch() does not support file:// URLs.
// Encoding as data: URIs bypasses fetch entirely and works cross-platform.
function fontDataUri(filename: string): string {
  const buf = readFileSync(
    path.join(process.cwd(), "public", "fonts", filename)
  );
  return `data:font/truetype;base64,${buf.toString("base64")}`;
}

Font.register({
  family: "NotoSansKR",
  fonts: [
    { src: fontDataUri("NotoSansKR-Regular.ttf"), fontWeight: 400 },
    { src: fontDataUri("NotoSansKR-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
  },
  metaGrid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 8",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colDescription: { flex: 1 },
  colQty: { width: 50, textAlign: "right" },
  colUnitPrice: { width: 80, textAlign: "right" },
  colAmount: { width: 90, textAlign: "right", fontWeight: "bold" },
  headerText: {
    fontSize: 9,
    color: "#6b7280",
    fontWeight: "bold",
  },
  totalSection: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  totalBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "6 0",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  totalLabel: {
    color: "#6b7280",
    fontSize: 10,
  },
  totalAmount: {
    fontSize: 10,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10 0",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  grandTotalAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function formatDateKR(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

interface InvoicePDFProps {
  invoice: Invoice;
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document
      title={`견적서 ${invoice.invoiceNumber}`}
      author="견적서 시스템"
      subject={`${invoice.clientName} 견적서`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>견적서</Text>
          <Text style={styles.invoiceNumber}>
            No. {invoice.invoiceNumber}
          </Text>
        </View>

        {/* Meta information */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>수신인</Text>
            <Text style={styles.metaValue}>{invoice.clientName}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>발행일</Text>
            <Text style={styles.metaValue}>
              {formatDateKR(invoice.issueDate)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>유효기간</Text>
            <Text style={styles.metaValue}>
              {formatDateKR(invoice.validUntil)}
            </Text>
          </View>
        </View>

        {/* Items table */}
        <Text style={styles.sectionTitle}>견적 항목</Text>
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colDescription]}>
              항목
            </Text>
            <Text style={[styles.headerText, styles.colQty]}>수량</Text>
            <Text style={[styles.headerText, styles.colUnitPrice]}>단가</Text>
            <Text style={[styles.headerText, styles.colAmount]}>금액</Text>
          </View>

          {/* Table rows */}
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>
                {item.quantity.toLocaleString("ko-KR")}
              </Text>
              <Text style={styles.colUnitPrice}>
                {formatKRW(item.unitPrice)}
              </Text>
              <Text style={styles.colAmount}>{formatKRW(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>소계</Text>
              <Text style={styles.totalAmount}>
                {formatKRW(invoice.totalAmount)}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>합계</Text>
              <Text style={styles.grandTotalAmount}>
                {formatKRW(invoice.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          본 견적서는 견적서 시스템을 통해 자동 생성되었습니다.
        </Text>
      </Page>
    </Document>
  );
}
