# Aquisição e billing — decisão PO

Refs app: [#163](https://github.com/thiagolima86/proton/issues/163) (signup/trial) · [#134](https://github.com/thiagolima86/proton/issues/134) (checkout/upgrade no app).

## Funil (fechado)

```
Landing → escolhe plano → signup no app (trial 7 dias)
  → usa o produto
  → assina dentro do app (Asaas)
```

**Pagamento não cria a conta.** Conta nasce no signup trial; Asaas só cobra/upgrade com `account_id` já existente.

## O que sai da vitrine

- CTA / destaque de **“R$ 39,90 no 1º mês”** como caminho de aquisição
- Links de checkout Asaas (`CHECKOUT_AUTONOMO` / `CHECKOUT_CLINICA`) como forma de criar conta

## O que entra na vitrine

| Item | Decisão |
| --- | --- |
| Oferta principal | **7 dias grátis** (trial), **sem cartão** na entrada |
| CTA primário | **Começar grátis** / **Testar 7 dias** → signup no app |
| Autônomo | `https://app.useproton.app/cadastro?plan=autonomo` |
| Clínica | `https://app.useproton.app/cadastro?plan=clinica` |
| Personalizado | WhatsApp / sob consulta (sem self-checkout) |

Domínio do app: `https://app.useproton.app` (landing: `https://useproton.app`).

| Placeholder | Destino |
| --- | --- |
| `APP_SIGNUP_AUTONOMO_URL` | `https://app.useproton.app/cadastro?plan=autonomo` |
| `APP_SIGNUP_CLINICA_URL` | `https://app.useproton.app/cadastro?plan=clinica` |
| `WHATSAPP_VENDAS_URL` | Consultor / Personalizado (ainda placeholder) |

## Preços recorrentes (depois do trial)

Exibidos na seção de preços como valor **após** o período de teste:

| Plano | Depois do trial | Limite |
| --- | --- | --- |
| Autônomo | **R$ 99/mês** | 1 profissional |
| Clínica | **R$ 169/mês** | até 3 profissionais |
| Personalizado | Sob consulta | sob medida |

## Regras de copy (trial)

- Dias **1–7** grátis nos planos **Autônomo e Clínica**; no **8º** dia o acesso clínico corta se não assinar — **dados não apagam**
- No trial valem os **limites do plano escolhido** (Clínica = até 3 profissionais)
- Personalizado **não** entra no self-serve trial (WhatsApp / sob consulta)
- Gancho de aquisição = **trial**, não preço introdutório
- Evitar “R$ 39,90” na landing como oferta de entrada

## Billing no app (fora deste repo)

- Provedor: **[Asaas](https://www.asaas.com/)** — cartão recorrente
- Checkout / upgrade parte do **app autenticado** (#134), não da landing
- Webhook Asaas ativa/renova/suspende billing; **não** provisiona Account
- Personalizado e contas Admin/seed: sem self-checkout Asaas

## Próximo passo (landing)

1. `APP_URL` de produção definido: `https://app.useproton.app`
2. `APP_SIGNUP_*` já apontam para `https://app.useproton.app/cadastro?plan=...` nos `href`; falta ainda `WHATSAPP_VENDAS_URL`
3. Manter alinhamento de copy com #163 / #134 no app
