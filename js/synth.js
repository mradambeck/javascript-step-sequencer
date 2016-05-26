//////////////////
//// synth.js ////
//////////////////

class Synth {
  constructor (waveform, connection) {
    // Setup Oscillator
    this.osc = context.createOscillator();

    let volume = this.volume = context.createGain();
    volume.gain.value = 0.15;
    volume.connect(connection); // Connect Synth to next path (Filter)

  }
}
Synth.prototype.playNote = function (frequency = 440, startTime = NOW, duration = 0.5, wave = 'triangle') {
  let osc = this.osc;
  osc.type = wave;
  osc.frequency.value = frequency;

  // Set length of note
  let stopTime = startTime + duration;

  // Start and stop note
  osc.start(startTime);
  osc.stop(stopTime);
  osc.connect(this.volume); // Connect Oscillator to Volume
};

// => to filter.js
