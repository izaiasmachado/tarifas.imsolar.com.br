import { Database } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDateLong, formatDateTimeLong } from "@/lib/format";
import { DATA_PATHS } from "@/lib/data";
import { useDataset } from "@/hooks/use-dataset";
import type { DatasetMeta } from "@/lib/types";

/** Link oficial da fonte de dados (ANEEL — Dados Abertos). */
const ANEEL_DATASET_URL =
  "https://dadosabertos.aneel.gov.br/dataset/tarifas-distribuidoras-energia-eletrica";

/**
 * Rodapé de página: cita a ANEEL como fonte (com link) e a data/hora da última
 * atualização dos dados. Reforça a confiança e o SEO (E-E-A-T).
 */
export function DataSource({ className }: { className?: string }) {
  const { data } = useDataset<DatasetMeta>(DATA_PATHS.meta);

  const when = data?.generatedAt
    ? formatDateTimeLong(data.generatedAt)
    : data?.updatedAt
      ? formatDateLong(data.updatedAt)
      : null;

  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Fonte:{" "}
        <a
          href={data?.fonteUrl ?? ANEEL_DATASET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          ANEEL — Tarifas homologadas das distribuidoras (Dados Abertos)
        </a>
        {when && <> · atualizado em {when}</>}. Os valores são informativos e
        não dispensam a consulta oficial à concessionária.
      </span>
    </p>
  );
}
