class RainDrop {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.v = 10;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, this.y, 2, 2);
    this.y += this.v;
    this.v += 1;
  }
}

class RainPainter {
  constructor(data, canvas) {
    this.data = data;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    const n = Math.ceil(data.length);
    this.beatDetectors = new Array(n);
    for (let i = 0; i < n; i++) {
      this.beatDetectors[i] = new BeatDetector(data, 3 * i, 3 * (i + 1));
    }
    this.rainDrops = [];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.beatDetectors.forEach((beatDetector, i) => {
      if (beatDetector.detectBeat()) {
        this.rainDrops.push(new RainDrop(3 * i, 0, this.ctx));
      }
    })
    for (let i = 0; i < this.rainDrops.length; i++) {
      let rainDrop = this.rainDrops.shift();
      rainDrop.draw();
      if (rainDrop.y < this.height) {
        this.rainDrops.push(rainDrop);
      }
    }
  }
}