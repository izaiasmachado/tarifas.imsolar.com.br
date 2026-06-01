import { Link } from "react-router-dom";

import { SITE } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";

const faqs = [
  {
    q: "O que são tarifas de energia sem impostos?",
    a: "São os componentes da tarifa de energia elétrica (TUSD e TE) sem a incidência de tributos como ICMS, PIS e COFINS. Esses valores são úteis para dimensionar projetos de geração distribuída e comparar concessionárias, pois os impostos variam por estado e por situação do cliente.",
  },
  {
    q: "O que é TUSD, TE e TUSD Fio B?",
    a: "A TUSD (Tarifa de Uso do Sistema de Distribuição) remunera o uso da rede. A TE (Tarifa de Energia) cobre a compra de energia. A TUSD Fio B é a parcela da TUSD associada à distribuição, usada no cálculo da compensação da geração distribuída conforme a Lei 14.300/2022.",
  },
  {
    q: "O que é o fator de ajuste da TE no Grupo A?",
    a: "No Grupo A com tarifação binômia (modalidades azul e verde), a TE da ponta é mais cara que a da fora ponta. O fator de ajuste (TE fora ponta ÷ TE ponta) indica quanta energia gerada na fora ponta é necessária para compensar 1 kWh consumido na ponta. Nossa calculadora faz essa conta automaticamente.",
  },
  {
    q: "De onde vêm os dados das tarifas?",
    a: "Os dados são extraídos da base pública de Tarifas Homologadas das Distribuidoras de Energia Elétrica da ANEEL (Dados Abertos). Consideramos a tarifa de aplicação vigente de cada distribuidora.",
  },
  {
    q: "Com que frequência as tarifas são atualizadas?",
    a: "A ANEEL revisa as tarifas das distribuidoras ao longo do ano (reajustes e revisões tarifárias). Atualizamos nossa base periodicamente; a data da última atualização é exibida no topo das ferramentas.",
  },
  {
    q: "Posso usar esses valores para faturamento oficial?",
    a: "Não. As informações são apenas para fins de estudo e dimensionamento. Os valores oficiais devem sempre ser confirmados junto à ANEEL e à concessionária responsável.",
  },
  {
    q: "Encontrei um valor incorreto. Como reporto?",
    a: "Use a página de reportar erro para nos enviar a correção. Conferimos cada relato contra a base da ANEEL antes de atualizar.",
  },
];

export function DuvidasPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <Seo
        title="Dúvidas frequentes sobre tarifas de energia"
        description="Perguntas frequentes sobre tarifas de energia sem impostos, TUSD, TE, TUSD Fio B e o fator de ajuste da TE no Grupo A. Entenda os conceitos por trás das ferramentas."
        path="/duvidas"
        keywords={[
          "o que é TUSD",
          "o que é TE",
          "TUSD Fio B",
          "fator de ajuste",
          "tarifa sem impostos",
          "Lei 14.300",
          "geração distribuída",
          "dúvidas tarifa de energia",
        ]}
        jsonLd={[
          faqJsonLd,
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Dúvidas", path: "/duvidas" },
          ]),
        ]}
      />

      <PageHeader
        title="Dúvidas frequentes"
        description="Conceitos essenciais sobre tarifas de energia elétrica e como usar nossas ferramentas."
      />

      <div className="container max-w-3xl py-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-sm text-muted-foreground">
          Não encontrou sua dúvida?{" "}
          <Link to="/reportar" className="font-medium text-primary underline-offset-4 hover:underline">
            Fale com a gente
          </Link>
          . Conheça também a {SITE.company} em{" "}
          <a
            href={SITE.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            imsolar.com.br
          </a>
          .
        </p>
      </div>
    </>
  );
}
