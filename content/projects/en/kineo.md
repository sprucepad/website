---
title: Kineo
desc: An ORM/OGM for TypeScript.
image: ../_images/kineo.jpg
created: 2026-01-30
updated: 2026-02-12
github: sprucepad/kineo

topics:
  - typescript
  - compiler
  - database
---

**An extensible, type-safe, and simple ORM for TypeScript.**

## Why?

Kineo exists because I couldn’t find an OGM (ORM for graph databases) for TypeScript that provides an experience on the level of Prisma/Drizzle. The ones I found either didn’t handle relationships very well, didn’t have native TypeScript support, or were hard to use.

## Example

```ts
// 1. Define a schema.
const schema = defineSchema({
  // 2. Define models.
  user: model("User", {
    // 3. Define properties.
    id: field.string().id(),
    posts: relation.to("post").array().default([]),
  }),
  post: model("Post", {
    id: field.string().id(),
    author: relation.to("user").required(),
  }),
});

// 4. Create a client.
const db = kineo(neo4jAdapter({ driver }), schema);

// 5. Use the database.
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

## Architecture

- The **adapter** is what manages your database, transforming an intermediate representation into your database’s query language and executing it.
- The **schema** is the definition of everything in your database. It is the source of all types.
- The **client** is what transforms your schema into something usable by the adapter.

The schema is defined using a DSL and builders, and calls are made using objects. I chose this API for familiarity for Prisma and Drizzle users.

## Challenges

I ran into two TypeScript limitations while building this project.

1. I tried to make relationship definitions type-safe with this API:

   ```ts
   defineSchema((s) => {
     user: s.model("User", {
       id: s.string().id(),
       posts: s.relation(s.post, "id"),
     });
   });
   ```

   However, TypeScript doesn’t handle circular references well (`s` depends on the function’s return type, and the function takes `s` as a parameter), making this practically impossible to implement with the column name string being auto-completed and validated.

   At the same time, it’s still possible to use this API with the column name as just a plain string, without validation, but that leads to very hard-to-discover problems.

2. I wanted users to be able to extend the base model. That’s not possible using classes, since the model is generic.

   ```ts
   export interface MyAdapter extends Adapter<typeof GraphModel> {
     //                                              ^ loses generics, the model in the client becomes unchecked
   }
   ```

3. I wanted the client to be a class. That’s impossible because classes cannot have an index signature, or `[K in keyof T]`.

## Lessons

- API design is much harder than implementation.
- TypeScript is great for applications, but much harder to use for libraries.
