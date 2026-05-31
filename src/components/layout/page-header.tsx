import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Título da página atual exibido no breadcrumb (default = title). */
  breadcrumbLabel?: string;
}

/** Cabeçalho padrão de página: breadcrumb + título + descrição. */
export function PageHeader({
  title,
  description,
  breadcrumbLabel,
}: PageHeaderProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="container py-8 md:py-10">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" aria-label="Início">
                  <Home className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbLabel ?? title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
