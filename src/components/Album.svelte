<script module lang="ts">
  import type { Album } from "./Gallery.svelte";

  interface Props {
    album: Album;
    empty: string;
    placeholder: string;
  }
</script>

<script lang="ts">
  let _props: Props = $props();
</script>

<div>TODO</div>
