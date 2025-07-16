import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className={cn("w-full", className)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="shimmer h-6 w-48 rounded"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="shimmer h-10 w-10 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="shimmer h-4 w-32 rounded"></div>
                      <div className="shimmer h-3 w-24 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="shimmer h-6 w-20 rounded-full"></div>
                    <div className="shimmer h-8 w-16 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="shimmer h-8 w-8 rounded-lg"></div>
              <div className="shimmer h-6 w-16 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="shimmer h-6 w-24 rounded"></div>
              <div className="shimmer h-4 w-full rounded"></div>
              <div className="shimmer h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="shimmer h-12 w-12 rounded-full"></div>
            <div className="space-y-2">
              <div className="shimmer h-6 w-48 rounded"></div>
              <div className="shimmer h-4 w-32 rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="shimmer h-4 w-full rounded"></div>
            <div className="shimmer h-4 w-5/6 rounded"></div>
            <div className="shimmer h-4 w-4/6 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;