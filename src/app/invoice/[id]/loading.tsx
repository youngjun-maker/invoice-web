import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Invoice info skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Items table skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Total skeleton */}
        <div className="mt-6 flex justify-end">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    </div>
  );
}
