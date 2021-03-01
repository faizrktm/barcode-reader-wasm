const videoOptions = {
  width: 500,
  height: 500,
  facingMode: "environment",
};

class Barcoder {
  /**
   * 
   * @param {Node} video 
   * @param {Node} canvas 
   * @param {String} type - jsQR | quirc | builtin
   */
  constructor(video, canvas, options) {
    const { type, onSuccess } = options;
  
    this.video = video;
    this.canvas = canvas;
    this.running = false;
    this.requestId = null;
    this.decoderType = type;

    // worker is running
    this.running = false;
    // initial value worker
    this.worker = null;
    this.decode = this.decode.bind(this)
    
    this.stopDecoding = false;

    this.onSuccess = onSuccess;
  }

  async init(){
    if(this.worker){
      // already initialize
      return;
    }
    this.video.srcObject = await navigator.mediaDevices.getUserMedia({video: videoOptions, audio: false});
    this.video.play();

    const videoTrack = this.video.srcObject.getVideoTracks()[0];
    const { height, width } = videoTrack.getSettings();

    // setting canvas width and height
    this.canvas.width = width;
    this.canvas.height = height;

    this.context = this.canvas.getContext('2d');
    await this.initWorker();

    // kick off
    this.requestTick();
  }

  async initWorker(){
    this.worker = await import('comlink').then(Comlink => {
      if(this.decoderType === 'quirc'){
        return Comlink.wrap(
          new Worker('../workers/barcode-quirc.js', { type: 'module' })
        )
      } else if(this.decoderType === 'jsqr'){
        return Comlink.wrap(
          new Worker('../workers/barcode-jsqr.js', { type: 'module' })
        )
      }
    });

    if(this.decoderType === 'quirc'){
      await this.worker.init();
    }
  }

  requestTick(){
    if(!this.running && !this.stopDecoding) {
      requestAnimationFrame(this.decode);
    }
    this.running = true;
  }

  async decode(){
    try {
      const { width, height } = this.canvas;
      // draw the current video frame to canvas
      this.context.drawImage(this.video, 0, 0);
      // get the image data (rgba 4 channel)
      const imageData = this.context.getImageData(0, 0, width, height);
      // wait for image to be translated in worker
      await this.worker.translate(imageData);
      // get the result
      const code = await this.worker.code;

      // if cannot be translated
      // kick requestAnimationFrame again
      if(!code){
        this.running = false;
        this.requestTick();
      } else {
        console.log('decoded qr value:', code);
        // do something with the code
        if(this.onSuccess){
          this.onSuccess(code);
        }
      }
    } catch (error) {
      console.log('SOMETHING WENT WRONG', error.message);
      return;
    }
  }

  destroy(){
    if(this.requestId){
      cancelAnimationFrame(this.requestId);
    }
    this.stopDecoding = true;
  }
}

export default Barcoder;