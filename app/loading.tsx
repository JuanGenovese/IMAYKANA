export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  );
}
