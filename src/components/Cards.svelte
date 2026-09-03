<script module lang="ts">
  import type { ProcessedImage } from "@/lib/collections";
  import SearchBox from "./SearchBox.svelte";

  export interface Topic {
    id: string;
    name: string;
  }

  export interface Card {
    id: string;
    title: string;
    desc: string;
    topics: Topic[];
    image: ProcessedImage | null;
  }

  interface Props {
    cards: Card[];
    href: string;
    placeholder: string;
    empty: string;
  }
</script>

<script lang="ts">
  let { cards: initCards, href, placeholder, empty }: Props = $props();
  let cards = $derived(initCards);
</script>

<div>
  <SearchBox
    {placeholder}
    filter={(kv, kw) => {
      if (!kv.size && !kw.size) return (cards = initCards);

      cards = initCards.filter((card) => {
        for (const keyword of kw) {
          if (
            card.title.toLowerCase().includes(keyword) ||
            card.desc.toLowerCase().includes(keyword)
          )
            return true;
        }

        for (const [key, value] of kv) {
          if (
            key === "topic" &&
            card.topics.some((topic) =>
              topic.name.toLowerCase().includes(value),
            )
          )
            return true;
          if (key === "title" && card.desc.toLowerCase().includes(value))
            return true;
          if (key === "desc" && card.desc.toLowerCase().includes(value))
            return true;
          if (key === "id" && card.id.toLowerCase().includes(value))
            return true;
        }
      });
    }}
  />

  <div class="mt-8 flex flex-wrap gap-4">
    {#each cards as card (card.id)}
      <a href={`${href}${card.id}`} class="max-w-80 space-y-4">
        {#if card.image}
          <img
            src={card.image.src}
            width={320}
            height={156}
            class="rounded-lg"
            alt=""
          />
        {/if}
        <h1 class="font-heading text-2xl font-black">{card.title}</h1>
        <p>{card.desc}</p>
      </a>
    {:else}
      <p>{empty}</p>
    {/each}
  </div>
</div>
