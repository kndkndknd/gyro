export const textPrint = (text: string, canvasWidth:number, canvasHeight:number) => {
  let textLength:number = 0
  let fontSize:number = 20
  let textArr:string[] = []
  Array.prototype.forEach.call(text, (s,i)=> {
    let chr = text.charCodeAt(i)
    if((chr >= 0x00 && chr < 0x81) || (chr === 0xf8f0) || (chr >= 0xff61 && chr < 0xffa0) || (chr >= 0xf8f1 && chr < 0xf8f4)){
      textLength += 1;
    }else{
      textLength += 2;
    }
  })
  if(textLength > 20) {
    fontSize = Math.floor((canvasWidth * 4 / 3) / 20)
    textArr = [""]
    let lineNo = 0
    Array.prototype.forEach.call(text, (element:string,index:number) =>{
      if(index % 16 > 0 || index === 0) {
        textArr[lineNo] += element
      } else {
        textArr.push(element)
        lineNo += 1
      }
    });
  } else if(textLength > 2) {
    fontSize = Math.floor((canvasWidth * 4 / 3) / textLength)
  } else {
    fontSize = Math.floor((canvasHeight * 5 / 4) / textLength)
  }

  const font:string = "bold " + String(fontSize) + "px 'Arial'";

  return {font: font, fontSize: fontSize, textArr: textArr} 
}