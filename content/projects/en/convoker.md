---
title: Convoker
desc: A CLI framework.
image: ../_images/convoker.jpg
created: 2026-02-13
updated: 2026-02-13
github: sprucepad/convoker

topics:
  - typescript
  - cli
---

**A type-safe CLI framework.**

## Why?

I noticed a lack of simple TypeScript CLI frameworks, that are type-safe and could be embedded in other libraries. So I built Convoker. Currently, it's JS/TS-only, but I do plan on changing that in the near future.

## Example

```ts
// 1. Create a root program.
const program = new Command("calc")
  .version("1.0.0")
  .desc("A calculator")
  // 2. Define middleware.
  .use((_, next) => next());

// 3. Define sub commands.
program.subCommand("add", (c) =>
  c
    .input({
      nums: i.argument("number").list(),
    })
    .desc("Add numbers")
    // 4. Define actions, that take in the input you define.
    .action(({ nums }) => {
      let sum: number;
      for (const num of nums) {
        sum += num;
      }

      log.info(`${nums.join(" + ")} = ${sum}`);
    }),
);

// 5. Run your commands.
program.run();
```
