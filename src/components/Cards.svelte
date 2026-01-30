<script lang="ts">
  import type { CollectionEntry } from "@/lib/filtered-collection";

  import SearchBox from "./SearchBox.svelte";
  import translate from "@/i18n";

  import { getRelativeLocaleUrl } from "astro:i18n";

  interface Props {
    cards: CollectionEntry<"posts" | "projects">[];
    topics: CollectionEntry<"topics">[];
    locale: string;
  }

  const { cards: initCards, topics: initTopics, locale }: Props = $props();
  let cards = $state((() => initCards)());
</script>

<div class="space-y-4">
  <SearchBox
    {locale}
    onFilter={(kw, kv) => {
      if (!kw.length && !kv.size) {
        cards = initCards;
        return;
      }

      cards = initCards.filter((card) => {
        const topics = initTopics.filter((initTopic) =>
          card.data.topics.some((topic) => topic.id === initTopic.id),
        );
        for (const keyword of kw) {
          if (
            card.data.title.toLowerCase().includes(keyword) ||
            card.data.desc.toLowerCase().includes(keyword) ||
            topics.some(
              (topic) =>
                topic.data.name.toLowerCase().includes(keyword) ||
                topic.id.toLowerCase().includes(keyword),
            )
          ) {
            return true;
          }
        }

        for (const [key, value] of kv) {
          // TODO
        }
      });
    }}
  />

  <div class="flex flex-wrap gap-4">
    {#each cards as card (card.id)}
      <a
        href={getRelativeLocaleUrl(locale, `/projects/${card.id}`)}
        class="neobrutal border-2 p-4"
      >
        {#if card.image}
          <img
            src={card.image.src}
            width={card.image.options.width}
            height={card.image.options.height}
            alt=""
          />
        {/if}
        <p class="text-2xl font-black">{card.data.title}</p>
        <p>{card.data.desc}</p>

        <div class="flex gap-4">
          {#each card.data.topics as topicId (topicId.id)}
            {@const topic = initTopics.find((topic) => topic.id === topicId.id)}
            <div>{topic?.data.name}</div>
          {/each}
        </div>
      </a>
    {:else}
      <p>{translate(locale, "search.empty")}</p>
    {/each}
  </div>
</div>
