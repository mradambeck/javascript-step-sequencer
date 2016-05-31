angular
  .module('jsSynth', [])
  .controller('GridController', GridController);

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
    let delayValue = configFx.delayValue || 0.1;

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
      let lastBeat = beat - 1;
      note.sound();

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

    this.tempo = (1000 * 60 / bpm / 2);
    var tempo = this.tempo;

    var playNoteInPattern = function(pattern, this_cntxt){
      setInterval( traverseMeasure.bind(null, pattern, this_cntxt), tempo);
    };

    playNoteInPattern(pattern, this.cntxt);

  }
}

function Note() {
  this.pitches = {
    c: 32.70325, db: 34.647875, d: 36.708125, eb: 38.890875, e: 41.2035, f: 43.6535,
    gb: 46.24925, g: 48.999375, ab: 51.913125, a: 55, bb: 58.2705, b: 61.735375, x: 0
  }; // x is silence

  this.makePitch = function(note) {
    return function(octave) {
      if (octave === 0){
        return note / 2;
      } else if (octave === 1) {
        return note;
      } else {

        // function avail to created functions:
        let octaveMaker = function(note, octave){
          octave = octave - 1;
          for (var i = 0; i < octave; i ++){
            note = note * 2;
          }
          return note;
        };
        return octaveMaker(note, octave);
      }
    };
  };

  this.c = this.makePitch(this.pitches.c);
  this.db = this.makePitch(this.pitches.db);
  this.d = this.makePitch(this.pitches.d);
  this.eb = this.makePitch(this.pitches.eb);
  this.e = this.makePitch(this.pitches.e);
  this.f = this.makePitch(this.pitches.f);
  this.gb = this.makePitch(this.pitches.gb);
  this.g = this.makePitch(this.pitches.g);
  this.ab = this.makePitch(this.pitches.ab);
  this.a = this.makePitch(this.pitches.a);
  this.bb = this.makePitch(this.pitches.bb);
  this.b = this.makePitch(this.pitches.b);
  this.x = this.makePitch(this.pitches.x);
}

////////////////////////
// Angular controller //
////////////////////////

function GridController () {
  var vm = this;
  let note = new Note();
  pitchArray = ['b','bb','a','ab','g','gb','f','e','eb','d','db','c'];
  vm.gridL = [
    { name: "0", pitches: pitchArray },
    { name: "1", pitches: pitchArray },
    { name: "2", pitches: pitchArray },
    { name: "3", pitches: pitchArray }
  ];

  vm.gridR = [
    { name: "4", pitches: pitchArray },
    { name: "5", pitches: pitchArray },
    { name: "6", pitches: pitchArray },
    { name: "7", pitches: pitchArray }
  ];
}

////////////
// jQuery //
////////////

$(function(){
  const CNTXT = new window.AudioContext() || window.webkitAudioContext(); // This creates the space in which all audio occurs
  var note = new Note(); // allows you to generate octaves of notes dynamically
  var pattern = [ note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0) ]; // notes in the measure
  var bpm = $('#bpm').val(); // Set beats per minute (calculated to milliseconds within Loop object)

  $(".note").click(function(){
    let noteData = 'note.' + ($(this).attr('data-note'));
    let beatData = parseInt($(this).attr('data-column'));
    let octCount = parseInt($(`#o${beatData}`).text());

    // TODO: Find a different way of doing this, besides using eval
    pattern[beatData] = eval(noteData)(octCount);

    $(`button[data-column=${beatData}]`).each(function() {
      $(this).removeClass('active');
    });

    $(this).addClass('active');
  });

  $("button.octave-up").click(function(){
    let beatData = $(this).attr('data-column');
    let octId = `o${beatData}`;
    let octCount = parseInt($(`#${octId}`).text());
    if (octCount < 8 ){
      let newCount = (octCount + 1);
      $(`#${octId}`).text(newCount);
    }
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

    $("#bpm").change(function() {
      let beatsPer = $('#bpm').val();
      loop.tempo = (1000 * 60 / beatsPer / 2);
      console.log(loop.tempo);
      console.log(beatsPer);
    });

  });

  $("#bpm").change(function() {
    bpm = $('#bpm').val();
  });

});
