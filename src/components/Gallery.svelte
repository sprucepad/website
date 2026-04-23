<script lang="ts">
  import SearchBox from "./SearchBox.svelte";

  export interface Image {
    album: string;
    albumId: string;
    src: string;
    alt: string;
    license: string;
  }

  interface Props {
    images: Image[];
    placeholder: string;
    empty: string;
  }

  const { placeholder, empty, images: initImages }: Props = $props();
  let images = $state((() => initImages)());
</script>

<div>
  <SearchBox
    {placeholder}
    onFilter={(kw, kv) => {
      if (!kw.length && !kv.size) {
        images = initImages;
        return;
      }

      images = initImages.filter((image) => {
        for (const keyword of kw) {
          if (image.alt.toLowerCase().includes(keyword)) {
            return true;
          }
        }

        for (const [key, values] of kv) {
          for (const value of values) {
            switch (key) {
              case "album":
                if (
                  image.album.toLowerCase().includes(value) ||
                  image.albumId.toLowerCase().includes(value)
                )
                  return true;
                break;
              case "license":
                if (image.license.toLowerCase().includes(value)) return true;
                break;
            }
          }
        }
      });
    }}
  />

  <div class="columns-1 p-4 sm:columns-2 md:columns-3 lg:columns-4">
    {#each images as image (image.src)}
      <div class="group relative w-fit">
        <img class="pixel-art min-w-64" src={image.src} alt={image.alt} />
        <p
          class="absolute bottom-0 w-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          {image.album} - {image.license}
        </p>
      </div>
    {:else}
      <p>{empty}</p>
    {/each}
  </div>
</div>
