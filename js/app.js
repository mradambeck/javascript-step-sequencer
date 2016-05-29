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
  constructor (configFx) {

    let the_context = configFx.context || console.error('No Audio Context');
    let filterValue = configFx.filterValue || 15000;
    let detune = configFx.detune || 1000;
    let q = configFx.q || 20;
    let connection = configFx.connection || amplifier.input;
    let delayValue = configFx.delayValue || 0.2;

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

    var amplifier = {};
    amplifier.input = context.createGain();
    amplifier.input.gain.value = 1;
    amplifier.input.connect(speaker);

    this.configFx = {
      filterValue: 3000,
      detune: 1000,
      q: 20,
      connection: amplifier.input,
      delayValue: 0.2,
      context: context
    };

  }

  sound (){
    var fx = new FilterBank(this.configFx);
    new Synth(fx.biquadFilter, this.configFx.context).playNote(this.freq, this.dur, this.wave);
  }
}

class Loop {
  constructor(cntxt){
    this.cntxt = cntxt;

  }



  play(pattern){

    var beat = 0;
    var traverseMeasure = function(pattern, this_cntxt){

      let freq = pattern[beat];
      let note = new NoiseMaker(freq, 0.5, 'square', this_cntxt);
      note.sound();

      beat < 7 ? ( beat++ ) : ( beat = 0 ) ;

    };

    var playNoteInPattern = function(pattern, this_cntxt){
      setInterval( traverseMeasure.bind(0, pattern, this_cntxt), 900);
    };

    playNoteInPattern(pattern, this.cntxt);

  }
}

$(function(){
  const CNTXT = new AudioContext();

  // Note frequencies
  var pitch = {
    a1: 55, bb1: 58.27, b1: 61.74, c2: 65.41, db2: 69.30, d2: 73.42, eb2: 77.78,
    e2: 82.41, f2: 87.31, gb2: 92.50, g2: 98, ab2: 103.83, a2: 110, bb2: 116.54,
    b2: 123.47, c3: 130.81, db3: 138.59, d3: 146.83, eb3: 155.56, e3: 164.81,
    f3: 174.61, gb3: 185, g3: 196, ab3: 207.65, a3: 220, bb3: 233.08, b3: 246.94,
    c4: 261.63, db4: 277.18, d4: 293.66, eb4: 311.13, e4: 329.63, f4: 349.23, gb4: 369.99
  };


  // var loop = new Loop(args);
  var pattern = [pitch.a1, pitch.a1, pitch.db3, pitch.db3, pitch.a2, pitch.a2, pitch.bb3, pitch.bb3];

  $(".start-loop").click(function(){

    var loop = new Loop (CNTXT);

    loop.play(pattern);

  });





});
