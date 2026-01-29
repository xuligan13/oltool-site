import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <header className="mb-12 space-y-4">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-16 w-3/4 max-w-2xl rounded-2xl" />
          <Skeleton className="h-6 w-1/2 max-w-xl rounded-lg" />
        </header>

        {/* Search Placeholder */}
        <div className="relative w-full max-w-2xl mx-auto mb-12">
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>

        {/* Tabs Placeholder */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-32 flex-shrink-0 rounded-2xl" />
          ))}
        </div>

        {/* Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm p-0 flex flex-col h-full">
              <Skeleton className="aspect-square w-full rounded-t-3xl" />
              <div className="p-8 space-y-4 flex-grow">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-10 w-1/2 rounded-lg" />
                <div className="h-px bg-slate-100 w-full my-2" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-12 rounded-lg" />
                  <Skeleton className="h-6 w-12 rounded-lg" />
                </div>
              </div>
              <div className="p-8 pt-0">
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
