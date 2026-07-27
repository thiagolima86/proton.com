# Arquitetura — Chat de leads com IA (landing)

**Status:** proposta / futuro — **não** implementar enquanto o funil trial (#163) e URLs reais da landing não estiverem estáveis.  
**Objetivo:** responder dúvidas de leads na landing (preços, trial, planos, o que o Proton faz) sem sair do GitHub Pages e **sem** expor chave OpenAI no front.

Relaciona: [`stack.md`](stack.md) (hospedagem estática) · [`checkout.md`](checkout.md) (funil trial) · app Proton `docs/ia-custos.md` (OpenAI já usada no produto).

---

## 1. Problema

| Restrição | Implicação |
| --- | --- |
| Landing no **GitHub Pages** | Sem backend, sem env secreto no runtime do visitante |
| Chat com **OpenAI** | A API key **nunca** pode ir no HTML/JS público |
| Mesma conta OpenAI do Proton | Dá para reutilizar billing; **outra key** para isolar risco |

Chamar OpenAI **direto do browser** está descartado (key vazaria no DevTools).

---

## 2. Decisão de arquitetura (alvo)

```
Visitante (proton.com.br)
  → widget JS na landing (só UI)
    → HTTPS POST {APP_URL}/api/marketing/chat
      → Rails (Proton): auth pública limitada + rate limit + CORS
        → OpenAI (API key dedicada “marketing”)
          ← resposta grounded em FAQ / copy aprovada
    ← JSON { reply, citations? }
  → CTA fixo: Começar grátis / WhatsApp (fallback)
```

**Dono do segredo e do custo:** monólito Rails (`OPENAI_API_KEY_MARKETING` ou projeto OpenAI separado na mesma conta).  
**Landing:** continua 100% estática; só faz `fetch` cross-origin.

### Por que Rails (e não Worker como caminho principal)

| Opção | Prós | Contras |
| --- | --- | --- |
| **API no Proton (preferida)** | Já tem OpenAI e deploy; um só lugar de secrets; logs/custo junto do produto | Precisa endpoint público + CORS + hardening |
| **Cloudflare Worker** | Free tier renovável (~100k req/dia); isola tráfego da landing | Segundo deploy; key ainda precisa estar no Worker; LLM continua pago |
| Widget SaaS (Intercom etc.) | Rápido | Custo/mês; menos controle da copy |

Worker fica como **alternativa** se quiserem isolar abuso da landing do app clínico — não é obrigatório no desenho base.

---

## 3. Superfície de API (rascunho)

**Endpoint sugerido (app):** `POST /api/marketing/chat`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `message` | string | texto do lead (tamanho máx. ex. 500–1000 chars) |
| `session_id` | string opcional | UUID gerado no browser para agrupar turnos |
| `page` | string opcional | path/âncora (`#precos`) para contexto |

**Resposta:** `{ "reply": "...", "fallback_whatsapp": true|false }`

**Fora do escopo deste endpoint:** pacientes, prontuário, auth de clínica, qualquer dado clínico. Superfície **só marketing**.

### Segurança mínima

1. **CORS** allowlist: origem da landing (`https://proton.com.br`, preview Pages se houver)
2. **Rate limit** por IP + por `session_id` (ex. N msgs/minuto, M/dia)
3. **Teto de tokens / custo dia** (fail closed → “fale no WhatsApp”)
4. **Timeout** curto; sem streaming obrigatório na fatia 1
5. Sem cookies de sessão clínica; endpoint **não** autentica fisio
6. Logs sem PII desnecessária; não gravar histórico clínico

### Key OpenAI

- Conta já paga do Proton
- **Nova API key** (ou projeto) só para marketing — revogável sem derrubar IA clínica
- Secret só em env do Rails (`credentials` / ENV de produção)
- Landing e repo `proton.com` **nunca** recebem a key

---

## 4. Comportamento do produto (chat)

| Regra | Detalhe |
| --- | --- |
| Fonte da verdade | FAQ / docs de oferta (trial 7 dias, preços pós-trial, planos) — prompt + trechos aprovados |
| Não inventar | Feature, preço ou prazo fora da base → pedir WhatsApp |
| Funil | Chat **não** substitui CTA; sempre caminho para signup trial ou consultor |
| Tom | Português BR, fisio, curto |
| Fallback | Link/botão WhatsApp vendas |

Sugestão de grounding (fatia 1): markdown/YAML versionado no app (`config/marketing_faq.yml`) ou trechos espelhando `docs/checkout.md` da landing — evitar “RAG aberto” na internet.

---

## 5. Landing (repo `proton.com`)

| Entrega | Notas |
| --- | --- |
| Widget mínimo | painel/drawer; 1 campo + enviar; estados loading/erro |
| Config | `data-chat-endpoint="{APP_URL}/api/marketing/chat"` (URL pública do app, **não** secret) |
| Sem Node obrigatório | JS vanilla alinhado ao stack atual |
| Acessível | teclado, focus, `aria` |

Placeholders e domínio do app seguem o mesmo gate de [`checkout.md`](checkout.md) (`APP_URL` real).

---

## 6. Custo (ordem de grandeza)

- **Cloudflare Worker (se usado):** free renovável (requests/dia) — **não inclui LLM**
- **OpenAI:** tokens por mensagem (mesma fatura da conta Proton; key separada só isola métrica/risco)
- Chat de lead é tipicamente **só texto** → custo unitário baixo vs áudio/fotos clínicos (`ia-custos.md`), mas tráfego público exige teto anti-abuso

---

## 7. Fatias de entrega (quando priorizar)

Ordem sugerida **depois** de: WhatsApp real · `APP_URL` · signup trial (#163) estável.

| Fatia | Onde | Entrega |
| --- | --- | --- |
| A | App | Endpoint + CORS + rate limit + FAQ estático + key marketing |
| B | Landing | Widget apontando para o endpoint |
| C | App | Métricas (msgs/dia, custo estimado, % fallback WhatsApp) |
| D | Opcional | Worker na frente só se abuso/carga exigir isolamento |

**Critério de pronto (fatia A+B):** lead pergunta preço/trial e recebe resposta alinhada a `checkout.md`; estouro de limite ou dúvida fora do FAQ cai no WhatsApp; key não aparece no Pages.

---

## 8. Não fazer

- API key no GitHub Pages, Actions “secret” injetado no JS do site, ou repo público
- Reutilizar rotas clínicas / multi-tenant para o chat de lead
- Prometer na IA o que a landing/PO ainda não aprovou
- Substituir o funil trial por “só conversar com o bot”

---

## 9. Decisão resumida

| Pergunta | Resposta |
| --- | --- |
| Precisa de backend? | **Sim** (Proton Rails; Worker opcional) |
| Key no repo da landing? | **Não** |
| Env no Pages resolve? | **Não** (visitante ainda veria a key) |
| Mesma OpenAI do Proton? | **Sim**, com **outra key** |
| Quando buildar? | Depois do funil self-serve estável |
