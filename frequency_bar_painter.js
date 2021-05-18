class FrequencyBarPainter {
  constructor(data, canvas) {
    this.data = data;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    this.bassDetector = new BassDetector(data);
  }

  draw() {
    const data = [...this.data];
    if (this.bassDetector.getBassFreq() !== null)
      this.ctx.clearRect(0, 0, this.width, this.height);
    const space = this.width / data.length;
    data.forEach((value, i) => {
      this.ctx.strokeStyle = i < 12 ? "red" : "black";
      this.ctx.beginPath();
      this.ctx.moveTo(space * i, this.height);
      this.ctx.lineTo(space * i, this.height - value);
      this.ctx.stroke();
      this.ctx.rotate(1 / (2 * Math.PI));
    })
  }
}