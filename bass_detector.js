const BASS_BOTTOM = 0;
const BASS_TOP = 10;

class BassDetector {
  constructor(data) {
    this.data = data;
    this.beatDetector = new BeatDetector(data, BASS_BOTTOM, BASS_TOP);
  }

  getBassFreq() {
    if (this.beatDetector.detectBeat()) {
      let maxFreq = 0;
      let value = 0;
      for (let i = BASS_BOTTOM; i <= BASS_TOP; i++) {
        if (this.data[i] > value) {
          value = this.data[i];
          maxFreq = i;
        }
      }
      return maxFreq;
    }
    return null;
  }
}