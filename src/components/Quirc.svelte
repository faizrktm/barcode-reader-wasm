<style>
  canvas {
    display: none;
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte';
  
  import Text from './Text.svelte';

  let video, canvas, barcoder, code;

  onMount(() => {
    console.log('mounting quirc');
    (async function() {
      barcoder = await import('../utils/barcode-procesor').then(
        ({ default: Barcoder }) => new Barcoder(video, canvas, {
          type: 'quirc',
          onSuccess: (selectedCode) => {
            code = selectedCode;
          }
        })
      );
      barcoder.init();
    })();
  });

  onDestroy(() => {
    console.log('ondestroy quirc');
    if(barcoder) barcoder.destroy();
  });
</script>

<video bind:this={video} autoplay playsinline>
  <track kind="captions">
  Video stream not available.
</video>

<canvas bind:this={canvas}></canvas>

{#if code}
<Text>
  {code}
</Text>
{/if}