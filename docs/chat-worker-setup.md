# Chat de leads — Worker Cloudflare (setup + script)

**Status:** fatia A no ar · fatia B (widget) em andamento.  
**Worker:** `https://proton-chat-lead.thiagolima86.workers.dev/`  
**Endpoint:** `POST /chat`

Arquitetura: [`arquitetura-chat-leads.md`](arquitetura-chat-leads.md) · Oferta: [`checkout.md`](checkout.md)

Código versionado em [`worker/src/index.js`](../worker/src/index.js) (espelho do editor Cloudflare).

---

## O que já está feito

| Item | Onde |
| --- | --- |
| Worker `proton-chat-lead` | Cloudflare → Workers & Pages |
| Secret `OPENAI_API_KEY_MARKETING` | Worker → Settings → Variables and Secrets |
| Script `/chat` + FAQ | Editor do Worker (código abaixo) |
| Widget na landing | `index.html` + `assets/chat.js` |
| Teste manual | ReqBin / `curl` contra `/chat` |

A key OpenAI **não** vai no repo nem no front da landing.

---

## Passo a passo (já executado)

1. Cloudflare → menu **Workers & Pages** → **Create application** → criar Worker **sem** conectar Git (Hello World / Create Worker).
2. URL pública: `https://proton-chat-lead.thiagolima86.workers.dev/`
3. OpenAI → [API keys](https://platform.openai.com/api-keys) → criar key **nova** só marketing (`proton-chat-marketing`).
4. Worker → **Settings** → **Variables and Secrets** → Add **Secret**:
   - Name: `OPENAI_API_KEY_MARKETING`
   - Value: `sk-...`
5. Worker → **Edit code** → colar o script abaixo → **Deploy**.
6. Testar `POST /chat` com JSON `{ "message": "Quanto custa o plano autônomo?" }`.

---

## Como editar daqui pra frente

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **proton-chat-lead**
2. **Edit code** → alterar → **Deploy** (ou `wrangler deploy` em `worker/`)
3. Atualizar este arquivo e `worker/src/index.js` se o script mudar de forma relevante

---

## Script atual (espelho do editor Cloudflare)

Única mudança em relação à v1: campo opcional `history` no POST (widget envia turnos anteriores). **FAQ comercial intacto.**

```js
const FAQ = `
Você é da equipe comercial do Proton. Conversa no chat da landing com fisioterapeutas (autônomos, domiciliares e pequenas clínicas).

TOM:
- Fale como pessoa: leve, direta, acolhedora — português do Brasil do dia a dia.
- Nada de jargão de TI, nada de texto de manual.
- Seja vendedor: ajude a decidir, mostre o ganho, convide pro trial — sem pressão, sem urgência falsa, sem exagero.
- Respostas curtas (em geral 2–4 frases). Pode fazer 1 pergunta útil se ajudar.
- Trate a pessoa no singular ("você").

O QUE O PROTON RESOLVE (use quando fizer sentido):
- Dor comum: papelada entre um paciente e outro, agenda no WhatsApp, evolução no caderno, faltas que furam o dia.
- Solução: prontuário + gestão no celular, feitos pra fisio.
- Fim da papelada — prontuário no fluxo do atendimento, sem caderno paralelo.
- Menos faltas — lembretes automáticos no WhatsApp antes da sessão.
- Mais tempo — evolução por voz e avaliação por fotos com apoio de IA.

OFERTA (só estes números — não invente preço):
- Trial: 7 dias grátis, sem cartão na entrada. Gancho principal = testar, não desconto.
- Autônomo: R$ 99/mês depois do trial (1 profissional).
- Clínica: R$ 169/mês depois do trial (até 3 profissionais).
- Personalizado: sob consulta, pelo WhatsApp (sem self-serve).
- No 8º dia, se não assinar, o acesso clínico pausa; os dados ficam salvos.
- No trial valem os limites do plano escolhido.

COMO VENDER (verdadeiro, sem ser inconveniente):
- Conecte a dúvida da pessoa à dor → solução → próximo passo.
- Prefira benefício na prática ("menos falta", "prontuário no celular") antes de lista de features.
- Sempre que couber, convide a testar 7 dias grátis (Começar grátis / Testar 7 dias).
- Personalizado ou dúvida comercial fora desta base → oriente o WhatsApp.
- Nunca invente funcionalidade, integração, garantia ou preço que não esteja aqui.
- Não critique concorrentes; não use "última chance", countdown nem pressão artificial.
- Chat ajuda a decidir; não substitui o botão de trial da página.
`;

const MAX_HISTORY = 20;

function normalizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .map((item) => ({ role: item.role, content: item.content.trim().slice(0, 2000) }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_HISTORY);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(request),
      });
    }

    if (request.method === "GET") {
      return new Response("Proton chat lead: ok", {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          ...corsHeaders(request),
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      let body = {};
      try {
        body = await request.json();
      } catch {
        body = {};
      }

      const message = (body.message || "").toString().trim().slice(0, 1000);
      const history = normalizeHistory(body.history);

      if (!message) {
        return Response.json(
          {
            reply: "Envie uma mensagem no campo message.",
            fallback_whatsapp: false,
          },
          { headers: corsHeaders(request) }
        );
      }

      if (!env.OPENAI_API_KEY_MARKETING) {
        return Response.json(
          {
            reply: "Chat temporariamente indisponível. Fale no WhatsApp.",
            fallback_whatsapp: true,
          },
          { status: 500, headers: corsHeaders(request) }
        );
      }

      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY_MARKETING}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [{ role: "system", content: FAQ }, ...history, { role: "user", content: message }],
          }),
        });

        if (!openaiRes.ok) {
          const errText = await openaiRes.text();
          console.error("OpenAI error:", openaiRes.status, errText);
          return Response.json(
            {
              reply: "Não consegui responder agora. Fale no WhatsApp.",
              fallback_whatsapp: true,
            },
            { status: 502, headers: corsHeaders(request) }
          );
        }

        const data = await openaiRes.json();
        const reply =
          data.choices?.[0]?.message?.content?.trim() ||
          "Não consegui responder agora. Fale no WhatsApp.";

        const fallback =
          /whatsapp/i.test(reply) ||
          /não sei|nao sei|não tenho|nao tenho/i.test(reply);

        return Response.json(
          {
            reply,
            fallback_whatsapp: fallback,
          },
          { headers: corsHeaders(request) }
        );
      } catch (err) {
        console.error(err);
        return Response.json(
          {
            reply: "Erro ao falar com a IA. Fale no WhatsApp.",
            fallback_whatsapp: true,
          },
          { status: 500, headers: corsHeaders(request) }
        );
      }
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(request),
    });
  },
};

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
```

---

## Contrato da API

**Request** `POST /chat`

```json
{
  "message": "sim",
  "session_id": "opcional",
  "page": "opcional",
  "history": [
    { "role": "user", "content": "sou fisioterapeuta e preciso ganhar tempo" },
    { "role": "assistant", "content": "Que tal testar 7 dias grátis?" }
  ]
}
```

| Campo | Notas |
| --- | --- |
| `message` | Mensagem atual (obrigatório) |
| `history` | Turnos anteriores — widget envia automaticamente; **necessário para contexto** |
| `session_id` | UUID no browser (métricas/rate limit futuro) |

**Response**

```json
{
  "reply": "O plano autônomo custa R$ 99/mês após o período de trial de 7 dias grátis.",
  "fallback_whatsapp": false
}
```

**GET /** → `Proton chat lead: ok` (health check)

---

## Teste rápido

```bash
curl -X POST https://proton-chat-lead.thiagolima86.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Quanto custa o plano autônomo?"}'
```

Teste de contexto (resposta a "sim" deve continuar o trial, não cumprimentar de novo):

```bash
curl -X POST https://proton-chat-lead.thiagolima86.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"sim","history":[{"role":"user","content":"quero ganhar tempo"},{"role":"assistant","content":"Que tal testar 7 dias grátis?"}]}'
```

---

## Ainda não feito (próximas fatias)

| Fatia | Entrega |
| --- | --- |
| A (resto) | CORS só no domínio da landing · rate limit · teto diário OpenAI |
| B (resto) | Deploy do Worker com `history` · commit/push do widget |
| C | Métricas / alertas |

FAQ do `system` deve continuar espelhando [`checkout.md`](checkout.md).
