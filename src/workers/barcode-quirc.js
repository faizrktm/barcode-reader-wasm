import * as Comlink from 'comlink';
import wasm from '../wasm/barcode.wasm';

class BarcodeScanner {
  result;

  get code(){
    return this.result;
  }

  async translate(imageData){
    try {
      const { instance } = await wasm({
        env: {
          memory: new WebAssembly.Memory({ initial: 1 }),
          STACKTOP: 0
        },
        wasi_snapshot_preview1: { fd_write: console.log },
      });
      // console.log('This is hello', handlePrintString(instance.exports.memory, instance.exports.hello()));
      // const p = instance.exports.create_buffer(imageData.width, imageData.height);
      
      // const dataOnHeap = new Uint8ClampedArray(instance.exports.memory.buffer, p);
      // dataOnHeap.set(imageData.data);

      const pointer = instance.exports.decode_qr_code(imageData.data, imageData.width, imageData.height);
      
      console.log('THE RESULT', pointer);

      // instance.exports.destroy_buffer(p);

      this.result = pointer;
    } catch (_e) {
      console.log('ERROR TRANSLATE', _e);
      this.result = false;
    }
  }
}

let scanner = new BarcodeScanner();
Comlink.expose(scanner);