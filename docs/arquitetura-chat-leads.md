# Arquitetura — Chat de leads com IA (landing)

**Status:** fatia A iniciada — Worker + OpenAI + FAQ mínimo no ar.  
**Setup e script:** [`chat-worker-setup.md`](chat-worker-setup.md)  
**Worker:** `https://proton-chat-lead.thiagolima86.workers.dev/`

**Objetivo:** responder dúvidas de leads na landing (preços, trial, planos, o que o Proton faz) sem sair do GitHub Pages e **sem** expor chave OpenAI no front.

**Decisão fechada:** backend do chat = **Cloudflare Worker** (não o Rails do Proton na fatia 1).

Relaciona: [`stack.md`](stack.md) (hospedagem estática) · [`checkout.md`](checkout.md) (funil trial) · app Proton `docs/ia-custos.md` (OpenAI já usada no produto).

---

## 1. Problema

| Restrição | Implicação |
| --- | --- |
| Landing no **GitHub Pages** | Sem backend, sem env secreto no runtime do visitante |
| Chat com **OpenAI** | A API key **nunca** pode ir no HTML/JS público |
| Mesma conta OpenAI do Proton | Dá para reutilizar billing; **outra key** para isolar risco |
| Não engessar o monólito | Chat de marketing fica fora do app clínico |

Chamar OpenAI **direto do browser** está descartado (key vazaria no DevTools).

---

## 2. Decisão de arquitetura (alvo)

```
Visitante (proton.com.br)
  → widget JS na landing (só UI)
    → HTTPS POST https://chat.<domínio-ou-workers.dev>/chat
      → Cloudflare Worker:
           CORS + rate limit + FAQ embutido/KV
           → OpenAI (API key dedicada “marketing”, secret do Worker)
          ← resposta grounded em FAQ / copy aprovada
    ← JSON { reply, fallback_whatsapp }
  → CTA fixo: Começar grátis / WhatsApp (fallback)
```

| Peça | Dono |
| --- | --- |
| UI do chat | Repo `proton.com` (estático) |
| Segredo OpenAI + proxy | **Cloudflare Worker** (`OPENAI_API_KEY_MARKETING` como secret) |
| FAQ / copy | Versionado com o Worker (ou KV); espelha oferta de [`checkout.md`](checkout.md) |
| App Rails Proton | **Fora** desta fatia (sem endpoint de marketing obrigatório) |

### Por que Worker (e não API no Rails)

| Opção | Papel |
| --- | --- |
| **Cloudflare Worker (escolhido)** | Backend mínimo do chat; free tier renovável (~100k req/dia); isola abuso/carga da landing do app clínico; secret no painel Cloudflare |
| API no Proton | Alternativa futura se quiserem unificar logs/CRM no monólito — **não** é o caminho desta proposta |
| Widget SaaS | Descartado por agora (custo/controle) |

O Worker **não inclui LLM** — só hospeda o código. Quem gera texto é a OpenAI (key marketing na mesma conta do Proton).

---

## 3. Superfície do Worker (rascunho)

**Endpoint:** `POST /chat` (URL pública do Worker)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `message` | string | texto do lead (máx. ex. 500–1000 chars) |
| `session_id` | string opcional | UUID no browser para agrupar turnos |
| `page` | string opcional | path/âncora (`#precos`) |

**Resposta:** `{ "reply": "...", "fallback_whatsapp": true|false }`

**Fora do escopo:** dados clínicos, auth de clínica, qualquer rota do app Proton.

### Segurança mínima

1. **CORS** allowlist: origem da landing (`https://proton.com.br`, preview Pages se houver)
2. **Rate limit** por IP + por `session_id` (ex. N msgs/minuto, M/dia) — CF / lógica no Worker
3. **Teto diário** de chamadas OpenAI (fail closed → WhatsApp)
4. **Timeout** curto; streaming opcional depois
5. Logs sem PII desnecessária

### Key OpenAI

- Conta já paga do Proton
- **Nova API key** só marketing — revogável sem derrubar IA clínica
- Secret só no **Cloudflare Worker** (Wrangler secrets / dashboard)
- Landing, repo `proton.com` e repo do app **não** recebem a key no front

---

## 4. Comportamento do produto (chat)

| Regra | Detalhe |
| --- | --- |
| Fonte da verdade | FAQ / oferta (trial 7 dias, preços pós-trial, planos) |
| Não inventar | Fora da base → WhatsApp |
| Funil | Chat não substitui CTA (signup trial / consultor) |
| Tom | Português BR, fisio, curto |
| Fallback | WhatsApp vendas |

Grounding fatia 1: FAQ estático no Worker (JSON/Markdown) alinhado a `checkout.md`.

---

## 5. Landing (repo `proton.com`)

| Entrega | Notas |
| --- | --- |
| Widget mínimo | painel/drawer; enviar; loading/erro |
| Config | `data-chat-endpoint="https://…workers.dev/chat"` (URL pública, **não** secret) |
| Sem Node obrigatório | JS vanilla |
| Acessível | teclado, focus, `aria` |

---

## 6. Custo (ordem de grandeza)

| Item | Custo |
| --- | --- |
| Cloudflare Worker | Free renovável (requests/dia) — **sem LLM** |
| OpenAI | Tokens por mensagem (mesma fatura Proton; key separada) |
| Rails | R$ 0 neste desenho |

Esforço estimado (quando priorizar): **~2–4 dias** (Worker + FAQ + hardening) + **~0,5–1,5 dia** (widget na landing).

---

## 7. Fatias de entrega

Ordem sugerida **depois** de: WhatsApp real · `APP_URL` · signup trial (#163) estável.

| Fatia | Onde | Entrega |
| --- | --- | --- |
| A | Cloudflare | Worker `/chat` + secret OpenAI + FAQ mínimo — **feito** (ver [`chat-worker-setup.md`](chat-worker-setup.md)); falta CORS restrito + rate limit + teto diário |
| B | Landing | Widget apontando para o Worker |
| C | Cloudflare | Métricas básicas / teto diário / alertas |
| D | Opcional | Integrar leads no Rails/CRM — só se fizer falta |

**Critério de pronto (A+B):** lead pergunta preço/trial e recebe resposta alinhada a `checkout.md`; limite ou dúvida fora do FAQ → WhatsApp; key não aparece no Pages.

---

## 8. Não fazer

- API key no GitHub Pages ou no JS publicado
- Chamar OpenAI direto do browser
- Acoplar o chat às rotas clínicas do Proton nesta fatia
- Prometer na IA o que o PO não aprovou
- Substituir o funil trial pelo bot

---

## 9. Decisão resumida

| Pergunta | Resposta |
| --- | --- |
| Backend do chat? | **Cloudflare Worker** |
| Precisa do Rails? | **Não** na fatia 1 |
| Key no repo da landing? | **Não** — secret no Worker |
| Env no Pages resolve? | **Não** |
| Mesma OpenAI do Proton? | **Sim**, com **outra key** |
| Quando buildar? | Depois do funil self-serve estável |
