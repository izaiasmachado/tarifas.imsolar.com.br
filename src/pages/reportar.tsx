import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";

import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";

const schema = z.object({
  tipo: z.enum(["erro", "sugestao", "duvida"], {
    required_error: "Selecione o tipo.",
  }),
  nome: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().email("E-mail inválido.").max(120),
  mensagem: z
    .string()
    .trim()
    .min(10, "Descreva com pelo menos 10 caracteres.")
    .max(2000),
});

type FormValues = z.infer<typeof schema>;

const TIPO_LABEL: Record<FormValues["tipo"], string> = {
  erro: "Reportar erro nos dados",
  sugestao: "Sugestão de melhoria",
  duvida: "Dúvida",
};

const REPORT_ENDPOINT = import.meta.env.VITE_REPORT_ENDPOINT;
const WHATSAPP = import.meta.env.VITE_WHATSAPP;
const CONTACT_EMAIL = "contato@imsolar.com.br";

export function ReportarPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "erro", nome: "", email: "", mensagem: "" },
  });

  // O sucesso do envio é derivado do estado do form, não de um useState.
  const { isSubmitSuccessful } = form.formState;

  const onSubmit = async (values: FormValues) => {
    const subject = `[Tarifas IM Solar] ${TIPO_LABEL[values.tipo]}`;
    const body = `Tipo: ${TIPO_LABEL[values.tipo]}\nNome: ${values.nome}\nE-mail: ${values.email}\n\n${values.mensagem}`;

    // Quando um endpoint estiver configurado (Formspree/Web3Forms), envia via POST.
    if (REPORT_ENDPOINT) {
      try {
        await fetch(REPORT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, subject }),
        });
        return;
      } catch {
        /* cai no fallback de e-mail abaixo */
      }
    }

    // Fallback estático: abre o cliente de e-mail do usuário.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Seo
        title="Reportar erro ou enviar sugestão"
        description="Encontrou um valor incorreto nas tarifas ou tem uma sugestão? Fale com a equipe do Tarifas IM Solar e ajude a manter os dados precisos."
        path="/reportar"
        jsonLd={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Reportar erro", path: "/reportar" },
        ])}
      />

      <PageHeader
        title="Reportar erro ou sugestão"
        description="Sua contribuição ajuda a manter as tarifas corretas e as ferramentas úteis para toda a comunidade."
        breadcrumbLabel="Reportar erro"
      />

      <div className="container max-w-2xl py-8">
        {isSubmitSuccessful ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold">Obrigado pelo contato!</h2>
              <p className="max-w-md text-muted-foreground">
                Recebemos sua mensagem. Se você usa um cliente de e-mail,
                confirme o envio na janela que abrimos. Retornaremos assim que
                possível.
              </p>
              <Button variant="outline" onClick={() => form.reset()}>
                Enviar outra mensagem
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formulário de contato</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="erro">
                              {TIPO_LABEL.erro}
                            </SelectItem>
                            <SelectItem value="sugestao">
                              {TIPO_LABEL.sugestao}
                            </SelectItem>
                            <SelectItem value="duvida">
                              {TIPO_LABEL.duvida}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="voce@exemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Usaremos apenas para responder ao seu contato.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Descreva o erro encontrado (concessionária, subgrupo, modalidade) ou sua sugestão…"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    <Send className="h-4 w-4" /> Enviar mensagem
                  </Button>
                </form>
              </Form>

              <div className="mt-6 border-t pt-6">
                <p className="mb-3 text-sm text-muted-foreground">
                  Prefere outro canal?
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
                    </a>
                  </Button>
                  {WHATSAPP && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://wa.me/${WHATSAPP}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {SITE.name} — suas informações não são compartilhadas com terceiros.
        </p>
      </div>
    </>
  );
}
