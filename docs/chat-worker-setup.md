# Chat de leads — Worker Cloudflare (setup + script)

**Status:** fatia A em andamento — Worker no ar, OpenAI conectada, FAQ mínimo.  
**Worker:** `https://proton-chat-lead.thiagolima86.workers.dev/`  
**Endpoint:** `POST /chat`

Arquitetura: [`arquitetura-chat-leads.md`](arquitetura-chat-leads.md) · Oferta: [`checkout.md`](checkout.md)

---

## O que já está feito

| Item | Onde |
| --- | --- |
| Worker `proton-chat-lead` | Cloudflare → Workers & Pages |
| Secret `OPENAI_API_KEY_MARKETING` | Worker → Settings → Variables and Secrets |
| Script `/chat` + FAQ | Editor do Worker (código abaixo) |
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
2. **Edit code** → alterar → **Deploy**
3. Atualizar este arquivo se o script mudar de forma relevante

---

## Script atual (espelho do editor Cloudflare)

```js
const FAQ = `
Você é o assistente da landing do Proton (prontuário para fisioterapeutas).
Responda em português do Brasil, curto e claro.
Só use as informações abaixo. Se não souber, diga para falar no WhatsApp.

OFERTA:
- Trial: 7 dias grátis, sem cartão
- Plano Autônomo: R$ 99/mês depois do trial (1 profissional)
- Plano Clínica: R$ 169/mês depois do trial (até 3 profissionais)
- Personalizado: sob consulta, via WhatsApp
- CTA: Começar grátis / Testar 7 dias
- No 8º dia, se não assinar, o acesso clínico corta; os dados não apagam
`;

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
            messages: [
              { role: "system", content: FAQ },
              { role: "user", content: message },
            ],
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
  "message": "Quanto custa o plano autônomo?",
  "session_id": "opcional",
  "page": "opcional"
}
```

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

ReqBin (ou similar):

- URL: `https://proton-chat-lead.thiagolima86.workers.dev/chat`
- Method: `POST`
- Body JSON: `{ "message": "Quanto custa o plano autônomo?" }`

`curl`:

```bash
curl -X POST https://proton-chat-lead.thiagolima86.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Quanto custa o plano autônomo?"}'
```

---

## Ainda não feito (próximas fatias)

| Fatia | Entrega |
| --- | --- |
| A (resto) | CORS só no domínio da landing · rate limit · teto diário OpenAI |
| B | Widget na landing apontando para este Worker |
| C | Métricas / alertas |

FAQ do `system` deve continuar espelhando [`checkout.md`](checkout.md).
