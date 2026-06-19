<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";
  import { cva, type VariantProps } from "class-variance-authority";

  const inputStyles = cva(
    "w-full p-2 pl-12 focus:outline-2 focus:outline-accent",
    {
      variants: {
        variant: {
          art: "rounded-full neobrutal",
          code: "border-1",
        },
      },
    },
  );

  interface Props extends VariantProps<typeof inputStyles> {
    filter(kw: string[], kv: [string, string][]): void;
    placeholder: string;
  }

  let { filter, placeholder, variant }: Props = $props();
</script>

<label class="relative block">
  <SearchIcon class="absolute left-4 top-1/4" />
  <input
    type="search"
    {placeholder}
    class={inputStyles({ variant })}
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
</label>
