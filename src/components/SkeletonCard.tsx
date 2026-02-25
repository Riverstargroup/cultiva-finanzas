import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="border-border/50 overflow-hidden">
      <Skeleton className="h-32 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}
