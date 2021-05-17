const splitPoints = throttle((points) => {
    const n = points.length;
    if (n > 250) return;
    for (let i = 0; i < n; i++) {
      const point = points[i];
      const dTheta = Math.random() * Math.PI / 2;
      point.theta += dTheta;
      points.push(new Point(point.x, point.y, point.theta - dTheta, point.ctx, point.maxWidth, point.maxHeight, point.colorNumber + 1));
    }
  },
  1000);

class Point {
  constructor(x, y, theta, ctx, maxWidth, maxHeight, colorNumber, lifeTime) {
    this.x = x;
    this.y = y;
    this.r = 3;
    this.theta = theta;
    this.ctx = ctx;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.colorNumber = colorNumber;
    this.color = palette2[colorNumber % palette2.length];
    this.lifeTime = lifeTime || Math.random() * 350;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 8, 0, 2 * Math.PI);
    this.ctx.fill();
    let dx = this.r * Math.cos(this.theta);
    let dy = this.r * Math.sin(this.theta);
    if (this.x + dx > this.maxWidth || this.x + dx < 0) this.theta += Math.PI / 2;
    if (this.y + dy > this.maxHeight || this.y + dy < 0) this.theta = -this.theta;
    dx = this.r * Math.cos(this.theta);
    dy = this.r * Math.sin(this.theta);
    this.x += dx;
    this.y += dy;
    this.lifeTime--;
  }
}

class TurningPointPainter {
  constructor(data, canvas) {
    this.data = data;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    this.points = [new Point(100, this.height / 2, 0, this.ctx, this.width, this.height, 0, 2500)];
    this.bassDetector = new BassDetector(data);
  }

  draw() {
    // this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.bassDetector.getBassFreq() !== null) {
      splitPoints(this.points);
    }
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.points.forEach((point, i) => {
      point.draw();
      if (point.lifeTime < 0) {
        this.points.splice(i, 1);
      }
    });
  }
}