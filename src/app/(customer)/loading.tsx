export default function CustomerLoading() {
  return (
    <div className="flex-1">
      {/* Skeleton hero */}
      <div className="relative min-h-[80dvh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 w-1/2 bg-muted rounded-lg animate-pulse" />
              <div className="h-5 w-full bg-muted/60 rounded animate-pulse mt-4" />
              <div className="h-5 w-5/6 bg-muted/60 rounded animate-pulse" />
              <div className="flex gap-3 mt-8">
                <div className="h-11 w-36 bg-muted rounded-full animate-pulse" />
                <div className="h-11 w-36 bg-muted/50 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
