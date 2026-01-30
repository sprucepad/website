<script lang="ts">
  import type { CollectionEntryWithImage } from "@/lib/collection-w-image";

  interface Props {
    cards: CollectionEntryWithImage<"posts" | "projects">[];
    topics: CollectionEntryWithImage<"topics">[];
  }

  const { cards, topics }: Props = $props();
</script>
