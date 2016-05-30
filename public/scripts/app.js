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
    this.freq = freq; // note frequency
    this.dur = dur; // note duration
    this.wave = wave; // note waveform

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

  play(pattern, bpm){

    var beat = 0; // Start the measure at the first beat

    var traverseMeasure = function(pattern, this_cntxt){
      let freq = pattern[beat]; // play the appropriate note in the measure
      let note = new NoiseMaker(freq, 0.5, 'triangle', this_cntxt);
      note.sound();
      $(`#o${beat}`).toggleClass('active');
      // increment if not at the last beat in the measure, start over at the end of the measure:
      beat < 7 ? ( beat++ ) : ( beat = 0 ) ;
    };



    var tempo = (1000 * 60 / bpm / 2);

    var playNoteInPattern = function(pattern, this_cntxt){
      setInterval( traverseMeasure.bind(null, pattern, this_cntxt), tempo); // set timing TODO: create BPM
    };

    playNoteInPattern(pattern, this.cntxt);

  }
}

var makePitch = function(note) {

  return function(octave) {
    if (octave === 0){
      return note / 2;
    } else if (octave === 1) {
      return note;
    } else {

      let octaveMaker = function(note, octave){
        octave = octave - 1;
        for (i = 0; i < octave; i ++){
          note = note * 2;
        }
        return note;
      };

      return octaveMaker(note, octave);
    }
  };
};


$(function(){
  const CNTXT = new AudioContext(); // This creates the space in which all audio occurs

  var c = makePitch(32.70325), db = makePitch(34.647875), d = makePitch(36.708125), eb = makePitch(38.890875), e = makePitch(41.2035),
      f = makePitch(43.6535), gb = makePitch(46.24925), g = makePitch(48.999375), ab = makePitch(51.913125), a = makePitch(55),
      bb = makePitch(58.2705), b = makePitch(61.735375);

  // The notes in the measure:
  var pattern = [ c(4), b(4), a(3), c(3), c(4), b(3), g(3), b(3) ];
  console.log(pattern);
  let bpm = 90; // Set beats per minute (calculated to milliseconds within Loop object)

  $(".note").click(function(){
    let noteData = $(this).attr('data-note');
    let beatData = parseInt($(this).attr('data-column'));
    let octCount = parseInt($(`#o${beatData}`).text());

    // TODO: Find a different way of doing this, besides using eval
    pattern[beatData] = eval(noteData)(octCount);

    $(this).addClass('active');
  });

  $("button.octave-up").click(function(){
    let beatData = $(this).attr('data-column');
    let octId = `o${beatData}`;
    let octCount = parseInt($(`#${octId}`).text());
    let newCount = (octCount + 1);
    $(`#${octId}`).text(newCount);
  });

  $("button.octave-down").click(function(){
    let beatData = $(this).attr('data-column');
    let octId = `o${beatData}`;
    let octCount = parseInt($(`#${octId}`).text());
    if (octCount > 0){
      let newCount = (octCount - 1);
      $(`#${octId}`).text(newCount);
    }
  });

  $(".start-loop").click(function(){

    var loop = new Loop (CNTXT);
    loop.play(pattern, bpm);

  });

});
