# UX — Landing page Proton

Plano de layout e design para a landing page estática (HTML + Tailwind, GitHub Pages).  
Público principal: fisioterapeutas autônomos/domiciliares. Secundário: pequenas clínicas.

---

## Direção visual

Alinhar com a marca e o app (`proton/docs/brand`, tokens em `application.css`):

| Token | Hex | Uso |
| --- | --- | --- |
| `proton-navy` | `#244878` | Títulos, botão primário, nav |
| `proton-blue` | `#306cb4` | Links, hover, ênfase |
| `proton-mint` | `#90d8c0` | Acento, focus ring, destaque de oferta |
| Neutros | slate-50 → slate-900 | Fundos, texto secundário, bordas |

**Atmosfera:** fundo em gradiente suave navy → slate claro (ou mint muito diluído), não flat branco puro. Hero com foto/contexto real de atendimento (full-bleed), overlay navy semi-transparente para legibilidade.

**Tipografia (evitar Inter/Roboto/Arial):**

- Display / títulos: **Manrope** (semiserifa geométrica, profissional, legível no mobile)
- Corpo: **Source Sans 3**

**Motion (2–3 intenções):**

1. Fade-up suave do bloco de texto do hero ao carregar
2. Transição de hover/focus nos CTAs (cor navy → blue + ring mint)
3. Scroll-reveal leve nas seções de benefício (opacidade + 8–12px)

Sem glow, sem pills em excesso, sem cards decorativos.

---

## Princípios de conversão

- Mobile-first; alvos de toque ≥ 44px; contraste WCAG AA
- Um CTA primário por dobra
- CTAs apontam para **links externos** (checkout) ou **WhatsApp**
- Tom: profissional, prático, economia de tempo, facilidade no celular
- Em 5 segundos: o visitante entende que o Proton é prontuário + gestão para fisio

---

## Estrutura da página (ordem)

```
[Nav fixa]
[1. Hero]                    ← dobra 1: marca + promessa + 1 CTA
[2. Dor]                     ← “papelada, faltas, tempo”
[3. Benefícios]              ← 3 pilares (não cards decorativos)
[4. Produto]                 ← âncora visual: telas do app
[5. Preços]                  ← 3 planos (bloco de decisão)
[6. Confiança]               ← depoimento ou prova social curta
[7. CTA final]
[Footer]
```

Uma página só. Âncoras: `#beneficios`, `#precos`, `#contato`.

---

### 0. Nav

- Logo Proton horizontal (`logo-horizontal.svg`: símbolo + nome lado a lado) à esquerda — ~32 px no mobile, ~36 px no desktop; a variante empilhada (`logo.svg`) fica para hero e contextos verticais
- Links: Benefícios · Preços · (opcional) Entrar no app
- CTA direito: **Começar agora** → checkout do plano Autônomo (público principal)
- Mobile: menu hamburger simples; CTA permanece visível na barra

---

### 1. Hero (primeira dobra)

**Uma composição**, full-bleed. Sem cards, badges flutuantes, stats ou grade de features.

Conteúdo permitido (só isto):

| Elemento | Conteúdo sugerido |
| --- | --- |
| Marca | Logo Proton em escala hero (sinal dominante) |
| H1 | Ex.: “Prontuário e gestão feitos para o fisio no celular” |
| Apoio (1 frase) | Ex.: “Menos papelada, menos faltas, mais tempo entre um paciente e outro.” |
| CTA primário | **Começar por R$ 39,90/mês** → checkout Autônomo |
| CTA secundário | **Ver planos** → `#precos` (ghost/outline) |
| Visual | Foto full-bleed: fisio usando o Proton no celular durante o atendimento (`assets/img/hero-fisio-celular.png`); overlay navy à esquerda para legibilidade do texto |

Oferta de lançamento pode aparecer **só na linha do CTA** (“3 primeiros meses”), não como sticker sobre a imagem.

---

### 2. Dor

- Um H2 + um parágrafo curto
- 3 bullets com ícones Heroicons (estilo do app): papelada · faltas · tempo perdido no celular/notas
- Sem CTA nesta dobra (preparação para a solução)

---

### 3. Benefícios (proposta de valor)

Um H2 + frase de apoio. Três blocos em coluna no mobile, lado a lado no desktop — **sem card** (sem borda/sombra/fundo de caixa); ícone + título + 1 frase:

1. **Fim da papelada** — prontuário eletrônico no fluxo do atendimento  
2. **Menos faltas** — lembretes automáticos no WhatsApp  
3. **Mais tempo** — evolução por voz e avaliação por fotos com IA  

