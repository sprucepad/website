<script module lang="ts">
  import type { ProcessedWithData } from "@/lib/mappers";
  import SearchBox from "./SearchBox.svelte";

  export interface Album {
    id: string;
    title: string;
    desc: string;
    covers: ProcessedWithData[];
    images: ProcessedWithData[];
  }

  interface Props {
    albums: Album[];
    placeholder: string;
    empty: string;
    href: string;
  }
</script>

<script lang="ts">
  let { albums: initAlbums, placeholder, empty, href }: Props = $props();
  let albums = $state((() => initAlbums)());
</script>

<div>
  <SearchBox
    {placeholder}
    filter={(kv, kw) => {
      if (!kv.size && !kw.size) albums = initAlbums;
      else
        albums = initAlbums.filter((album) => {
          for (const keyword of kw) {
            if (
              album.title.toLowerCase().includes(keyword) ||
              album.desc.toLowerCase().includes(keyword)
            )
              return true;
          }
          for (const [key, value] of kv) {
            if (key === "desc" && album.desc.toLowerCase().includes(value))
              return true;
            if (key === "title" && album.title.toLowerCase().includes(value))
              return true;
            if (
              key === "image" &&
              album.images.some((image) =>
                image.alt.toLowerCase().includes(value),
              )
            )
              return true;
          }
        });
    }}
  />

  <div class="mt-8 columns-1 sm:columns-2 md:columns-3">
    {#each albums as album (album.title)}
      <a href={`${href}${album.id}`} class="relative mb-4 block">
        <img
          src={album.covers[0].file.src}
          alt={album.covers[0].alt}
          class="absolute -z-50 h-full w-full object-cover blur-lg brightness-50"
        />
        <h1 class="text-center font-heading text-3xl font-black">
          {album.title}
        </h1>
        <p class="text-center">{album.desc}</p>
      </a>
    {:else}
      <p>{empty}</p>
    {/each}
  </div>
</div>
