import React from "react";
import "./styles.css";
import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

export default function Terms() {
  return (
    <div className="terms-container">
      <div className="terms">
        <div className="Terms__title-container">
          <Typography variant="h4" component="h1" gutterBottom>
            Termos de Uso
          </Typography>
        </div>

        <Breadcrumbs className="Header__breadcrumbs">
          <Link underline="hover" color="inherit" href="/">
            Página Principal
          </Link>
          <Typography color="text.primary">Termos de Uso</Typography>
        </Breadcrumbs>

        <div className="Terms__content-container">
          <Typography variant="body1" gutterBottom>
            <p>
              Bem-vindo ao nosso site! Este site fornece informações atualizadas
              sobre tarifas de energia elétrica em todo o Brasil. Ao acessar e
              usar este site, você concorda com os seguintes termos e condições:{" "}
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            1. Propriedade Intelectual
          </Typography>

          <Typography variant="body1" gutterBottom>
            <p>
              Todos os conteúdos deste site, incluindo textos, gráficos,
              imagens, logotipos e ícones, são de propriedade exclusiva deste
              site e estão protegidos pelas leis de direitos autorais e
              propriedade intelectual. O uso não autorizado de qualquer conteúdo
              deste site é estritamente proibido.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            2. Informações do Site
          </Typography>

          <Typography variant="body1" gutterBottom>
            <p>
              As informações deste site são fornecidas apenas para fins
              informativos e não constituem aconselhamento jurídico, financeiro
              ou profissional de qualquer tipo. As informações são atualizadas
              periodicamente, mas não garantimos que sejam precisas, completas
              ou atualizadas.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            3. Uso do Site
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>
              Você concorda em usar este site apenas para fins legais e de
              acordo com estes termos de uso. Você não deve usar este site de
              qualquer forma que possa prejudicar, desativar, sobrecarregar ou
              danificar o site ou interferir no uso de qualquer outra pessoa do
              site. Você não deve tentar obter acesso não autorizado a qualquer
              parte do site, outros sistemas ou redes conectados ao site, ou
              informações de outros usuários do site.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            4. Responsabilidade
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>
              Este site não será responsável por qualquer perda ou dano,
              incluindo, sem limitação, perda de lucros, interrupção de negócios
              ou perda de informações, decorrente do uso ou incapacidade de uso
              deste site, mesmo se tivermos sido informados da possibilidade de
              tais danos.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            5. Links para Sites de Terceiros
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>
              Este site pode conter links para sites de terceiros que não são
              controlados por nós. Não somos responsáveis pelo conteúdo,
              políticas ou práticas de privacidade de sites de terceiros. A
              inclusão de links para sites de terceiros não implica endosso ou
              associação com seus operadores.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            6. Modificações dos Termos de Uso
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>
              Podemos modificar estes termos de uso a qualquer momento, sem
              aviso prévio. O uso continuado deste site após a publicação de
              quaisquer alterações nos termos de uso constituirá sua aceitação
              dessas alterações.
            </p>
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom>
            7. Lei Aplicável
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>
              Estes termos de uso serão regidos e interpretados de acordo com as
              leis do Brasil.
            </p>
          </Typography>
        </div>
      </div>
    </div>
  );
}
