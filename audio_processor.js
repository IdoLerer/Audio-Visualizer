const audioElement = document.getElementById("source");
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(audioCtx.destination);
const data = new Uint8Array(analyser.frequencyBinCount);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function loopingFunction() {
  requestAnimationFrame(loopingFunction);
  analyser.getByteFrequencyData(data);
  draw(data);
}

requestAnimationFrame(loopingFunction);

function draw(data) {
  data = [...data];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const space = canvas.width / data.length;
  data.forEach((value, i) => {
    ctx.beginPath();
    ctx.moveTo(space * i, canvas.height); //x,y
    ctx.lineTo(space * i, canvas.height - value); //x,y
    ctx.stroke();
  })
}

audioElement.onplay = () => {
  audioCtx.resume();
}