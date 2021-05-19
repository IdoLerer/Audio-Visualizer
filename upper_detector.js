const UPPER_BOTTOM = 15;
const UPPER_TOP = 30;

class UpperDetector {
  constructor(data) {
    this.data = data;
    this.beatDetector1 = new BeatDetector(data, 15, 22, 5, 1.05);
    this.beatDetector2 = new BeatDetector(data, 25, 35, 5, 1.05);
  }

  detectUpperBeat() {
    return this.beatDetector1.detectBeat() || this.beatDetector2.detectBeat();
  }
}