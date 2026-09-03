<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";

  interface Props {
    filter: (kv: Map<string, string>, kw: Set<string>) => void;
    placeholder: string;
  }

  let { filter, placeholder }: Props = $props();
</script>

<label class="relative">
  <SearchIcon class="absolute top-1/2 left-2 -translate-y-1/2" />
  <input
    class="w-full rounded-lg border-2 p-2 pl-9 shadow-neobrutal transition-shadow focus:shadow-neobrutal-sm"
    type="search"
    {placeholder}
    oninput={(e) => {
      const value = e.currentTarget.value.trim().toLowerCase();
      const split = value.split(/\s+/);

      // eslint-disable-next-line svelte/prefer-svelte-reactivity -- this is local, never used for rendering
      const kv = new Map<string, string>();
      // eslint-disable-next-line svelte/prefer-svelte-reactivity -- this is local, never used for rendering
      const kw = new Set<string>();

      for (const word of split) {
        const [first, ...values] = word.split(":");
        if (values.length === 0) kw.add(first);
        else kv.set(first, values.join(":"));
      }

      filter(kv, kw);
    }}
  />
</label>
