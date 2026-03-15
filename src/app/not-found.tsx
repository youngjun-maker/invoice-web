import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-lg font-medium">
          견적서를 찾을 수 없습니다
        </p>
        <p className="mt-1 text-muted-foreground">
          링크가 올바른지 확인하거나, 견적서 발행자에게 올바른 링크를
          요청해주세요.
        </p>
      </div>
    </div>
  );
}
