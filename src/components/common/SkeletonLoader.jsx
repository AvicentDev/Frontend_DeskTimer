const SkeletonLoader = ({ rowCount = 5 }) => {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <div className="bg-gray-50 p-4 space-y-4">
            {/* Encabezados */}
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={`header-${i}`} className="h-4 bg-gray-200 rounded w-1/5"></div>
              ))}
            </div>
            
            {/* Filas */}
            {[...Array(rowCount)].map((_, index) => (
              <div key={`row-${index}`} className="space-y-3">
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={`cell-${index}-${i}`} className="h-4 bg-gray-200 rounded w-1/5"></div>
                  ))}
                </div>
                <div className="h-px bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SkeletonLoader;