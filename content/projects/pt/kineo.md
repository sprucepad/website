---
title: Kineo
desc: Um ORM abstrato focado em TypeScript.
topics:
  - typescript
  - database
image: ./kineo.jpg
createdAt: 2025-07-28
updatedAt: 2026-09-03
github: sprucepad/kineo
---

Kineo foi criado como um experimento. Primeiro, eu precisava de um OGM (Object-_Graph_ Mapper) -- uma coisa específica para o Neo4j, e eventualmente tentei expandir depois disso, levando-me a retirar o Cypher completamente, pois não precisava dele mais -- SQL conseguia fazer o que eu queria, talvez ainda de forma mais fácil.

No momento, você define um esquema, depois um cliente, depois consultas/mutações:

```ts
// src/schema.ts
import { model } from "kineo/schema";

export const user = model((s) => ({
  id: s.int().id(),
  username: s.string().unique(),
  email: s.string().unique(),
  password: s.string(),
}))
  .relate((s) => ({
    posts: s.relation(post).many(),
  }))
  .index("username", "email");

// ...

// src/client.ts
import postgres from "kineo/adapters/postgres";
import * as schema from "./schema";

export const db = kineo(postgres(process.env.DB_URL!), schema);

await db.users.delete({
  where: {
    username: {
      startsWith: "ann",
      not: { endsWith: "e" },
    },
  },
});
```

O Kineo gerencia migrações e a compilação de consultas para você. As consultas são escritas em uma sintaxe parecida com a do [Prisma](https://www.prisma.io/), já que ele é o que eu mais me inspirei fazendo esse projeto.

No momento, ele está estagnante, mas eu posso tentar ele de novo no futuro!
