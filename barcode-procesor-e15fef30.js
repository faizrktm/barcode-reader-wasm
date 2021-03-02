define(["module","require","exports"],(function(t,e,i){"use strict";const s={width:500,height:500,facingMode:"environment"};i.default=class{constructor(t,e,i){const{type:s,onSuccess:n}=i;this.video=t,this.canvas=e,this.running=!1,this.requestId=null,this.decoderType=s,this.running=!1,this.worker=null,this.decode=this.decode.bind(this),this.stopDecoding=!1,this.onSuccess=n}async init(){if(this.worker)return;this.video.srcObject=await navigator.mediaDevices.getUserMedia({video:s,audio:!1}),this.video.play();const t=this.video.srcObject.getVideoTracks()[0],{height:e,width:i}=t.getSettings();this.canvas.width=i,this.canvas.height=e,this.context=this.canvas.getContext("2d"),await this.initWorker(),this.requestTick()}async initWorker(){this.worker=await e("./comlink-7c1c41f0").then((e=>"quirc"===this.decoderType?e.wrap(new Worker(new URL("barcode-quirc-ff8d78c3.js",t.uri))):"jsqr"===this.decoderType?e.wrap(new Worker(new URL("barcode-jsqr-77b1bdbb.js",t.uri))):void 0)),await this.worker.init()}requestTick(){this.running||this.stopDecoding||requestAnimationFrame(this.decode),this.running=!0}async decode(){try{const{width:t,height:e}=this.canvas;this.context.drawImage(this.video,0,0);const i=this.context.getImageData(0,0,t,e);await this.worker.translate(i);const s=await this.worker.code;s?(console.log("decoded qr value:",s),this.onSuccess&&this.onSuccess(s)):(this.running=!1,this.requestTick())}catch(t){return void console.log("SOMETHING WENT WRONG",t.message)}}destroy(){this.requestId&&cancelAnimationFrame(this.requestId),this.stopDecoding=!0}}}));
//# sourceMappingURL=barcode-procesor-e15fef30.js.map