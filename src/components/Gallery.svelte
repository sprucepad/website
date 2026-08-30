<script module lang="ts">
  import type { ProcessedWithAlt } from "@/lib/mappers";

  export interface Album {
    title: string;
    covers: ProcessedWithAlt[];
    images: ProcessedWithAlt[];
  }

  interface Props {
    albums: Album[];
  }
</script>

<script lang="ts">
  let _props: Props = $props();
</script>

<div>TODO</div>
