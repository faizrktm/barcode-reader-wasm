<style>
  * {
    box-sizing: border-box;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .button-wrapper > button:not(:last-child) {
    margin-right: 1rem;
  }
  button {
    background-color: #FF385C;
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
</style>

<script>
  import { onDestroy } from 'svelte';
  
  import Quirc from './Quirc.svelte';
  import JsQR from './JsQR.svelte';

  let decoderType;

  onDestroy(() => {
    if(barcoder) barcoder.destroy();
  });

  function handleClick(type){
    decoderType = type;
  }
</script>

<div class="container">
  <div class="button-wrapper">
    <button on:click={() => handleClick('quirc')}>Scan with Quirc</button>
    <button on:click={() => handleClick('jsqr')}>Scan with JSQR</button>
  </div>

  {#if decoderType === 'quirc'}
  <Quirc />
  {:else if decoderType === 'jsqr'}
  <JsQR />
  {/if}
</div>