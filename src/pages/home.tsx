import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  PiggyBank,
  Receipt,
  Scale,
  Share2,
  Table2,
} from "lucide-react";

import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Seo } from "@/components/seo";
import { ShareButton } from "@/components/share-button";

const tools = [
  {
    to: "/sem-impostos",
    icon: Table2,
    title: "Tarifas de energia sem impostos",
    description:
      "Tabela com as tarifas de energia elétrica sem impostos, por concessionária, com filtros por subgrupo e modalidade.",
  },
  {
    to: "/ranking",
    icon: BarChart3,
    title: "Ranking de tarifas",
    description:
      "As concessionárias com as tarifas mais altas e mais baixas do Brasil, por subgrupo e componente tarifário.",
  },
  {
    to: "/comparar",
    icon: Scale,
    title: "Comparador de concessionárias",
    description:
      "Compare TUSD, TE e TUSD Fio B de duas ou mais concessionárias lado a lado.",
  },
  {
    to: "/simulador-conta",
    icon: Receipt,
    title: "Simulador de conta de luz",
    description:
      "Estime o custo de energia (sem impostos) a partir do consumo mensal e da concessionária, para o Grupo B.",
  },
  {
    to: "/economia-solar",
    icon: PiggyBank,
    title: "Economia com energia solar",
    description:
      "Estime a economia mensal e anual e o tempo de retorno (payback) de um sistema solar.",
  },
  {
    to: "/fator-ajuste-grupo-a",
    icon: Calculator,
    title: "Fator de ajuste TE — Grupo A",
    description:
      "Calcule a geração fora ponta necessária para compensar o consumo na ponta, em clientes Grupo A com tarifação binômia.",
  },
];

export function HomePage() {
  return (
    <>
      <Seo
        title="Tarifas de energia elétrica do Brasil"
        description={SITE.description}
        path="/"
        rawTitle={false}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Facilite seus projetos de{" "}
              <span className="text-primary">energia elétrica</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Ferramentas gratuitas para trabalhar com tarifas de energia
              elétrica no Brasil, com dados oficiais da ANEEL.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/sem-impostos">
                  Ver tarifas <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/fator-ajuste-grupo-a">Abrir calculadora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ferramentas */}
      <section className="container py-16">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
          Nossas ferramentas
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          Tudo o que você precisa para consultar e calcular tarifas de energia.
        </p>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between gap-2 text-lg">
                    {tool.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}

          <Card className="h-full bg-muted/40 sm:col-span-2">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Share2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">
                Ajude compartilhando nossas ferramentas
              </CardTitle>
              <CardDescription>
                Compartilhe com colegas que trabalham com energia solar e
                projetos elétricos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShareButton />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
