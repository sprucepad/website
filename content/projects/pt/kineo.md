---
title: Kineo
desc: Um ORM/OGM para TypeScript.
created: 2026-01-30
updated: 2026-01-30
github: sprucepad/kineo

topics:
  - typescript
  - compiler
  - database
---

Kineo é um Object-Relation/Graph Mapper (ORM/OGM). Você cria um _esquema_, que é enviado para seu banco de dados e é usado para extrair tipos, tudo sem sair do TypeScript.

## Por quê?

Kineo foi meu primeiro projeto grande em TypeScript. Começei ele pois queria fazer um aplicativo que seria bom para um bando de dados de grafos, mas queria algo que pudesse reutilizar em outros projetos futuros que usam SQL. O que eu achei, [Neogma](https://themetalfleece.github.io/neogma/), funciona apenas com o Neo4j, e nenhum outro ORM popular como o Prisma ou Drizzle suporta o Neo4j.

## Design

O projeto começou com uma alternativa ao Neogma com relações mais fáceis. Minha inspiração em sua sintaxe foi o [Prisma](https://www.prisma.io/), mas 100% TS, do esquema a execução. Eventualmente, eu transicionei o projeto para algo mais geral, que pode ser usado para qualquer banco de dados.

Você cria um esquema usando `defineSchema`, cria modelos dentro do esquema usando `model`, e propriedades usando `field` e `relation`. Depois, você cria um cliente, passando um _adapter_ e seu esquema, e o cliente cria instâncias de modelo baseado na sua definição, tudo com tipos. O adapter é o que interage com o banco de dados, e as instâncias são praticamente um _wrapper_ em volta do adapter, que aplica tipos e retorna de um jeito que o usuário espera.
