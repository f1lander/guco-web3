export function LevelCardSkeleton() {
  return (
    <div className="relative p-6 rounded-lg border-2 bg-gray-200 dark:bg-gray-800 animate-pulse-opacity">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse-opacity" />
      <div className="relative flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse-opacity" />
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse-opacity" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse-opacity" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse-opacity" />
        </div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse-opacity" />
      </div>
    </div>
  );
}
