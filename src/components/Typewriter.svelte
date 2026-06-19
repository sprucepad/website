<script lang="ts">
  import { cn } from "@/lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    words: string[];
    charDelay?: number;
    deleteDelay?: number;
    wordDelay?: number;
  }

  let {
    words,
    charDelay = 50,
    deleteDelay = 100,
    wordDelay = 3000,
    class: className,
  }: Props = $props();

  let content = $state("");
  let wordIndex = 0;

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function typeLoop() {
    while (true) {
      const word = words[wordIndex];

      // ----- TYPING -----
      while (content.length < word.length) {
        content = word.slice(0, content.length + 1);
        await sleep(charDelay);
      }

      await sleep(wordDelay);

      // ----- DELETING -----
      while (content.length > 0) {
        content = word.slice(0, content.length - 1);
        await sleep(deleteDelay);
      }

      wordIndex = (wordIndex + 1) % words.length;
      await sleep(charDelay);
    }
  }

  typeLoop();
</script>

<span class={cn("after:animate-pulse after:content-['|']", className)}
  >{content}</span
>
