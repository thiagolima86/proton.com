# Configurar stack técnica e deploy

## Contexto

A stack está definida em [`docs/stack.md`](../../docs/stack.md): HTML estático + Tailwind v4 (CLI standalone) + GitHub Pages com domínio do Registro.br. Precisa do esqueleto do projeto antes de implementar a landing ([issue 001](../to_do/001-implementar-landing-page.md)).

## O que fazer

- [x] Criar estrutura de pastas (`assets/`, `src/`, `bin/`) conforme `docs/stack.md`
- [x] Adicionar `src/input.css` com `@import "tailwindcss"` + tokens da marca (copiar de `../proton/app/assets/tailwind/application.css`)
- [x] Configurar build do Tailwind standalone gerando `assets/app.css` minificado
- [x] Self-host das fontes Manrope e Source Sans 3 (woff2) com `@font-face`
- [x] Criar `.nojekyll`, `robots.txt`, `sitemap.xml` e `CNAME` (domínio a confirmar com PO — placeholder `proton.com.br`)
- [x] Documentar no README o comando de build e o passo de deploy no GitHub Pages
