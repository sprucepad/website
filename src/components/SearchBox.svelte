<script lang="ts">
  import SearchIcon from "@/icons/search.svelte";
  import { SvelteMap } from "svelte/reactivity";

  interface Props {
    onFilter(kw: string[], kv: Map<string, string[]>): void;
    placeholder: string;
  }

  const { onFilter, placeholder }: Props = $props();
</script>

<label class="neobrutal bg-background flex items-center gap-1 px-2">
  <SearchIcon />
  <input
    class="w-full py-2 outline-none"
    type="search"
    {placeholder}
    oninput={(e) => {
      const val = (e.target as HTMLInputElement).value;

      const kv = new SvelteMap<string, string[]>();
      const kw = val
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((kw) => {
          if (kw.includes(":")) {
            const [key, ...values] = kw.split(":");
            const value = values.join(":");

            if (kv.has(key)) kv.get(key)!.push(value);
            else kv.set(key, [value]);

            return false;
          } else {
            return Boolean(kw);
          }
        });

      onFilter(kw, kv);
    }}
  />
</label>
