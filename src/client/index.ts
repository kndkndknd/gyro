const ws: WebSocket = new WebSocket("wss://192.168.0.10:3333");

let video:HTMLElement;
let buffer = document.createElement('canvas');

let initFlag: boolean = false
let audioContext: AudioContext
let masterGain: GainNode
let osc: OscillatorNode
let oscGain: GainNode
let oscPortament:number = 0;
//const canvas: = document.getElementById('cnvs');
const canvas = <HTMLCanvasElement> document.getElementById('cnvs')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

const initialize = () =>{
  erasePrint(ctx, canvas);
  initFlag = true
  console.log("client start")
  //audioContext
  audioContext = new AudioContext();
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(1,0) //変数別途
  masterGain.connect(audioContext.destination);
  // sinewave
  osc = audioContext.createOscillator();
  oscGain = audioContext.createGain();
  osc.connect(oscGain);
  osc.frequency.setValueAtTime(440, 0);
  oscGain.gain.setValueAtTime(0,0);
  oscGain.connect(masterGain)
  osc.start(0);
  ws.onopen = function (event) {
    ws.send("Here's some text that the server is urgently awaiting!");
  };
}

const erasePrint = (ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
}

const textPrint = (ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, text:string) => {
  ctx.globalAlpha = 1
  ctx.fillStyle = "black"
  let textArr:[string] = [text]
  let fontSize:number = 20
  let textLength:number = 0
  Array.prototype.forEach.call(text, (s,i)=> {
    let chr = text.charCodeAt(i)
    if((chr >= 0x00 && chr < 0x81) || (chr === 0xf8f0) || (chr >= 0xff61 && chr < 0xffa0) || (chr >= 0xf8f1 && chr < 0xf8f4)){
      textLength += 1;
    }else{
      textLength += 2;
    }
  })
  if(textLength > 20) {
    fontSize = Math.floor((canvas.width * 4 / 3) / 20)
    textArr = [""]
    let lineNo = 0
    Array.prototype.forEach.call(text, (element:string,index:number) =>{
      if(index % 16 > 0 || index === 0) {
        textArr[lineNo] += element
        //console.log(textArr[lineNo])
      } else {
        textArr.push(element)
        lineNo += 1
        //console.log(textArr[lineNo])
      }
    });
  } else if(textLength > 2) {
    fontSize = Math.floor((canvas.width * 4 / 3) / textLength)
  } else {
    fontSize = Math.floor((canvas.height * 5 / 4) / textLength)
  }
  ctx.font = "bold " + String(fontSize) + "px 'Arial'";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = "white"
  if(textArr.length === 1) {
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  } else {
    textArr.forEach((element:string, index:number) => {
      //console.log("line" + String(index))
      ctx.strokeText(element, canvas.width / 2, canvas.height / 2 + (fontSize * (index - Math.round(textArr.length / 2))));
      ctx.fillText(element, canvas.width / 2, canvas.height / 2 + (fontSize * (index - Math.round(textArr.length / 2))));
    })
  }
  ctx.restore();
}
const clickListner = <HTMLElement> document.getElementById("wrapper")
clickListner.addEventListener("click", (()=>{
  if(!initFlag) initialize()
}), false);

textPrint(ctx, canvas, "click screen");