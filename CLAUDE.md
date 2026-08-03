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

- Repositório canônico deste site: https://github.com/thiagolima86/proton.com
- **Branch + PR obrigatório** — com o site em produção, não commitar/push direto em `main`:
  1. Criar branch a partir de `main` (`git checkout -b <tipo>/<descricao-curta>`, ex.: `fix/faq-acessibilidade`, `feat/whatsapp-cta`)
  2. Commits na branch; ao concluir, `git push -u origin <branch>`
  3. Abrir PR contra `main` (`gh pr create`)
  4. Rodar a persona **REVIEWER** (ver abaixo) sobre o diff antes de pedir merge ao usuário
  5. Merge só após aprovação explícita do usuário — não fazer merge/squash sozinho
- Deploy acontece automaticamente ao mergear em `main` (GitHub Pages) — por isso o PR é o ponto de controle antes de ir para produção
- Issues do trabalho desta landing page vivem no board do produto (ver seção **Issues**), não neste repositório

## Especialistas

### REVIEWER — revisão de Pull Request

Ao revisar um PR deste repositório (a pedido do usuário, ou antes de sugerir merge), atue como **Especialista Revisor** cobrindo três eixos — não aprovar/recomendar merge com bloqueante pendente em qualquer um deles:

1. **Código (boas práticas)**: HTML semântico, simplicidade (sem framework/abstração desnecessária), mobile-first, performance (imagens otimizadas, `loading="lazy"`, CSS/JS mínimo), duplicação, nomes claros. Ver [Diretrizes de código](#diretrizes-de-código-papel-de-dev) abaixo.
2. **UX/UI (usabilidade, navegabilidade, acessibilidade)**: hierarquia de mensagens (dor → solução → prova → CTA), um CTA primário por dobra, contraste WCAG AA, alvos de toque ≥44px no mobile, estados visíveis (hover/focus/loading), headings em ordem, `alt` em toda imagem, formulários com validação e feedback claro. Ver [Diretrizes de UX/UI](#diretrizes-de-uxui) abaixo.
3. **SEO**: `title`/`meta description` únicos e em português, Open Graph/Twitter Card, dados estruturados (JSON-LD) quando aplicável, URLs limpas, `sitemap.xml`/`robots.txt` coerentes, conteúdo indexável (sem depender de JS para o essencial), heading `H1` único por página, links com texto descritivo.

Formato do feedback: listar achados por severidade (🔴 bloqueante / 🟡 sugestão / 🟢 ok), citando arquivo:linha. Bloqueantes precisam de correção antes do merge; sugestões ficam a critério do usuário.

## Issues

Não há board próprio para este repositório — para não fragmentar o backlog, o trabalho da landing page usa o **mesmo board do produto**: https://github.com/thiagolima86/proton/issues

- Toda issue desta landing page leva a label **`site`** (além das labels de fluxo normais)
- Metodologia: **Shape Up light**, documentada em `../proton/docs/metodologia-shape-up.md` (ciclos de 2 semanas, labels de fluxo `planning` → `ready` → `doing`, milestone nomeada com animal para o ciclo atual). Antes de criar/refinar issues, ler esse doc para seguir o mesmo fluxo do produto
- Comandos de issue usam o repo `proton` explicitamente, ex.: `gh issue create --repo thiagolima86/proton --label site,planning --title "..."`

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
