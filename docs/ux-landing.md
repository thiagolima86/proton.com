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

Oferta de lançamento pode aparecer **só na linha do CTA** (“primeiro mês”), não como sticker sobre a imagem.

---

### 2. Dor

**Job da seção:** o visitante se reconhece — sem vender ainda.

| Elemento | Copy fechada |
| --- | --- |
| H2 | “Entre um paciente e outro, a papelada não para” |
| Apoio | “Agenda no WhatsApp, evolução no caderno, confirmação na mão — e o dia acaba sem sobrar tempo pra você.” |
| Bullet 1 | **Papelada fora de hora** — anotações soltas, prontuário incompleto, retrabalho à noite |
| Bullet 2 | **Faltas que furam a agenda** — paciente esquece, você perde o horário |
| Bullet 3 | **Tempo gasto em burocracia** — em vez de cuidar de quem está na sua frente |

Layout: H2 + parágrafo (`max-w-2xl`). Abaixo, 3 linhas com ícone Heroicons à esquerda (outline 24, `text-proton-blue`) + título semibold + frase curta. Empilhadas no mobile; 3 colunas a partir de `lg`. **Sem CTA.** Fundo neutro (`slate-50` / gradiente leve), sem cards.

Ícones sugeridos: `document-text` · `calendar` · `clock`

---

### 3. Benefícios (proposta de valor)

**Job da seção:** virar a dor em três respostas claras.

| Elemento | Copy fechada |
| --- | --- |
| H2 | “O Proton resolve o que atrasa o seu dia” |
| Apoio | “Prontuário e gestão no celular, pensados para fisio autônomo e domiciliar.” |
| Pilar 1 | **Fim da papelada** — prontuário eletrônico no fluxo do atendimento, sem caderno paralelo |
| Pilar 2 | **Menos faltas** — lembretes automáticos no WhatsApp antes da sessão |
| Pilar 3 | **Mais tempo** — evolução por voz e avaliação por fotos com IA |

Layout: fundo branco. 3 blocos **sem card** (sem borda/sombra/fundo de caixa): ícone mint/navy + título + 1 frase. Coluna no mobile; 3 colunas em `lg`. Espaçamento generoso entre pilares.

CTA da dobra (único): **Quero testar** → `CHECKOUT_AUTONOMO_URL` (botão navy, abaixo dos pilares, alinhado à esquerda no desktop / full-width opcional no mobile).

---

### 4. Produto (âncora visual)

**Job da seção:** provar que o produto existe e cabe no bolso do jaleco (celular).

| Elemento | Copy fechada |
| --- | --- |
| H2 | “Feito para usar entre um paciente e outro” |
| Apoio | “Abra o prontuário, registre a evolução e siga para o próximo atendimento — sem voltar para o consultório.” |
| Lista | Pacientes e agenda no bolso · Prontuário e evolução no celular · Lembretes automáticos no WhatsApp · Avaliação com fotos e apoio de IA |

Layout (mobile-first):

1. Texto (H2 + apoio) no topo  
2. Imagem dominante em seguida — preferir mockup **mobile** das telas reais (lista de pacientes / prontuário); `alt` descritivo  
3. Lista curta (ul) com check/ícone simples — 4 itens no máximo  

Em `lg`: texto + lista à esquerda (~45%), imagem à direita (~55%). Sem frame decorativo exagerado; a tela do app é a âncora.

**Asset:** `assets/img/produto-app-mobile.webp` (a criar). Até existir, DEV usa slot com proporção ~9:19.5 e fundo `slate-100` + legenda “Prévia do app” — **não** inventar UI fake além de placeholder estrutural.

Sem CTA próprio nesta dobra (o próximo bloco é Preços).

---

### 5. Preços — 3 blocos

**Job da seção:** decisão de compra. Únicos “cards” permitidos na página.

**Eixo de diferenciação (PO):** o produto core é o mesmo; o que muda é **quantos profissionais atendem**.  
No app: *usuário* = quem loga; *profissional* = quem atende (fisio/médico). O plano limita **profissional**, não usuário. Não usar “usuários” / “acessos” na copy.

| Elemento | Copy fechada |
| --- | --- |
| H2 | “Planos simples, no ritmo da sua rotina” |
| Apoio | “Mesmo Proton. A diferença é quantos profissionais atendem. Sem fidelidade no lançamento — cancele quando quiser.” |

Layout: **1 coluna no mobile** (Autônomo primeiro), **3 colunas no desktop** (`lg`). Cards com borda sutil `slate-200`, padding generoso, raio moderado (`rounded-xl`). Autônomo: borda `proton-mint`, leve elevação (`-translate-y` só em desktop) + badge.

