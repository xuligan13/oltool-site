import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 h-full flex flex-col">
      <div className="aspect-[4/3] bg-secondary relative flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6 sm:p-8 flex-grow">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
        
        <div className="bg-secondary rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>

        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  )
}
