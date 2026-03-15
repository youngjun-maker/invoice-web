import { FileText } from "lucide-react";

// Root page: the system is accessed via /invoice/[id] links only.
// This page serves as a landing for direct root URL visits.
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 시스템</h1>
        <p className="mt-2 text-muted-foreground">
          견적서 링크를 통해 접속해주세요.
        </p>
      </div>
    </div>
  );
}
