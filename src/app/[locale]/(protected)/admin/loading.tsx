export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-canvas-card rounded-lg mb-2" />
        <div className="h-4 w-32 bg-canvas-card rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-canvas-card" />
              <div>
                <div className="h-8 w-20 bg-canvas-card rounded mb-1" />
                <div className="h-3 w-24 bg-canvas-card rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas-card p-6">
            <div className="h-4 w-40 bg-canvas-card rounded mb-6" />
            <div className="flex items-end gap-2 h-40">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-canvas-card rounded-t-md" style={{ height: `${30 + Math.random() * 60}%` }} />
                  <div className="h-2 w-6 bg-canvas-card rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline + instructors row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas-card p-6">
            <div className="h-4 w-32 bg-canvas-card rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-3 w-20 bg-canvas-card rounded" />
                  <div className="flex-1 h-5 bg-canvas-card rounded-full" />
                  <div className="h-3 w-6 bg-canvas-card rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Orders + top courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas-card p-6">
            <div className="h-4 w-28 bg-canvas-card rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                  <div>
                    <div className="h-3 w-32 bg-canvas-card rounded mb-1.5" />
                    <div className="h-2.5 w-24 bg-canvas-card rounded" />
                  </div>
                  <div className="h-3 w-12 bg-canvas-card rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
