class BassPainter {
  constructor(data, canvas) {
    this.bassDetector = new BassDetector(data);
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
  }

  draw() {
    const freq = this.bassDetector.getBassFreq();
    if (freq === null) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.ctx.fillStyle = palette[freq];
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}