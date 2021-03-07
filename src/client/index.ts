import { textPrint } from "./module"

const ws: WebSocket = new WebSocket("ws://localhost:3333");
ws.onopen = function (event) {
  console.log(event)
  //ws.send("text")
  ws.send(JSON.stringify({"message": "test", "val": 0}));
};

let video:HTMLElement;
let buffer = document.createElement('canvas');

let initFlag: boolean = false
let audioContext: AudioContext
let masterGain: GainNode
let osc: OscillatorNode
let oscGain: GainNode
let oscPortament:number = 0;
const canvas = <HTMLCanvasElement> document.getElementById('cnvs')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

let absolute: number = 0;
let alpha: number = 0;
let beta: number = 0;
let gamma: number = 0;

const initialize = () =>{
  //erase Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);  

  initFlag = true
  setInterval(handleInterval, 500); //handleorientation
  console.log("client start")
  //audioContext
  audioContext = new AudioContext();
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(1,0) 
  masterGain.connect(audioContext.destination);
  // sinewave
  osc = audioContext.createOscillator();
  oscGain = audioContext.createGain();
  osc.connect(oscGain);
  osc.frequency.setValueAtTime(440, 0);
  oscGain.gain.setValueAtTime(0,0);
  oscGain.connect(masterGain)
  osc.start(0);
  const json = {
    message: "hello",
    valA: 0,
    valB: 1,
    valC: 100
  }
  //ws.onopen = function (event) {
    // console.log(event)
    ws.send(JSON.stringify(json));
  // };
}


const textDraw = (ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, text:string) => {
  ctx.globalAlpha = 1
  ctx.fillStyle = "black"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = "white"
  const textVal = textPrint(text, canvas.width, canvas.height)
  ctx.font = textVal.font

  if(textVal.textArr.length === 1) {
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  } else {
    textVal.textArr.forEach((element:string, index:number) => {
      //console.log("line" + String(index))
      ctx.strokeText(element, canvas.width / 2, canvas.height / 2 + (textVal.fontSize * (index - Math.round(textVal.textArr.length / 2))));
      ctx.fillText(element, canvas.width / 2, canvas.height / 2 + (textVal.fontSize * (index - Math.round(textVal.textArr.length / 2))));
    })
  }
  ctx.restore();
}
const clickListner = <HTMLElement> document.getElementById("wrapper")
clickListner.addEventListener("click", (()=>{
  if(!initFlag) initialize()
}), false);


let handleFlag:boolean = false

const handleInterval = () => {
  console.log(alpha)
}

const handleOrientation = (event: any) => {
  absolute = event.absolute;
  alpha    = event.alpha;
  beta     = event.beta;
  gamma    = event.gamma;
  //textDraw(ctx, canvas, event.alpha)
  console.log("debug")
  handleFlag = false
}

if(window.DeviceOrientationEvent){
  window.addEventListener("deviceorientation", handleOrientation, true);
} else {
  console.log("device not have gyro sensor")
}

textDraw(ctx, canvas, "click screen");