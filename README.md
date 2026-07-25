# Proton

Landing page do **Proton** — prontuário eletrônico inteligente e gestão SaaS B2B para fisioterapeutas.

## Sobre o produto

O Proton ajuda fisioterapeutas a abandonar a papelada, reduzir faltas e ganhar tempo no dia a dia, com inteligência artificial e automação.

### Proposta de valor

- **Fim da papelada** — prontuário eletrônico no lugar de anotações manuais
- **Menos faltas** — lembretes automáticos via WhatsApp
- **Mais tempo** — evolução por voz e avaliação por fotos com IA

## Público-alvo

| Segmento | Prioridade |
| --- | --- |
| Fisioterapeutas autônomos e domiciliares | Principal |
| Pequenas clínicas de fisioterapia | Secundário |

## Sobre este repositório

Website estático (HTML + Tailwind v4) hospedado no GitHub Pages. Planejamento em [`docs/`](docs/); stack em [`docs/stack.md`](docs/stack.md).

## Desenvolvimento

Pré-requisito: baixar o CLI standalone do Tailwind (não usa Node):

```bash
./bin/download-tailwindcss.sh
```

Build do CSS (saída em `assets/app.css`, commitada no repo):

```bash
./bin/tailwindcss -i src/input.css -o assets/app.css --minify
```

Watch durante o desenvolvimento:

```bash
./bin/tailwindcss -i src/input.css -o assets/app.css --watch
```

Servir a raiz localmente (ex.: `python3 -m http.server 8080`) e abrir `http://localhost:8080`.

## Deploy (GitHub Pages)

1. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
2. Cada push na `main` publica `index.html` e `assets/`.
3. CSS já vem buildado → sem CI na v1.
4. Domínio customizado: arquivo `CNAME` na raiz + DNS no Registro.br (ver [`docs/stack.md`](docs/stack.md)). **Confirmar domínio com o PO** antes de apontar DNS.

## Fluxo de trabalho

- **Commits direto na `main`** — sem branches ou pull requests por enquanto
- **Escopo na sessão** — a tarefa é o que está na conversa / prompt do agent; planejamento estável em [`docs/`](docs/)
