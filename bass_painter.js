const pallette = ["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F", "#90BE6D", "#43AA8B", "#4D908E", "#577590", "#277DA1"];

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
      this.ctx.fillStyle = pallette[freq];
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}