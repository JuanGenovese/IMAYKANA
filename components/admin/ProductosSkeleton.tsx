export function ProductosSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-gray-200" />
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="h-10 bg-gray-100 border-b border-gray-100" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-gray-100 px-4 flex items-center gap-4"
          >
            <div className="h-3.5 w-32 rounded bg-gray-200" />
            <div className="h-3.5 w-20 rounded bg-gray-200" />
            <div className="h-3.5 w-10 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
