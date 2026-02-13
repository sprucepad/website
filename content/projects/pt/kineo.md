---
title: Kineo
desc: Um ORM/OGM para TypeScript.
image: ../_images/kineo.jpg
created: 2026-01-30
updated: 2026-02-12
github: sprucepad/kineo

topics:
  - typescript
  - compiler
  - database
---

**Um ORM extensível, _type-safe_, e simples para TypeScript.**

## Por quê?

Kineo existe pois eu não consegui achar um OGM (ORM para bancos de dados de grafo) para TypeScript que tenha uma experiência no nível do Prisma/Drizzle. Os que eu achei ou não lidavam com relações muito bem, não tinham suporte nativo ao TS ou eram difíceis de usar.

## Exemplo

```ts
// 1. Defina um _esquema_.
const schema = defineSchema({
  // 2. Defina modelos.
  user: model("User", {
    // 3. Defina propriedades.
    id: field.string().id(),
    posts: relation.to("post").array().default([]),
  }),
  post: model("Post", {
    id: field.string().id(),
    author: relation.to("user").required(),
  }),
});

// 4. Crie um cliente.
const db = kineo(neo4jAdapter({ driver }), schema);

// 5. Use o banco de dados.
await db.user.findFirst({
  where: { id: "abc" },
  select: {
    id: true,
    post: {
      id: true,
      author: true,
    },
  },
});
```

## Arquitetura

- O **adaptador** é o que gerencia seu banco de dados, transformando uma representação intermediária na lingugem do seu banco de dados e executando.
- O **esquema** é a definição de tudo no seu banco de dados. É a origem de todos os tipos.
- O **cliente** é o que transforma seu esquema em algo usável pelo adapter.

O esquema é definido usando uma DSL e _builders_, e as chamadas são feitas com objetos. Escolhi essa API por familiaridade para usuários de Prisma e Drizzle.

## Desafios

Eu alcancei 2 limitações do TypeScript em si tentando fazer esse projeto.

1. Eu tentei deixar a definição de relação ser type-safe, com essa API.

   ```ts
   defineSchema((s) => {
     user: s.model("User", {
       id: s.string().id(),
       posts: s.relation(s.post, "id"),
     });
   });
   ```

   Mas, o TypeScript não lida com referências circulares (`s` depende do return type da função, e a função tem `s` como parâmetro), fazendo isso praticamente impossível de fazer com a string com o nome da coluna sendo completada e verificada.

   Ao mesmo tempo, ainda é possível usar essa API com a string sendo só uma string mesmo, sem verificação, mas isso leva a problemas muito difíceis que descobrir.

2. Eu queria que usuários possam fazer extensões do modelo base. Isso não é possível usando classes, já que o modelo é genérico.

   ```ts
   export interface MyAdapter extends Adapter<typeof GraphModel> {
     //                                              ^ perde os genéricos, o modelo no cliente fica sem verificação
   }
   ```

3. Eu queria que o cliente seja uma classe. Isso é impossível, já que classes não podem ter uma _index signature_, ou `[K in keyof T]`.

## Lições

- Design de API é muito mais difícil do que implementação.
- TypeScript é ótimo para aplicativos, mas é muito mais difícil de usar para bibliotecas.
