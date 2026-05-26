import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProjectsSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-32 w-full rounded-none" />
          <CardHeader className="pb-2 pt-4 px-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2 mt-1" />
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-3">
            <Skeleton className="h-1.5 w-full" />
            <div className="grid grid-cols-2 gap-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t">
            <Skeleton className="h-6 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function ProjectsSkeletonTable({ count = 6 }: { count?: number }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="p-4 border-b bg-muted/40">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="divide-y">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20 hidden sm:block" />
            <Skeleton className="h-5 w-16 hidden md:block" />
            <Skeleton className="h-1.5 w-32 hidden lg:block" />
            <Skeleton className="h-4 w-16 hidden xl:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
