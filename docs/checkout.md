# Checkout — decisão PO

**Provedor fechado: [Asaas](https://www.asaas.com/)**

## Por quê

- Billing de assinatura na plataforma (Proton só reage a webhook)
- Menor custo no cartão entre as opções BR avaliadas
- Sem mensalidade; link/checkout externo encaixa na landing estática
- Mercado Brasil (público do Proton); cobrança em R$

Descartados para a v1: Stripe (mais caro no cartão / overkill sem internacional), Efí (empatado no Autônomo, um pouco mais caro na Clínica), Hotmart/Kiwify/Eduzz (comissão alta).

## Modalidade padrão

| Item | Decisão |
| --- | --- |
| Meio principal | **Cartão de crédito recorrente** (débito automático mensal) |
| Pix / boleto | Opcional depois; Asaas emite a fatura do ciclo, mas o cliente precisa pagar |
| Internacional | Fora do escopo v1 (Asaas é BR; cartão estrangeiro exige liberação especial) |

## O que a landing precisa

Dois links de assinatura Asaas (Payment Link / cobrança recorrente):

| Placeholder | Plano | Preço de referência |
| --- | --- | --- |
| `CHECKOUT_AUTONOMO_URL` | Autônomo | R$ 39,90 no 1º mês → R$ 99/mês |
| `CHECKOUT_CLINICA_URL` | Clínica | A partir de R$ 169/mês |

Personalizado continua em `WHATSAPP_VENDAS_URL` (sem checkout self-serve).

## App Proton (fora deste repo)

- Endpoint de **webhook** Asaas para ativar / renovar / suspender conta
- Eventos típicos: pagamento confirmado/recebido, vencido, assinatura cancelada
- Prazo de caixa no cartão: ~D+32 (acesso libera no webhook; dinheiro cai depois)

## Próximo passo

1. Abrir conta em https://www.asaas.com/
2. Criar as 2 assinaturas/links (Autônomo e Clínica), incluindo oferta do 1º mês no Autônomo
3. Colar as URLs nos `href` da landing (hoje `https://exemplo.invalid/...`)
4. Configurar webhook no app Rails
