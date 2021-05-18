class Ellipse {
  constructor(ctx, a, b, xCenter, yCenter, data) {
    this.a = a;
    this.b = b;
    this.data = data ? Array.from(data).fill(0) : null;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.r = b / a;
    this.rate = 8;
    this.visible = false;
    this.ctx = ctx;
  }

  draw(data) {
    let rate = this.rate;
    if (!data) data = this.data
    else rate = 0;
    this.ctx.beginPath();
    this.visible = false;
    for (let i = 0; i <= data.length; i++) {
      const t = i * 2 * Math.PI / data.length;
      const xPos = this.xCenter - (this.a * Math.cos(t));
      const yPos = this.yCenter + (this.b * Math.sin(t)) + 2 * data[i % data.length];
      this.visible = this.visible || Math.abs(xPos) < this.width || Math.abs(yPos) < this.height;
      if (i == 0) {
        this.ctx.moveTo(xPos, yPos);
      } else {
        this.ctx.lineTo(xPos, yPos);
      }
    }
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#232323";
    this.ctx.stroke();
    this.ctx.closePath();
    this.a += rate;
    this.b += rate * this.r;
  }
}

class EllipsePainter {
  constructor(data, canvas) {
    this.data = data;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    this.bassDetector = new BassDetector(data);
    this.mainEllipse = new Ellipse(this.ctx, 400, 100, canvas.width / 2, 0);
    this.throttledCreateEllipse = throttle(() => this.createEllipse(), 100);
    this.ellipseQueue = [];
  }

  draw() {
    const arrData = [...this.data];
    if (this.bassDetector.getBassFreq() !== null) {
      this.throttledCreateEllipse(this.data);
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ellipseQueue.forEach((ellipse) => ellipse.draw());
    this.mainEllipse.draw(this.data);
  }

  createEllipse(data) {
    const lastEllipse = this.ellipseQueue[10];
    if (lastEllipse) {
      if (!lastEllipse.visible) {
        this.ellipseQueue.shift();
      } else {
        return;
      }
    }
    this.ellipseQueue.push(new Ellipse(this.ctx, 400, 100, this.width / 2, 150, this.data));
  }
}