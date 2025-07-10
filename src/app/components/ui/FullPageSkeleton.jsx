import { Skeleton } from "./skeleton";

export default function FullPageSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="flex flex-col h-full w-72 border-r bg-background p-4 space-y-4">
        {/* Logo */}
        <Skeleton className="h-8 w-40 mb-6" />
        {/* Nav items */}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
        {/* Profile */}
        <div className="mt-auto flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar skeleton */}
        <div className="px-4 py-2 border-b bg-white">
          <Skeleton className="h-8 w-1/3 mb-2" />
        </div>
        {/* Main content skeleton */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 space-y-4">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-64 w-full mt-6" />
        </main>
      </div>
    </div>
  );
} 