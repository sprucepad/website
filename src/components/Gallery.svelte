<script lang="ts">
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

  let _props: Props = $props();
</script>

<div>TODO</div>
