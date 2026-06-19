<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import SearchBox, { type SearchProps } from "./SearchBox.svelte";

  interface Props
    extends
      SearchProps,
      Omit<HTMLAttributes<HTMLDivElement>, keyof SearchProps> {
    emptyState?: string;
  }

  let { emptyState, placeholder }: Props = $props();
</script>

<div>
  <SearchBox
    {placeholder}
    filter={(kw, kv) => {
      console.log(kw, kv);
    }}
  />
</div>
