<style>
  canvas {
    display: none;
  }
</style>

<script>
  import { onDestroy } from 'svelte';

  let video, canvas, barcoder;

  onDestroy(() => {
    if(barcoder) barcoder.destroy();
  });

  async function handleClick(){
    // lazy load barcode processor when user click
    barcoder = await import('../utils/barcode-procesor').then(
      ({ default: Barcoder }) => new Barcoder(video, canvas, 'quirc')
    );
    barcoder.init();
  }
</script>

<button on:click|once={handleClick}>Start Scanning</button>

<video bind:this={video}>
  <track kind="captions">
  Video stream not available.
</video>

<canvas bind:this={canvas}></canvas>
