# Aquisição e billing — decisão PO

Refs app: [#163](https://github.com/thiagolima86/proton/issues/163) (signup/teste grátis) · [#134](https://github.com/thiagolima86/proton/issues/134) (checkout/upgrade no app).

## Funil (fechado)

```
Landing → escolhe plano → signup no app (teste grátis 7 dias)
  → usa o produto
  → assina dentro do app (Asaas)
```

**Pagamento não cria a conta.** Conta nasce no signup teste grátis; Asaas só cobra/upgrade com `account_id` já existente.

## O que sai da vitrine

- CTA / destaque de **“R$ 39,90 no 1º mês”** como caminho de aquisição
- Links de checkout Asaas (`CHECKOUT_AUTONOMO` / `CHECKOUT_CLINICA`) como forma de criar conta

## O que entra na vitrine

| Item | Decisão |
| --- | --- |
| Oferta principal | **7 dias grátis** (teste grátis), **sem cartão** na entrada |
| CTA primário | **Começar grátis** / **Testar 7 dias** → signup no app |
| Autônomo | `{APP_URL}/cadastro?plan=autonomo` |
| Clínica | `{APP_URL}/cadastro?plan=clinica` |
| Personalizado | WhatsApp / sob consulta (sem self-checkout) |

`APP_URL` de produção: `https://proton-web.onrender.com`.

| Placeholder | Destino | Status |
| --- | --- | --- |
| `APP_SIGNUP_AUTONOMO_URL` | `https://proton-web.onrender.com/cadastro?plan=autonomo` | ✅ resolvido na landing |
| `APP_SIGNUP_CLINICA_URL` | `https://proton-web.onrender.com/cadastro?plan=clinica` | ✅ resolvido na landing |
| `WHATSAPP_VENDAS_URL` | Consultor / Personalizado | ⏳ ainda placeholder (`https://exemplo.invalid/whatsapp`) |

## Preços recorrentes (depois do teste grátis)

Exibidos na seção de preços como valor **após** o período de teste:

| Plano | Depois do teste grátis | Limite |
| --- | --- | --- |
| Autônomo | **R$ 99/mês** | 1 profissional |
| Clínica | **R$ 169/mês** | até 3 profissionais |
| Personalizado | Sob consulta | sob medida |

## Regras de copy (teste grátis)

- Dias **1–7** grátis nos planos **Autônomo e Clínica**; no **8º** dia o acesso clínico corta se não assinar — **dados não apagam**
- No teste grátis valem os **limites do plano escolhido** (Clínica = até 3 profissionais)
- Personalizado **não** entra no self-serve teste grátis (WhatsApp / sob consulta)
- Gancho de aquisição = **teste grátis**, não preço introdutório
- Evitar “R$ 39,90” na landing como oferta de entrada

## Billing no app (fora deste repo)

- Provedor: **[Asaas](https://www.asaas.com/)** — cartão recorrente
- Checkout / upgrade parte do **app autenticado** (#134), não da landing
- Webhook Asaas ativa/renova/suspende billing; **não** provisiona Account
- Personalizado e contas Admin/seed: sem self-checkout Asaas

## Próximo passo (landing)

1. ~~Confirmar `APP_URL` de produção~~ — `https://proton-web.onrender.com` (#163 concluído)
2. ~~Colar `APP_SIGNUP_*` nos `href`~~ — feito
3. Colar `WHATSAPP_VENDAS_URL` real quando disponível (hoje `https://exemplo.invalid/whatsapp`)
4. Manter alinhamento de copy com #163 / #134 no app