CTA da dobra: **Quero testar** → checkout Autônomo

---

### 4. Produto (âncora visual)

- H2: “Feito para usar entre um paciente e outro”
- Uma frase de apoio
- Imagem dominante das telas reais (lista de pacientes / prontuário) — preferir mockup mobile
- Lista curta (3–4 itens) do que o visitante vê no app — só o que existe no produto

---

### 5. Preços — 3 blocos

H2: “Planos simples, no ritmo da sua rotina”  
Apoio: “Sem fidelidade no lançamento. Cancele quando quiser.”

Layout: **1 coluna no mobile** (Autônomo primeiro), **3 colunas no desktop**.

Os blocos de preço **são containers de decisão/compra** (interação) — aqui o “card” é permitido: borda sutil, padding generoso, CTA claro. Destacar Autônomo (borda mint ou badge “Mais escolhido”).

#### Bloco A — Autônomo / Domiciliar (destaque)

| Campo | Conteúdo |
| --- | --- |
| Nome | Autônomo |
| Foco | Fisio individual — domicílio ou consultório |
| Preço | ~~R$ 99/mês~~ **R$ 39,90/mês** nos 3 primeiros meses |
| Nota | Depois R$ 99/mês · sem fidelidade |
| Oferta | **Lançamento** (meta: primeiros ~10 clientes / prazo a definir) — não é política eterna |
| CTA | **Assinar agora** → link checkout autoatendimento |
| Destaque visual | Badge “Lançamento” + coluna ligeiramente elevada/borda mint |

#### Bloco B — Clínica / Equipe

| Campo | Conteúdo |
| --- | --- |
| Nome | Clínica |
| Foco | Pequenas clínicas — até 3 fisioterapeutas no mesmo acesso |
| Preço | A partir de **R$ 169/mês** (faixa até R$ 199; + valor fixo por profissional extra) |
| Nota | Ideal para equipe pequena |
| CTA | **Assinar agora** → link checkout autoatendimento |

#### Bloco C — Personalizado / Enterprise

| Campo | Conteúdo |
| --- | --- |
| Nome | Personalizado |
| Foco | Redes, franquias ou alta demanda |
| Preço | **Sob consulta** |
| CTA | **Falar com consultor** → WhatsApp de vendas (`wa.me/...`) |

Microcopy sob a tabela: “Dúvidas? Fale conosco no WhatsApp.” (link secundário)

---

### 6. Confiança

- Um depoimento curto (nome + contexto: “Fisio domiciliar, SP”) **ou** 2–3 linhas de prova (“Lembretes no WhatsApp”, “Prontuário no celular”)
- Tom sério; sem exagero de marketing médico
- Sem carrossel na v1

---

### 7. CTA final

- Fundo navy, texto claro
- H2: “Pronto para sair do papel?”
- Uma frase + botão **Começar agora** → checkout Autônomo
- Link texto: “Falar com consultor” → WhatsApp

---

### Footer

- Logo + © ano
- Links: Preços, WhatsApp, (opcional) Política / Contato
- Sem newsletter na v1

---

## Hierarquia de CTAs

| Prioridade | Rótulo | Destino |
| --- | --- | --- |
| Primário | Começar / Assinar agora | Checkout plano Autônomo |
| Primário (Clínica) | Assinar agora | Checkout plano Clínica |
| Secundário | Ver planos | `#precos` |
| Terciário / Enterprise | Falar com consultor | WhatsApp vendas |

Placeholders de URL até o PO/DEV preencherem: `CHECKOUT_AUTONOMO_URL`, `CHECKOUT_CLINICA_URL`, `WHATSAPP_VENDAS_URL`.

---

## Breakpoints

| Viewport | Comportamento |
| --- | --- |
| &lt; 640px | Nav compacta; hero texto acima / imagem como fundo; preços empilhados (Autônomo no topo) |
| 640–1024px | Benefícios em coluna ou 2+1; preços ainda empilhados ou 3 colunas apertadas |
| ≥ 1024px | Hero texto à esquerda sobre full-bleed; 3 colunas de preço; benefícios em 3 colunas |

---

## Acessibilidade

- Um `h1` (hero); demais `h2` por seção
- Alt descritivo nas imagens de produto/contexto
- Focus ring mint visível em links e botões
- Contraste texto sobre overlay do hero verificado (navy escuro + texto branco)

---

## Fora do escopo (v1)

- Blog, multi-página, formulário de lead próprio
- Comparativo feature-by-feature extenso
- Dark mode
- Animação pesada / Lottie
)

