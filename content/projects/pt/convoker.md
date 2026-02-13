---
title: Convoker
desc: Um framework CLI.
image: ../_images/convoker.jpg
created: 2026-02-13
updated: 2026-02-13
github: convoker/convoker.js

topics:
  - multilingual
  - cli
---

**Um framework CLI com tipagem segura.**

## Por quê?

Percebi a falta de frameworks CLI simples em TypeScript que fossem type-safe e pudessem ser incorporados em outras bibliotecas. Então eu criei o Convoker e estou expandindo-o para outras linguagens também.

## Exemplo

```ts
// 1. Crie um programa raiz.
const program = new Command("calc")
  .version("1.0.0")
  .desc("Uma calculadora")
  // 2. Defina middlewares.
  .use((_, next) => next());

// 3. Defina subcomandos.
program.subCommand("add", (c) =>
  c
    .input({
      nums: i.argument("number").list(),
    })
    .desc("Somar números")
    // 4. Defina ações que recebem a entrada que você definiu.
    .action(({ nums }) => {
      let sum: number;
      for (const num of nums) {
        sum += num;
      }

      log.info(`${nums.join(" + ")} = ${sum}`);
    }),
);

// 5. Execute seus comandos.
program.run();
```
