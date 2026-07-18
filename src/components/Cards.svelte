<script lang="ts">
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

  let _props: Props = $props();
</script>

<div>TODO</div>
