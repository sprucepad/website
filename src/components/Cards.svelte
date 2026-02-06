<script lang="ts">
  import SearchBox from "./SearchBox.svelte";

  export interface Topic {
    id: string;
    name: string;
  }

  export interface Card {
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
    href: string;
    placeholder: string;
    empty: string;
  }

  const {
    cards: initCards,
    topics: initTopics,
    href,
    empty,
    placeholder,
  }: Props = $props();
  let cards = $state((() => initCards)());
</script>

<div class="space-y-4">
  <SearchBox
    {placeholder}
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
                topic.name.toLowerCase().includes(keyword) ||
                topic.id.toLowerCase().includes(keyword),
            )
          ) {
            return true;
          }
        }

        for (const [key, values] of kv) {
          for (const value of values) {
            switch (key) {
              case "topic":
                if (
                  topics.some(
                    (topic) =>
                      topic.name.toLowerCase().includes(value) ||
                      topic.id.toLowerCase().includes(value),
                  )
                )
                  return true;
                break;
              case "id":
                if (card.id.toLowerCase().includes(value)) return true;
                break;
              case "title":
                if (card.title.toLowerCase().includes(value)) return true;
                break;
              case "desc":
                if (card.desc.toLowerCase().includes(value)) return true;
            }
          }
        }
      });
    }}
  />

  <div class="flex flex-wrap gap-4">
    {#each cards as card (card.id)}
      <a
        href={`${href.endsWith("/") ? href : href + "/"}${card.id}`}
        class="neobrutal max-w-sm p-4"
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

        <div class="flex items-start gap-2">
          {#each card.topics as topicId (topicId)}
            {@const topic = initTopics.find((topic) => topic.id === topicId)}
            {#if topic}
              <div class="bg-accent flex gap-1 p-1">
                {topic.name}
              </div>
            {/if}
          {/each}
        </div>
      </a>
    {:else}
      <p>{empty}</p>
    {/each}
  </div>
</div>
