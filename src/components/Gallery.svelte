<script module lang="ts">
  import type { ProcessedWithAlt } from "@/lib/mappers";

  export interface Album {
    title: string;
    cover: number;
    images: ProcessedWithAlt[];
  }

  interface Props {
    albums: Album[];
  }
</script>

<div>TODO</div>
