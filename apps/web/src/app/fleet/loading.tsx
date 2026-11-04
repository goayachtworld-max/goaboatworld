export default function FleetLoading() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="bms-skeleton h-4 w-20 mx-auto mb-3 rounded-full" />
          <div className="bms-skeleton h-12 w-80 mx-auto mb-4 rounded-xl" />
          <div className="bms-skeleton h-5 w-64 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bms-skeleton rounded-2xl h-[480px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
