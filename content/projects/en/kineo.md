---
title: Kineo
desc: An abstracted ORM focused on TypeScript.
topics:
  - typescript
  - database
image: ../pt/kineo.jpg
createdAt: 2025-07-28
updatedAt: 2026-09-03
github: sprucepad/kineo
---

Kineo was created mostly as an experiment. At first, I wanted an OGM (Object-_Graph_ Mapper) -- something specific to Neo4j, and eventually tried expanding beyond that, leading to dropping Cypher entirely, as I no longer needed it -- SQL could do what I wanted, possibly even easier.

Currently, you define a schema, and then a client, then queries/mutations:

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

Kineo then handles migrations and query compilation for you. Queries are written in a [Prisma](https://www.prisma.io/)-like syntax, as that's what I was most inspired by while making this project.

It's currently stagnant, but I might pick it back up in the future!
