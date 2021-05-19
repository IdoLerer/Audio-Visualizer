let x = 0;

const palette = palette2;

const splitPoints = throttle((points) => {
    const n = points.length;
    const dTheta = Math.random() * 2 * Math.PI / 3;
    if (n > 250) return;
    for (let i = 0; i < n; i++) {
      const point = points[i];
      point.color = palette[point.colorNumber + 1 % palette.length];
      points.push(new Point(point.x, point.y, point.theta - dTheta, point.ctx, point.maxWidth, point.maxHeight, point.colorNumber + 1));
      point.theta += dTheta;
    }
  },
  1000);

class Point {
  constructor(x, y, theta, ctx, maxWidth, maxHeight, colorNumber, lifeTime) {
    this.x = x;
    this.y = y;
    this.r = 1;
    this.theta = theta;
    this.ctx = ctx;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.colorNumber = colorNumber;
    this.color = palette[colorNumber % palette.length];
    // this.lifeTime = lifeTime || Math.random() * 350;
    this.lifeTime = lifeTime || 200;
    this.toRemove = false;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    this.ctx.fill();
    let dx = this.r * Math.cos(this.theta);
    let dy = this.r * Math.sin(this.theta);
    // if (this.x + dx > this.maxWidth || this.x + dx < 0) this.theta += Math.PI / 2;
    if (this.x + dx > this.maxWidth || this.x + dx < 0) this.toRemove = true;
    // if (this.y + dy > this.maxHeight || this.y + dy < 0) this.theta = -this.theta;
    if (this.y + dy > this.maxHeight || this.y + dy < 0) this.toRemove = true;
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
    this.points = [new Point(this.width / 2, this.height / 2, 0, this.ctx, this.width, this.height, 0, 2500),
      new Point(this.width / 2, this.height / 2, 1 * 2 * Math.PI / 4, this.ctx, this.width, this.height, 0, 2500),
      new Point(this.width / 2, this.height / 2, 2 * 2 * Math.PI / 4, this.ctx, this.width, this.height, 0, 2500),
      new Point(this.width / 2, this.height / 2, 3 * 2 * Math.PI / 4, this.ctx, this.width, this.height, 0, 2500)
    ];
    this.bassDetector = new BassDetector(data);
  }

  draw() {
    // this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.bassDetector.getBassFreq() !== null) {
      splitPoints(this.points);
    }
    // this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    // this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "destination-in";
    const fadeOutAmount = 0.99;
    this.ctx.fillStyle = "rgba(255, 255, 255, " + fadeOutAmount + ")";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
    this.points.forEach((point, i) => {
      point.draw();
      if (point.lifeTime < 0 || point.toRemove) {
        this.points.splice(i, 1);
      }
    });
  }
}