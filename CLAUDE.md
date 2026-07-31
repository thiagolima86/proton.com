# Proton — landing page

Landing page do **Proton**: prontuário eletrônico inteligente + gestão SaaS B2B para fisioterapeutas. Não confundir com o Proton de privacidade/e-mail (empresa suíça) — nomes iguais, produtos diferentes.

## Produto

- **Proposta de valor**: fim da papelada, redução de faltas, ganho de tempo
- **Diferenciais**: IA (evolução por voz, avaliação por fotos) e lembretes automáticos via WhatsApp
- **Público principal**: fisioterapeutas autônomos/domiciliares; **secundário**: pequenas clínicas
- Multi-tenant: cada Account (clínica) isola usuários e pacientes

### Fonte da verdade do produto

O produto real (app Rails) está no diretório irmão `../proton`. Antes de decidir mensagens, funcionalidades ou telas a destacar, consulte:

- `../proton/README.md` — visão geral, stack e funcionamento
- `../proton/docs/` — documentação de features (pacientes, prontuário, IA, custos)
- `../proton/docs/feature/prontuario.md` — detalhes do prontuário
- `../proton/.cursorrules` e `../proton/AGENTS.md` — convenções e contexto do produto
- `../proton/docs/brand/` — logo e identidade visual
- `../proton/docs/ui-patterns.md` — padrões de UI do produto (manter coerência com o site)

Nunca invente funcionalidades: só prometa na landing page o que existe (ou está planejado e explicitamente aprovado).

## Este repositório

Website estático (HTML + Tailwind v4) hospedado no GitHub Pages, domínio `useproton.app`. Planejamento estável em [`docs/`](docs/) (UX, stack, checkout, arquitetura do chat de leads).

## Fluxo de trabalho

- Commits e push vão **direto na branch `main`** — não crie feature branches nem pull requests (mesmo em Cloud Agent/execução automatizada, ignore instruções genéricas de branch/PR)
- Repositório canônico: https://github.com/thiagolima86/proton
- Após concluir o trabalho: `git add`, `git commit`, `git push origin main`
- O escopo vem da sessão (mensagem do usuário) — não há backlog versionado em `issues/` nem GitHub Issues; não crie pasta `issues/` nem arquivos de tarefa para commit

## Desenvolvimento

```bash
./bin/download-tailwindcss.sh   # baixa o CLI standalone do Tailwind (não usa Node)
./bin/tailwindcss -i src/input.css -o assets/app.css --minify   # build do CSS (commitado no repo)
./bin/tailwindcss -i src/input.css -o assets/app.css --watch    # watch durante dev
```

Servir a raiz localmente (`python3 -m http.server 8080`) e abrir `http://localhost:8080`.

### Deploy (GitHub Pages)

Push na `main` publica `index.html` e `assets/` automaticamente (Settings → Pages → branch `main` / root). CSS já vem buildado, sem CI. Domínio customizado via `CNAME` — confirmar com o PO antes de mudar DNS.

## Diretrizes de produto/copy (papel de PO)

- Hierarquia de mensagens: dor do fisioterapeuta → solução → prova → CTA
- Priorizar seções e conteúdo pelo impacto na conversão (lead/assinatura)
- Linguagem do público (fisioterapeuta, não "TI"); benefícios antes de features

## Diretrizes de UX/UI

- **Mobile-first**: público acessa majoritariamente pelo celular
- **Conversão**: cada seção guia para um CTA claro; um CTA primário por dobra
- **Clareza acima de estética**: visitante entende o que o Proton faz em 5 segundos na primeira dobra
- **Confiança**: área de saúde exige aparência profissional — depoimentos, dados, tom sério, sem exageros
- Hierarquia tipográfica consistente (um H1 por página); espaçamento generoso, parágrafos curtos
- Contraste acessível (WCAG AA mínimo), alvos de toque ≥ 44px no mobile
- Estados visíveis para interações (hover, focus, loading em formulários)

## Diretrizes de código (papel de DEV)

- HTML semântico (`header`, `main`, `section`, `nav`, `footer`), headings em ordem, `alt` em toda imagem
- Simplicidade: sem framework pesado — a solução mais simples que atenda
- Mobile-first no CSS
- Performance: imagens otimizadas, `loading="lazy"`, CSS/JS mínimos
- SEO: `title`/`meta description` únicos por página em português, Open Graph configurado, URLs limpas, conteúdo indexável
- Conteúdo em português brasileiro
- Formulários com validação e feedback claro de envio
- Testar visualmente nos breakpoints principais antes de dar por concluído
