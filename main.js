const audioElement = document.getElementById("source");
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(audioCtx.destination);
const bufferLength = analyser.frequencyBinCount;
const data = new Uint8Array(bufferLength);
let isPlaying = false;

const canvas1 = document.getElementById("canvas1");
// const canvas2 = document.getElementById("canvas2");

canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
// const ctx = canvas.getContext("2d")

const bassPainter = new BassPainter(data, canvas1);
const rainPainter = new RainPainter(data, canvas1);
const turningPointPainter = new TurningPointPainter(data, canvas1);
// const frequencyBarPainter = new FrequencyBarPainter(data, canvas2);
const ellipsePainter = new EllipsePainter(data, canvas1);

function loopingFunction() {
  if (isPlaying)
    requestAnimationFrame(loopingFunction);
  analyser.getByteFrequencyData(data);
  // drawBarGraph(data);
  // analyser.getByteTimeDomainData(data);
  // bassPainter.draw();
  // rainPainter.draw();
  // ellipsePainter.draw();
  turningPointPainter.draw();
  // frequencyBarPainter.draw();
  // drawWaveForm(data);
  // drawEllipse(data);
}

audioElement.onplay = () => {
  isPlaying = true;
  audioCtx.resume();
  requestAnimationFrame(loopingFunction);
}

audioElement.onpause = () => isPlaying = false;