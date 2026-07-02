export default function ProductsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14 animate-pulse">
      {/* 1. Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {/* Card 1 Large Skeleton */}
        <div className="col-span-1 md:col-span-2 md:row-span-2 aspect-video md:aspect-[14/10] bg-muted rounded-3xl" />

        {/* Center column stack Skeleton */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
          <div className="h-24 sm:h-28 bg-muted rounded-3xl" />
          <div className="h-24 sm:h-28 bg-muted rounded-3xl" />
        </div>

        {/* Card 4 Vertical Skeleton */}
        <div className="col-span-1 md:col-span-1 md:row-span-2 aspect-[4/5] bg-muted rounded-3xl" />
      </div>

      {/* 2. Categories Skeleton */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 sm:w-28 bg-muted rounded-2xl shrink-0"
          />
        ))}
      </div>

      {/* 3. Products List Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-muted rounded-lg" />
        <div className="h-4 w-24 bg-muted rounded-lg" />
      </div>

      {/* 4. Products Grid Skeleton */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border bg-card rounded-2xl sm:rounded-3xl p-3 flex flex-col gap-3"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-square w-full bg-muted rounded-xl sm:rounded-2xl" />

            {/* Details Placeholders */}
            <div className="space-y-2 flex-1">
              <div className="h-3 w-1/3 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>

            {/* Action Footer Placeholder */}
            <div className="flex items-center justify-between pt-2 border-t border-muted">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
