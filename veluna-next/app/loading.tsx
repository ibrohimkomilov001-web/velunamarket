// =====================================================
// LOADING STATE
// =====================================================

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Yuklanmoqda...</p>
      </div>
    </div>
  );
}
