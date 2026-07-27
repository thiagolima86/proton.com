# Stack técnica — Landing page Proton

Decisões de tecnologia do site. Objetivo: **estático, leve e barato de manter**, rodando em GitHub Pages com domínio do Registro.br. Segue as diretrizes de `.cursor/rules/dev.mdc` (simplicidade, mobile-first, performance).

---

## Visão geral

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Markup | HTML5 estático, 1 página (`index.html`) | Landing single-page; conteúdo indexável sem JS |
| Estilo | **Tailwind CSS v4** (CLI standalone) | Mesma versão/tokens do app Proton; CSS purgado e minificado |
| Fontes | **Manrope** + **Source Sans 3** self-hosted (woff2) | Sem request a terceiros; coerência com o app (usa Manrope) |
| Ícones | Heroicons inline (SVG) | Mesmo set do app; zero dependência de runtime |
| JavaScript | Vanilla mínimo (1 arquivo) | Só menu mobile e scroll-reveal; sem framework |
| Imagens | SVG (logo) + WebP/AVIF (telas/contexto) | Formatos modernos, `loading="lazy"` |
| Hospedagem | GitHub Pages (branch `main`, raiz) | Grátis, estático, deploy por push |
| Domínio | Registro.br → GitHub Pages | Domínio customizado via `CNAME` + DNS |

**Sem** Node como dependência obrigatória, sem bundler, sem framework JS, sem backend.

---

## CSS — Tailwind v4 via CLI standalone

Usar o **binário standalone** do Tailwind (não exige Node/npm):

```bash
# baixar o binário uma vez (ex.: em ./bin/tailwindcss)
# build de produção (minificado + purge):
./bin/tailwindcss -i src/input.css -o assets/app.css --minify
# durante o desenvolvimento:
./bin/tailwindcss -i src/input.css -o assets/app.css --watch
```

- `src/input.css`: `@import "tailwindcss";` + `@source` apontando para `index.html` / `assets/main.js` + bloco `@theme` com os tokens da marca (copiados de `../proton/app/assets/tailwind/application.css`: `proton-navy`, `proton-blue`, `proton-mint`, `--font-sans: Manrope`).
- Saída `assets/app.css` é **committada** no repo → GitHub Pages serve direto, sem build no servidor.
- Purge automático do Tailwind v4 mantém o CSS enxuto (só classes usadas no HTML).
- Binário em `bin/tailwindcss` fica no `.gitignore` (~100MB); baixar com `./bin/download-tailwindcss.sh`.

> Alternativa considerada e descartada: **Tailwind Play CDN**. Prático, mas injeta ~muitos KB de JS, gera FOUC e não purga — ruim para performance e SEO. Só serve para protótipo rápido.

---

## Fontes

- Self-host `Manrope` (400/600/700) e `Source Sans 3` (400/600) em `assets/fonts/*.woff2`.
- Declarar com `@font-face` + `font-display: swap` no `input.css`.
- Motivo: evita dependência do Google Fonts (privacidade/latência) e mantém a marca consistente com o app.

---

## JavaScript

Um único `assets/main.js`, sem libs:

1. Toggle do menu mobile (hamburger)
2. Scroll-reveal leve (IntersectionObserver → adiciona classe)

Regras: nada essencial de conteúdo depende de JS (SEO). `defer` no `<script>`.

---

## SEO e metadados

- `<html lang="pt-BR">`
- `title` e `meta description` únicos, com termos do público (prontuário eletrônico, fisioterapeuta)
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) + Twitter card
- `og:image`: `assets/img/og-image.jpg` (1200×630, JPEG — melhor suporte no WhatsApp). URL absoluta deve apontar para o host **público atual** (hoje `https://www.thiagol.dev/proton.com/...`). Quando `proton.com.br` estiver no ar, atualizar `og:image` / `twitter:image` / `canonical`.
- `link rel="canonical"`
- `favicon` (SVG + `.ico` fallback) a partir do símbolo da marca
- `robots.txt` e `sitemap.xml` na raiz
- `.nojekyll` na raiz (evita o processamento Jekyll do Pages sobre `assets/`)

---

## Estrutura de arquivos

```
proton.com/
├─ index.html
├─ assets/
│  ├─ app.css          # Tailwind buildado (committed)
│  ├─ main.js
│  ├─ fonts/           # woff2 self-hosted
│  └─ img/             # logo.svg, telas .webp, og-image
├─ src/
│  └─ input.css        # fonte do Tailwind (@import + @theme)
├─ bin/
│  └─ tailwindcss      # binário standalone (gitignore ou committed)
├─ CNAME               # domínio customizado
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll
└─ docs/               # planejamento (ux-landing.md, stack.md)
```

---

## Deploy — GitHub Pages

1. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
2. `index.html` na raiz é servido automaticamente a cada push (fluxo de commit direto na `main`).
3. CSS já vem buildado no repo → **sem CI necessário**.

> Opcional (follow-up): GitHub Action para rodar o build do Tailwind no push e garantir reprodutibilidade. Fica fora da v1 para manter simples.

---

## Domínio (Registro.br → GitHub Pages)

1. Criar arquivo `CNAME` na raiz com o domínio (ex.: `proton.com.br`).
2. No painel do Registro.br, configurar DNS:
   - **Apex (`@`)**: 4 registros `A` para os IPs do GitHub Pages
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (ou `ALIAS`/`ANAME` para `<user>.github.io` se o Registro.br suportar)
   - **`www`**: registro `CNAME` → `<user>.github.io`
3. Em Settings → Pages, ativar **Enforce HTTPS** após propagação.

---

## Performance (metas)

- Sem JS de terceiros; CSS único minificado
- Imagens em WebP/AVIF, `loading="lazy"`, dimensões explícitas (evita CLS)
- Lighthouse alvo: ≥ 95 em Performance e SEO no mobile

---

## Fora do escopo (v1)

- Framework JS (React/Vue), SSG (Astro/Eleventy) — desnecessário para 1 página
- Backend / formulário próprio (conversão self-serve → **signup trial no app**; Personalizado → WhatsApp — ver [`checkout.md`](checkout.md))
- Analytics pesado (Google Analytics). Se necessário, avaliar Plausible/Umami leves depois
- Dark mode
