import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDateLong, formatDateTimeLong } from "@/lib/format";
import { DATA_PATHS } from "@/lib/data";
import { useDataset } from "@/hooks/use-dataset";
import type { DatasetMeta } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Selo "Tarifas atualizadas em …" alimentado por /data/meta.json.
 * Mostra data e hora quando o dataset traz `generatedAt`; caso contrário,
 * apenas a data (`updatedAt`).
 */
export function LastUpdated({ className }: { className?: string }) {
  const { data, isLoading } = useDataset<DatasetMeta>(DATA_PATHS.meta);

  if (isLoading) return <Skeleton className={cn("h-6 w-64", className)} />;
  if (!data) return null;

  const when = data.generatedAt
    ? formatDateTimeLong(data.generatedAt)
    : formatDateLong(data.updatedAt);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground",
        className
      )}
      title={data.fonte}
    >
      <CalendarClock className="h-3.5 w-3.5 text-primary" />
      Tarifas atualizadas em {when}
    </span>
  );
}
