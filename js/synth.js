var context = new AudioContext();
var speaker = context.destination;

class Synth {
  constructor (waveform = 'triangle') {
    // Setup Oscillator
    this.osc = context.createOscillator();
    this.osc.type = 'triangle';
    this.volume = context.createGain();
    this.volume.gain.value = 0.15;

    // Play a note
    this.playNote = function (frequency, startTime, duration){
      this.osc.frequency.value = (frequency);

      // Subtle fade out of note
      this.volume.gain.setValueAtTime(0.2, startTime + duration - 0.04);
      this.volume.gain.linearRampToValueAtTime(0, startTime + duration);

      // Start and stop note
      this.osc.start(startTime);
      this.osc.stop(startTime + duration);
    };

    this.osc.connect(this.volume);

    this.volume.connect(speaker);
  }
}

// Note frequencies
var   a1 = 55, bb1 = 58.27, b1 = 61.74, c2 = 65.41, db2= 69.30, d2 = 73.42, eb2 = 77.78, e2 = 82.41, f2 = 87.31, gb2 = 92.50,
      g2 = 98, ab2 = 103.83, a2 = 110.00, bb2 = 116.54, b2 = 123.47, c3 = 130.81, db3 = 138.59, d3 = 146.83,
      eb3 = 155.56, e3 = 164.81, f3 = 174.61, gb3 = 185, g3 = 196, ab3 = 207.65, a3 = 220, bb3 = 233.08,
      b3 = 246.94, c4 = 261.63, db4 = 277.18, d4 = 293.66, eb4 = 311.13, e4 = 329.63, f4 = 349.23, gb4 = 369.99
;

var osc1 = new Synth('triangle');
osc1.playNote(c4, context.currentTime, 0.5);
