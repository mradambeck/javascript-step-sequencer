// Sound creation

class Synth {
  constructor (connection, the_context) {
    this.now = the_context.currentTime;

    // Setup Oscillator
    this.osc = the_context.createOscillator();

    let volume = this.volume = the_context.createGain();
    volume.gain.value = 0.15;
    volume.connect(connection); // Connect Synth to next path (Filter)
  }

  playNote (frequency = 440, duration = 0.5, wave = triangle) {
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
    let delayValue = configFx.delayValue || 0.1;
    let feedbackValue = configFx.feedbackValue || 0.3;

    // Biquad Filter
    let bq = this.biquadFilter = the_context.createBiquadFilter();
    bq.frequency.value = filterValue;
    bq.detune.value = detune;
    bq.Q.value = q;

    // Delay
    let delay = this.delay = the_context.createDelay();
    let delayFeedback = the_context.createGain();
    let delayDegradation = the_context.createBiquadFilter();
    delayFeedback.gain.value = feedbackValue;
    delay.delayTime.value = delayValue;
    delayDegradation.frequency.value = 1500;


    // Send Delay and Reverb through a sidechain
    let sideChainVolume = this.sideChainVolume = the_context.createGain();
    sideChainVolume.gain.value = 0.1;


    // Connections
    bq.connect(delayDegradation);
    delayDegradation.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(sideChainVolume);
    sideChainVolume.connect(connection);
    bq.connect(connection);

  }
}

class NoiseMaker {
  constructor(freq, context, settings){
    var speaker = context.destination; // OUTPUT
    this.freq = freq; // note frequency
    this.dur = (settings.duration / 100); // note duration
    this.wave = settings.waveform; // note waveform

    var amplifier = {};
    amplifier.input = context.createGain();
    amplifier.input.gain.value = 1;
    amplifier.input.connect(speaker);

    this.configFx = {
      filterValue: settings.filterValue,
      detune: 1000,
      q: 20,
      connection: amplifier.input,
      delayValue: settings.delay/10,
      feedbackValue: settings.feedback/10,
      context: context
    };

  }
  // call to create a sound
  sound (){
    var fx = new FilterBank(this.configFx);
    new Synth(fx.biquadFilter, this.configFx.context).playNote(this.freq, this.dur, this.wave);
  }
}

class Loop {
  constructor(cntxt){
    this.cntxt = cntxt; // main audio context
  }
  play(pattern, settings){

    console.log(settings);
    var beat = 0; // Start the measure at the first beat

    var traverseMeasure = function(pattern, this_cntxt){
      let freq = pattern[beat]; // play the appropriate note in the measure
      let note = new NoiseMaker(freq, this_cntxt, settings);
      let lastBeat = beat - 1;
      note.sound();

      // Visually display the movement through the measure
      if ( beat === 0 ){
        $(`#o${beat}`).addClass('active');
        $(`#o7`).removeClass('active');
      } else {
        $(`#o${beat}`).addClass('active');
        $(`#o${lastBeat}`).removeClass('active');
      }

      // increment if not at the last beat in the measure, start over at the end of the measure:
      beat < 7 ? ( beat++ ) : ( beat = 0 );
    };

    this.tempo = (1000 * 60 / settings.bpm / 2);
    var tempo = this.tempo;
    var interval;

    var playNoteInPattern = function(pattern, this_cntxt){
      interval = setInterval( traverseMeasure.bind(null, pattern, this_cntxt), tempo);
    };

    playNoteInPattern(pattern, this.cntxt);
    this.stop = function(){
      clearInterval(interval);
    };
  }

}
