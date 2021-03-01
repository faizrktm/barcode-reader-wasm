import * as Comlink from 'comlink';
import wasm from '../wasm/barcode.wasm';

class BarcodeScanner {
  get code(){
    return this.result;
  }

  constructor() {
    this.result;
    this.memoryFromWasm = null;
    this.handlePrintString = this.handlePrintString.bind(this);
    this.wasmLoader = null;
  }

  async init(){
    if (this.wasmLoader) return;

    this.wasmLoader = await wasm({
      env: {
        memory: new WebAssembly.Memory({ initial: 1 }),
        STACKTOP: 0,
        jsPrintString: this.handlePrintString,
      },
      wasi_snapshot_preview1: { fd_write: console.log },
    });
  }

  /**
   * 
   * @param {Uint8} ptr 
   * @param {int} len
   * Since we can only communicate with number, pass number, return number with wasm
   * we need to translate the pointer number
   * this function will be executed inside the C code, and will translate
   * the pointer string result wether its contain error or the success data itself
   * the error will contain error_decode prefix therefore to be used as error catcher / handler
   * we use string because it is easier to translate instead of object, array. etc.
   */
  handlePrintString(ptr, len) {
    const view = new Uint8Array(this.memoryFromWasm.buffer, ptr, len);
    let string = '';
    for (let i = 0; i < len; i++) {
      string += String.fromCharCode(view[i]);
    }

    // error handling
    if(string.indexOf('error_decode') > -1) {
      console.log('ERROR DECODE', string);
      this.result = false;
    } else {
      this.result = string;
    }
  }

  translate(imageData){
    if(!this.wasmLoader) {
      throw new Error('WASM not loaded');
    }
    let p = null;
    let freeFunc;
    try {
      const { instance: {
          exports: {
            memory,
            decode_qr_code,
            malloc,
            free,
          } 
        } 
      } = this.wasmLoader;
      freeFunc = free;

      // define memory for later use for translation.
      this.memoryFromWasm = memory;

      // allocate memory for image data;
      const numBytes = imageData.width * imageData.height * 4;
      p = malloc(numBytes);
      const imageOnHeap = new Uint8ClampedArray(memory.buffer, p, numBytes);
      imageOnHeap.set(imageData.data);
      
      // processing decode, later will trigger handlePrintString() from
      // the C code
      decode_qr_code(p, imageData.width, imageData.height);

      // free memory image data
      free(p);
    } catch (_e) {
      console.log('ERROR TRANSLATE', _e);

      // free memory for image data if exist.
      if (p && freeFunc) freeFunc(p);
      this.result = false;
    }
  }
}

let scanner = new BarcodeScanner();
Comlink.expose(scanner);