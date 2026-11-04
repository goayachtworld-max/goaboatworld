export default function YachtDetailLoading() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Image gallery skeleton */}
      <div className="bms-skeleton w-full" style={{ height: '500px' }} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bms-skeleton h-10 w-3/4 rounded-xl" />
            <div className="bms-skeleton h-5 w-1/3 rounded-lg" />
            <div className="space-y-3">
              <div className="bms-skeleton h-4 w-full rounded" />
              <div className="bms-skeleton h-4 w-full rounded" />
              <div className="bms-skeleton h-4 w-2/3 rounded" />
            </div>
          </div>
          {/* Right sidebar */}
          <div className="bms-skeleton rounded-2xl h-[320px]" />
        </div>
      </div>
    </div>
  );
}
