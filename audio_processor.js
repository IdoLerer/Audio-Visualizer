function drawWaveForm(data) {
  data = [...data];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const max = data.reduce((a, b) => Math.max(a, b));
  if (max > 155) {
    ctx.lineWidth = 2;
    const opac = Math.min(max / 400, 1);
    let c = 255 - ((max - 165) / 20) * 255;
    ctx.strokeStyle = 'rgb(' + 0 + ', ' + 0 + ', ' + 0 + ')';
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

class Ellipse {
  constructor(a, b, xCenter, yCenter, data) {
    this.a = a;
    this.b = b;
    this.data = data ? Array.from(data) : null;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.r = b / a;
    this.rate = 8;
    this.visible = false;
  }

  draw(data) {
    let rate = this.rate;
    if (!data) data = this.data
    else rate = 0;
    ctx.beginPath();
    this.visible = false;
    for (let i = 0; i <= bufferLength; i++) {
      const t = i * 2 * Math.PI / bufferLength;
      const xPos = this.xCenter - (this.a * Math.cos(t));
      const yPos = this.yCenter + (this.b * Math.sin(t)) + 2 * data[i % bufferLength];
      this.visible = this.visible || Math.abs(xPos) < canvas.width || Math.abs(yPos) < canvas.height;
      if (i == 0) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos);
      }
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#232323";
    ctx.stroke();
    ctx.closePath();
    this.a += rate;
    this.b += rate * this.r;
  }
}

const ellipseQueue = [];

const createEllipse = throttle((data) => {
  const lastEllipse = ellipseQueue[10];
  if (lastEllipse) {
    if (!lastEllipse.visible) {
      ellipseQueue.shift();
    } else {
      return;
    }
  }
  ellipseQueue.push(new Ellipse(400, 100, canvas.width / 2, canvas.height / 2, data));
}, 1000);

const mainEllipse = new Ellipse(400, 100, canvas.width / 2, canvas.height / 2)

function drawEllipse(data) {
  data = [...data];
  const max = data.reduce((a, b) => Math.max(a, b));
  if (max > 171) {
    createEllipse(data);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ellipseQueue.forEach((ellipse) => ellipse.draw());
  mainEllipse.draw(data);
}