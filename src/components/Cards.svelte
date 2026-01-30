<script lang="ts">
  import SearchBox from "./SearchBox.svelte";
  import t from "@/i18n";

  interface Topic {
    id: string;
    name: Record<string, string>;
  }

  interface Card {
    id: string;
    title: string;
    desc: string;
    topics: string[];
    image: {
      src: string;
      width: number;
      height: number;
    } | null;
  }

  interface Props {
    cards: Card[];
    topics: Topic[];
    locale: string;
  }

  import { getRelativeLocaleUrl } from "astro:i18n";

  interface Props {
    cards: Card[];
    topics: Topic[];
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
        const topics = initTopics.filter((t) =>
          card.topics.some((topic) => topic === t.id),
        );
        for (const keyword of kw) {
          if (
            card.title.toLowerCase().includes(keyword) ||
            card.desc.toLowerCase().includes(keyword) ||
            topics.some(
              (topic) =>
                topic.name[locale].toLowerCase().includes(keyword) ||
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
        class="neobrutal p-4"
      >
        {#if card.image}
          <img
            src={card.image.src}
            width={card.image.width}
            height={card.image.height}
            alt=""
          />
        {/if}
        <p class="text-2xl font-black">{card.title}</p>
        <p class="mb-4">{card.desc}</p>

        <div class="flex gap-2">
          {#each card.topics as topicId (topicId)}
            {@const topic = initTopics.find((topic) => topic.id === topicId)}
            <div class="bg-accent p-1">{topic?.name[locale]}</div>
          {/each}
        </div>
      </a>
    {:else}
      <p>{t(locale, "search.empty")}</p>
    {/each}
  </div>
</div>
