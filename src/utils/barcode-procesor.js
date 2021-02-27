class Barcoder {
  /**
   * 
   * @param {*} video 
   * @param {*} canvas 
   * @param {String} type - jsQR | quirc | builtin
   */
  constructor(video, canvas, type) {
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
  }

  async init(){
    if(this.worker){
      // already initialize
      return;
    }
    this.video.srcObject = await navigator.mediaDevices.getUserMedia({video: { width: 500, height: 500 }, audio: false});
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
    if(this.decoderType === 'quirc'){
      this.worker = await import('comlink').then(Comlink => Comlink.wrap(
        new Worker('../workers/barcode-quirc.js', { type: 'module' })
      ));
    } else if(this.decoderType === 'jsqr'){
      this.worker = await import('comlink').then(Comlink => Comlink.wrap(
        new Worker('../workers/barcode-jsqr.js', { type: 'module' })
      ));
    }
  }

  requestTick(){
    if(!this.running) {
      requestAnimationFrame(this.decode);
    }
    this.running = true;
  }

  async decode(timestamp){
    console.log('TIMESTAMP', timestamp);
    try {
      const { width, height } = this.canvas;
      // draw the current video frame to canvas
      this.context.drawImage(this.video, 0, 0);
      // get the image data (Uint8ClampedArray format)
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
  }
}

export default Barcoder;