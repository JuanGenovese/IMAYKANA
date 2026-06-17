import { Card, CardContent } from "@/components/ui/card";

export function CartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="rounded-3xl border border-muted bg-card">
          <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-[96px_1fr]">
            {/* Image Skeleton */}
            <div className="aspect-[4/5] w-24 rounded-2xl bg-muted" />

            {/* Info Skeleton */}
            <div className="flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 w-full">
                  {/* Category placeholder */}
                  <div className="h-3.5 w-20 rounded bg-muted" />
                  {/* Title placeholder */}
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  {/* Size placeholder */}
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>

                {/* Trash icon placeholder */}
                <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0" />
              </div>

              {/* Price placeholder */}
              <div className="h-4 w-28 rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
