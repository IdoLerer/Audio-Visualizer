const audioElement = document.getElementById("source");
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(audioCtx.destination);
const bufferLength = analyser.frequencyBinCount;
const data = new Uint8Array(bufferLength);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = 'rgba(200, 200, 200, 1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function loopingFunction() {
  requestAnimationFrame(loopingFunction);
  // analyser.getByteFrequencyData(data);
  // drawBarGraph(data);
  analyser.getByteTimeDomainData(data);
  drawWaveForm(data);
}

function drawBarGraph(data) {
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

function drawWaveForm(data) {
  data = [...data];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const max = data.reduce((a, b) => Math.max(a, b));
  if (max > 165) {
    ctx.lineWidth = 2;
    const opac = Math.min(max / 400, 1);
    let c = 255 - ((max - 165) / 20) * 255;
    ctx.strokeStyle = 'rgb(' + c + ', ' + 0 + ', ' + 0 + ')';
    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
}

audioElement.onplay = () => {
  audioCtx.resume();
  requestAnimationFrame(loopingFunction);
}