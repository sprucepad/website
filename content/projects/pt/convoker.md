---
title: Convoker
desc: Uma coleção de bibliotecas para fazer aplicativos de CLI (terminal) em JavaScript.
topics:
  - typescript
  - framework
image: ./convoker.jpg
createdAt: 2025-09-29
updatedAt: 2026-09-03
github: sprucepad/convoker
---

Convoker foi criado em maior parte por diversão, mas também pois eu achei um vácuo de frameworks seguros para CLIs em TypeScript, que eram incorporáveis o suficiente para criar outras coisas por cima. Ele foi criado para outro dos meus projetos, [Kineo](/pt/projects/kineo).

Ele segue o padrão familiar de middlewares de coisas como Express ou Hono, mas aplicado para CLIs, por cima de um esquema seguro para argumentos de CLI.

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

Ele suporta vários esquemas de processamento de argumentos, prompts de usuário, registro de logs, e temas ANSI.
