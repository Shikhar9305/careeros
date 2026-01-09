/**
 * RecommendationSkeleton Component
 * Displays loading placeholders while recommendations are being fetched
 */
const RecommendationSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          {/* Header gradient placeholder */}
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

          <div className="p-6 space-y-4">
            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded-lg w-3/4" />

            {/* Location placeholder */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />

            {/* Tags placeholder */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-24" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>

            {/* Reasons placeholder */}
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-4/6" />
            </div>

            {/* Score bar placeholder */}
            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-12" />
              </div>
              <div className="h-2 bg-gray-200 rounded-full w-full" />
            </div>

            {/* Buttons placeholder */}
            <div className="flex gap-3 pt-2">
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecommendationSkeleton
