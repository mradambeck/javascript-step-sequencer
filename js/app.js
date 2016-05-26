//////////////////
//// setup.js ////
//////////////////

// Pull AudioContext
var context = new AudioContext();
var speaker = context.destination; // OUTPUT
const NOW = context.currentTime;

// Note frequencies
var   a1 = 55, bb1 = 58.27, b1 = 61.74, c2 = 65.41, db2 = 69.30, d2 = 73.42, eb2 = 77.78,
      e2 = 82.41, f2 = 87.31, gb2 = 92.50, g2 = 98, ab2 = 103.83, a2 = 110.00, bb2 = 116.54,
      b2 = 123.47, c3 = 130.81, db3 = 138.59, d3 = 146.83, eb3 = 155.56, e3 = 164.81, f3 = 174.61,
      gb3 = 185, g3 = 196, ab3 = 207.65, a3 = 220, bb3 = 233.08, b3 = 246.94, c4 = 261.63,
      db4 = 277.18, d4 = 293.66, eb4 = 311.13, e4 = 329.63, f4 = 349.23, gb4 = 369.99
;


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


////////////////////
//// filter.js ////
////////////////////

class FilterBank {
  constructor (config) {

    let filterValue = config.filterValue || null;
    let detune = config.detune || null;
    let q = config.q || null;
    let connection = config.connection || null;
    let delayValue = config.delayValue || null;

    // Biquad Filter
    let bq = this.biquadFilter = context.createBiquadFilter();
    bq.frequency.value = filterValue;
    bq.detune.value = detune;
    bq.Q.value = q;

    // Delay
    let delay = this.delay = context.createDelay();
    delay.delayTime.value = delayValue;

    // Send Delay and Reverb through a sidechain
    let sideChainVolume = this.sideChainVolume = context.createGain();
    sideChainVolume.gain.value = 0.1;


    // Connections
    bq.connect(delay);
    delay.connect(sideChainVolume);
    sideChainVolume.connect(connection);
    bq.connect(connection);

  }
}

//////////////////////
//// amplifier.js ////
//////////////////////

// Create output
var amplifier = new Object();
  amplifier.input = context.createGain();
  amplifier.input.gain.value = 1;
  amplifier.input.connect(speaker);

var initFx = {
  filterValue: 3000,
  detune: 1000,
  q: 20,
  connection: amplifier.input,
  delayValue: 0.2
};

/////////////////
//// loop.js ////
/////////////////

///////////////////////
//// initialize.js ////
///////////////////////

var fx = new FilterBank(initFx);
var osc1 = new Synth('triangle', fx.biquadFilter);
osc1.playNote();
