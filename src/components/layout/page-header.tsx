import { Fragment } from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  /**
   * Cadeia de breadcrumbs ATÉ a página atual (sem incluir "Início", que é
   * sempre o primeiro). A última deve ser a página atual (sem `to`).
   * Default: um único item com o `title`.
   */
  breadcrumb?: Crumb[];
}

/** Cabeçalho padrão de página: breadcrumb (shadcn/ui) + título + descrição. */
export function PageHeader({ title, description, breadcrumb }: PageHeaderProps) {
  const crumbs: Crumb[] = breadcrumb ?? [{ label: title }];

  return (
    <div className="border-b bg-muted/30">
      <div className="container py-8 md:py-10">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${i}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast || !crumb.to ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.to}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
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
