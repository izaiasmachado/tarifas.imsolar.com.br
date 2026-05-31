import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";

const sections = [
  {
    title: "1. Propriedade intelectual",
    body: "Todos os conteúdos deste site, incluindo textos, gráficos, imagens, logotipos e ícones, são de propriedade exclusiva deste site e estão protegidos pelas leis de direitos autorais e propriedade intelectual. O uso não autorizado de qualquer conteúdo deste site é estritamente proibido.",
  },
  {
    title: "2. Informações do site",
    body: "As informações deste site são fornecidas apenas para fins informativos e não constituem aconselhamento jurídico, financeiro ou profissional de qualquer tipo. As informações são atualizadas periodicamente, mas não garantimos que sejam precisas, completas ou atualizadas. As tarifas oficiais devem sempre ser confirmadas junto à ANEEL e à concessionária.",
  },
  {
    title: "3. Uso do site",
    body: "Você concorda em usar este site apenas para fins legais e de acordo com estes termos de uso. Você não deve usar este site de qualquer forma que possa prejudicar, desativar, sobrecarregar ou danificar o site, ou interferir no uso por terceiros.",
  },
  {
    title: "4. Responsabilidade",
    body: "Este site não será responsável por qualquer perda ou dano, incluindo, sem limitação, perda de lucros, interrupção de negócios ou perda de informações, decorrente do uso ou da incapacidade de uso deste site.",
  },
  {
    title: "5. Links para sites de terceiros",
    body: "Este site pode conter links para sites de terceiros que não são controlados por nós. Não somos responsáveis pelo conteúdo, políticas ou práticas de privacidade de sites de terceiros.",
  },
  {
    title: "6. Modificações dos termos de uso",
    body: "Podemos modificar estes termos de uso a qualquer momento, sem aviso prévio. O uso continuado deste site após a publicação de quaisquer alterações constituirá sua aceitação dessas alterações.",
  },
  {
    title: "7. Lei aplicável",
    body: "Estes termos de uso serão regidos e interpretados de acordo com as leis do Brasil.",
  },
];

export function TermosPage() {
  return (
    <>
      <Seo
        title="Termos de uso"
        description="Termos e condições de uso do site de ferramentas de tarifas de energia da IM Solar."
        path="/termos-de-uso"
        jsonLd={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Termos de uso", path: "/termos-de-uso" },
        ])}
      />

      <PageHeader title="Termos de uso" />

      <div className="container max-w-3xl py-8">
        <p className="mb-8 text-muted-foreground">
          Bem-vindo ao nosso site! Este site fornece informações sobre tarifas
          de energia elétrica em todo o Brasil. Ao acessar e usar este site,
          você concorda com os seguintes termos e condições.
        </p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
              <p className="leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
