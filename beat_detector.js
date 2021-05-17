const TIME_FRAME = 20;
const DETECTION_MULTIPLIER = 1.15;

class BeatDetector {
  constructor(data, startFreq, endFreq) {
    this.data = data;
    this.startFreq = startFreq;
    this.endFreq = endFreq;
    this.record = new Array(TIME_FRAME).fill(0);
  }

  avgMagnitude() {
    let sum = 0;
    for (let i = this.startFreq; i < this.endFreq; i++) {
      sum += this.data[i];
    }
    return sum / (this.endFreq - this.startFreq);
  }

  detectBeat() {
    const currentMag = this.avgMagnitude();
    const recordAvg = this.record.reduce((a, b) => a + b, 0) / TIME_FRAME;
    this.record.push(currentMag);
    this.record.shift();

    if (currentMag > recordAvg * DETECTION_MULTIPLIER) {
      return true;
    }
    return false;
  }
}