<script module lang="ts">
  import type { ProcessedWithData } from "@/lib/mappers";

  export interface Album {
    title: string;
    desc: string;
    covers: ProcessedWithData[];
    images: ProcessedWithData[];
  }

  interface Props {
    albums: Album[];
  }
</script>

<script lang="ts">
  let _props: Props = $props();
</script>

<div>TODO</div>
