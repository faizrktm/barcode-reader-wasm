import jsQR from 'jsQR';
import * as Comlink from 'comlink';

class BarcodeScanner {
  result;

  get code(){
    return this.result;
  }

  translate(imageData){
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      this.result = code;
    } catch (_e) {
      console.log('ERROR TRANSLATE', _e);
      this.result = false;
    }
  }
}

let scanner = new BarcodeScanner();
Comlink.expose(scanner);