Em cada card, nesta ordem: nome → foco → **linha de profissionais** (semibold) → preço → nota → lista de 3 includes (checks) → CTA.  
Includes iguais nos três planos (benefício, não feature de TI). A linha de profissionais é o contraste óbvio.

**Includes (iguais nos 3):**

1. Prontuário no celular  
2. Lembretes automáticos no WhatsApp  
3. Evolução por voz e fotos com IA  

#### Bloco A — Autônomo / Domiciliar (destaque)

| Campo | Conteúdo |
| --- | --- |
| Badge | Lançamento |
| Nome | Autônomo |
| Foco | Fisio individual — domicílio ou consultório |
| Profissionais | **1 profissional** |
| Preço | ~~R$ 99/mês~~ **R$ 39,90** no primeiro mês |
| Nota | Depois R$ 99/mês · sem fidelidade |
| CTA | **Assinar agora** → `CHECKOUT_AUTONOMO_URL` |

#### Bloco B — Clínica / Equipe

| Campo | Conteúdo |
| --- | --- |
| Nome | Clínica |
| Foco | Pequenas clínicas com equipe |
| Profissionais | **Até 3 profissionais** |
| Preço | A partir de **R$ 169/mês** |
| Nota | Valor adicional por profissional acima de 3 |
| CTA | **Assinar agora** → `CHECKOUT_CLINICA_URL` |

#### Bloco C — Personalizado / Enterprise

| Campo | Conteúdo |
| --- | --- |
| Nome | Personalizado |
| Foco | Redes, franquias ou 4+ profissionais |
| Profissionais | **Profissionais sob medida** |
| Preço | **Sob consulta** |
| Nota | Condições para a sua operação |
| CTA | **Falar com consultor** → `WHATSAPP_VENDAS_URL` |

Microcopy sob a grade: “Dúvidas? Fale conosco no WhatsApp.” → mesmo `WHATSAPP_VENDAS_URL`.

---

### 6. Confiança

**Job da seção:** reduzir risco sem inventar prova social falsa.

**Decisão v1:** **não** usar depoimento inventado. Usar 3 linhas de prova (o que o produto entrega de forma verificável):

| Linha | Texto |
| --- | --- |
| 1 | Prontuário no celular, no meio do atendimento |
| 2 | Lembretes automáticos no WhatsApp |
| 3 | Evolução por voz e fotos com apoio de IA |

Layout: H2 **“Feito para a rotina real do fisio”** + as 3 linhas em coluna (ícone check mint + texto). Centralizado no desktop, sem aspas de depoimento, sem carrossel, sem logos de clientes fictícios.

Quando houver depoimento real (nome + contexto), substitui este bloco — fora do escopo do ponto 1.

---

### 7. CTA final

**Job da seção:** último empurrão para o plano Autônomo.

| Elemento | Copy fechada |
| --- | --- |
| H2 | “Pronto para sair do papel?” |
| Apoio | “Comece pelo plano Autônomo — R$ 39,90 no primeiro mês.” |
| CTA primário | **Começar agora** → `CHECKOUT_AUTONOMO_URL` |
| Link texto | **Falar com consultor** → `WHATSAPP_VENDAS_URL` |

Layout: fundo `proton-navy`, texto branco, conteúdo centralizado, um botão branco + link underline discreto abaixo. Sem formulário.

---

### Footer

- Logo horizontal + © ano  
- Links em linha: Preços (`#precos`) · WhatsApp (`WHATSAPP_VENDAS_URL`)  
- Sem newsletter na v1  

---

## Entrega — ponto 1 (conteúdo das seções)

Escopo para o DEV nesta sessão / run:

| Inclui | Não inclui |
| --- | --- |
| Substituir todos os “Conteúdo na issue 001” pelas copies fechadas acima | URLs reais de checkout/WhatsApp (manter placeholders documentados) |
| Layout mobile-first das seções 2–7 + footer links | Foto/mockup final do produto (slot + placeholder ok) |
| Ícones Heroicons inline nas seções Dor, Benefícios, Confiança | Domínio/CNAME, og-image, analytics |
| Manter hero atual; alinhar CTA secundário do hero para **Ver planos** → `#precos` | Refatorar nav ou stack |
| CTAs com `href` placeholder (`#precos` ou `https://exemplo.invalid/...`) + comentário HTML com o nome do placeholder | Depoimento com nome fictício |

**Critérios de aceite (UX):**

1. Em mobile (~375px), cada seção tem um único H2 visível e não compete com a próxima dobra  
2. Preços: Autônomo aparece primeiro; 3 cards empilhados sem overflow horizontal  
3. Benefícios e Dor: zero aparência de “card” (sem caixa/borda/sombra nos pilares)  
4. Confiança não parece fake review  
5. Um CTA primário por dobra que tem CTA; Dor e Produto sem botão de compra  
6. Focus ring mint e alvos ≥ 44px preservados

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

