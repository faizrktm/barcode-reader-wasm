import * as Comlink from 'comlink';
import { compute_rest_props } from 'svelte/internal';

class BarcodeScanner {
  get code(){
    return this.result;
  }

  constructor(){
    this.result = null;
    this.jsQR = null;
  }

  async init(){
    const { default: jsQRModule } = await import('jsQR');
    this.jsQR = jsQRModule;
  }

  translate(imageData){
    try {
      if(!this.jsQR){
        throw new Error('jsQR not loaded');
      }
      const code = this.jsQR(imageData.data, imageData.width, imageData.height);
      if(code && code.data) {
        this.result = code.data;
      } else {
        throw new Error('Not Found');
      }
    } catch (_e) {
      console.log('ERROR TRANSLATE', _e);
      this.result = false;
    }
  }
}

let scanner = new BarcodeScanner();
Comlink.expose(scanner);