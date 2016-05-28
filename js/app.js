class Synth {

  constructor (connection, the_context) {

    this.now = the_context.currentTime;
    // Setup Oscillator
    this.osc = the_context.createOscillator();

    let volume = this.volume = the_context.createGain();
    volume.gain.value = 0.15;
    volume.connect(connection); // Connect Synth to next path (Filter)

  }

  playNote (frequency = 440, duration = 0.5, wave = 'triangle') {
    console.log("playing note");
    let osc = this.osc;
    osc.type = wave;
    osc.frequency.value = frequency;

    // Set length of note
    let stopTime = this.now + duration;

    // Start and stop note
    osc.start(this.now);
    osc.stop(stopTime);
    osc.connect(this.volume); // Connect Oscillator to Volume
  }

}


class FilterBank {
  constructor (config) {

    console.log("created FilterBank");
    let the_context = config.context || console.error('No Audio Context');
    let filterValue = config.filterValue || 15000;
    let detune = config.detune || 1000;
    let q = config.q || 20;
    let connection = config.connection || amplifier.input;
    let delayValue = config.delayValue || 0.2;

    // Biquad Filter
    let bq = this.biquadFilter = the_context.createBiquadFilter();
    bq.frequency.value = filterValue;
    bq.detune.value = detune;
    bq.Q.value = q;

    // Delay
    let delay = this.delay = the_context.createDelay();
    delay.delayTime.value = delayValue;

    // Send Delay and Reverb through a sidechain
    let sideChainVolume = this.sideChainVolume = the_context.createGain();
    sideChainVolume.gain.value = 0.1;


    // Connections
    bq.connect(delay);
    delay.connect(sideChainVolume);
    sideChainVolume.connect(connection);
    bq.connect(connection);

  }
}

class NoiseMaker {
  constructor(freq, dur, wave, context){
    var speaker = context.destination; // OUTPUT
    this.freq = freq;
    this.dur = dur;
    this.wave = wave;

    // Note frequencies
    var   a1 = 55, bb1 = 58.27, b1 = 61.74, c2 = 65.41, db2 = 69.30, d2 = 73.42, eb2 = 77.78,
          e2 = 82.41, f2 = 87.31, gb2 = 92.50, g2 = 98, ab2 = 103.83, a2 = 110.00, bb2 = 116.54,
          b2 = 123.47, c3 = 130.81, db3 = 138.59, d3 = 146.83, eb3 = 155.56, e3 = 164.81, f3 = 174.61,
          gb3 = 185, g3 = 196, ab3 = 207.65, a3 = 220, bb3 = 233.08, b3 = 246.94, c4 = 261.63,
          db4 = 277.18, d4 = 293.66, eb4 = 311.13, e4 = 329.63, f4 = 349.23, gb4 = 369.99
    ;

    var amplifier = {};
    amplifier.input = context.createGain();
    amplifier.input.gain.value = 1;
    amplifier.input.connect(speaker);

    this.initFx = {
      filterValue: 3000,
      detune: 1000,
      q: 20,
      connection: amplifier.input,
      delayValue: 0.2,
      context: context
    };

    // window.setTimeout(closeContext, 1);
    //
    // var closeContext = function(){
    //   context.close();
    // };

  }

  sound (){
    var fx = new FilterBank(this.initFx);
    new Synth(fx.biquadFilter, this.initFx.context).playNote(this.freq, this.dur, this.wave);
  }
}



$(function(){
  const CNTXT = new AudioContext();
  window.noises = {};

  $("button").click(function(){


    let freq = $(this).data("freq");
    let note = window.noises[freq] || new NoiseMaker(freq, 0.5, 'square', CNTXT);




    var playIt = function () {

      var noteMaker = function() {
        note.sound();
      };

      note.sound();

      setInterval(
        noteMaker, 900
      );

    };

    playIt();
    // note.sound();



  });

});
