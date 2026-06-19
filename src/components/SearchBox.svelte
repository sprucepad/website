<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  export interface SearchProps {
    filter(kw: string[], kv: [string, string][]): void;
    placeholder: string;
  }

  interface Props
    extends
      Omit<HTMLAttributes<HTMLDivElement>, keyof SearchProps>,
      SearchProps {}

  let { filter, placeholder, ...rest }: Props = $props();
</script>

<div {...rest}>
  <input
    type="search"
    {placeholder}
    oninput={(e) => {
      const words = (e.target as HTMLInputElement).value
        .trim()
        .toLowerCase()
        .split(/\s+/);

      const kw: string[] = [];
      const kv: [string, string][] = [];

      for (const word of words) {
        if (word.includes(":")) {
          const [key, ...values] = word.split(":");
          kv.push([key, values.join(":")]);
        } else {
          kw.push(word);
        }
      }

      filter(kw, kv);
    }}
  />
</div>
