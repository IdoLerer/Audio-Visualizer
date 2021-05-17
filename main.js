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
const canvas2 = document.getElementById("canvas2");
// const ctx = canvas.getContext("2d");

const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const bassPainter = new BassPainter(data, canvas1);
const frequencyBarPainter = new FrequencyBarPainter(data, canvas2);

function loopingFunction() {
  if (isPlaying)
    requestAnimationFrame(loopingFunction);
  analyser.getByteFrequencyData(data);
  // drawBarGraph(data);
  // analyser.getByteTimeDomainData(data);
  bassPainter.draw();
  frequencyBarPainter.draw();
  // drawWaveForm(data);
  // drawEllipse(data);
}

audioElement.onplay = () => {
  isPlaying = true;
  audioCtx.resume();
  requestAnimationFrame(loopingFunction);
}

audioElement.onpause = () => isPlaying = false;