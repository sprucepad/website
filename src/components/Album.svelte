<script lang="ts">
  import type { Album } from "./Gallery.svelte";
  import SearchBox from "./SearchBox.svelte";

  interface Props {
    album: Album;
    empty: string;
    placeholder: string;
  }

  let { placeholder, empty, album }: Props = $props();
  let images = $state((() => album.images)());
</script>

<div class="@container">
  <SearchBox
    {placeholder}
    filter={(kv, kw) => {
      if (!kv.size && !kw.size) images = album.images;
      else {
        images = album.images.filter((image) => {
          for (const keyword of kw) {
            if (image.alt.toLowerCase().includes(keyword)) return true;
          }

          for (const [key, value] of kv) {
            if (
              key === "license" &&
              image.license.toLowerCase().includes(value)
            )
              return true;
            if (key === "alt" && image.alt.toLowerCase().includes(value))
              return true;
          }
        });
      }
    }}
  />

  <div class="columns-1 gap-4 pt-8 @sm:columns-2 @md:columns-3">
    {#each images as image (image.file.src)}
      <div
        class="group relative mb-4 rounded-lg bg-white bg-[radial-gradient(#e5e7eb_20%,transparent_20%),radial-gradient(#e5e7eb_20%,transparent_20%)] bg-size-[20px_20px] bg-position-[0_0,10px_10px]"
      >
        <img
          src={image.file.src}
          width={image.file.width}
          height={image.file.height}
          class="size-full max-w-lg rounded-lg pixel-art"
          loading="lazy"
          alt={image.alt}
        />
        <div
          class="absolute bottom-0 w-full rounded-b-lg bg-background/75 p-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <p>
            {image.alt} <span class="opacity-50">&bull; {image.license}</span>
          </p>
        </div>
      </div>
    {:else}
      <p>{empty}</p>
    {/each}
  </div>
</div>
