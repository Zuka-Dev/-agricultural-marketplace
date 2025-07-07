export default function Loading() {
  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-forest-600 mx-auto mb-4"></div>
        <p className="text-soil-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
