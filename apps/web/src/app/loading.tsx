export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 border-[#3D9B7D] border-t-transparent"
          style={{ animation: 'bmsSpinner 0.7s linear infinite' }}
        />
        <p className="text-[#1A3C35] font-semibold text-[14px]">Loading…</p>
      </div>
      <style>{`
        @keyframes bmsSpinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
