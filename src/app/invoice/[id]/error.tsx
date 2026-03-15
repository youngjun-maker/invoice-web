"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InvoiceError({ reset }: InvoiceErrorProps) {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          견적서를 불러올 수 없습니다
        </h1>
        <p className="mt-2 text-muted-foreground">
          잠시 후 다시 시도해주세요. 문제가 지속되면 견적서 발행자에게
          문의해주세요.
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  );
}
