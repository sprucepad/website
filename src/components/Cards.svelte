<script module lang="ts">
  import type { ProcessedImage } from "@/lib/mappers";

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
  let _props: Props = $props();
</script>

<div>TODO</div>
