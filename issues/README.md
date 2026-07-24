# Issues

Controle simples de tarefas em markdown, sem depender do GitHub Issues.

## Como funciona

- `to_do/` — tarefas pendentes, um arquivo `.md` por tarefa
- `done/` — tarefas concluídas (o arquivo é movido para cá ao finalizar)

## Convenções

- Nome do arquivo: `NNN-titulo-curto.md` (ex.: `001-criar-hero-da-home.md`), numeração sequencial
- Conteúdo mínimo de cada issue:

```markdown
# Título da tarefa

## Contexto
Por que essa tarefa existe.

## O que fazer
- [ ] Passos ou critérios de aceite
```

- Ao concluir, mova o arquivo de `to_do/` para `done/` no mesmo commit da entrega (`git mv`)
