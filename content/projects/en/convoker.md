---
title: Convoker
desc: A set of libraries for making CLI applications in JavaScript runtimes.
topics:
  - typescript
  - framework
image: ../pt/convoker.jpg
createdAt: 2025-09-29
updatedAt: 2026-09-03
github: sprucepad/convoker
---

Convoker was created mostly for fun, but also because I noticed a lack of type-safe CLI frameworks for TypeScript, that were embeddable enough to build something else on top of it. It was created for another one of my projects, [Kineo](/en/projects/kineo).

It follows the familiar middleware pattern of things like Express or Hono, but applied for CLIs instead, along with type-safe schema definition for CLI arguments.

```ts
import { Command, i } from "convoker";

const program = new Command("my-app")
  .input({
    names: i.positional("string").list(),
    message: i.option("string", "--message", "-m").optional(),
  })
  .action(({ names, message = "Hello" }) => {
    //       ^ string[]
    //              ^ string | undefined
    for (const name of names) {
      console.log(`${message}, ${name}!`);
    }
  });

await program.run(["John", "Amy", "--message", "Hi"]);
// > Hi, John!
// > Hi, Amy!
```

It supports several argument parsing schemes, user prompts, logging and ANSI theming.
