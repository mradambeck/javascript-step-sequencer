var context = new AudioContext();

var filterValue = 3000;

// Play oscillators at certain frequency and for a certain time
var playNote = function (frequency, startTime, duration) {
  var osc1 = context.createOscillator(),
      osc2 = context.createOscillator(),
      volume = context.createGain();

  // Set oscillator wave type
  osc1.type = 'triangle';
  osc2.type = 'sine';

  volume.gain.value = 0.15;

  // setup Biquad Filter effect
  var biquadFilter = context.createBiquadFilter();
  biquadFilter.frequency.value = filterValue;
  biquadFilter.connect(volume);
  biquadFilter.detune.value = 1000;
  biquadFilter.Q.value = 20;

  // Set up node routing
  osc1.connect(biquadFilter);
  osc2.connect(biquadFilter);
  volume.connect(context.destination);

  // multiply for octaves
  osc1.frequency.value = (frequency * 2)+1 ;
  osc2.frequency.value = (frequency * 3)-1;
  // Detune oscillators for chorus effect
  // osc1.frequency.value = frequency + 1;
  // osc2.frequency.value = frequency - 1;

  // Subtle fade out of note
  volume.gain.setValueAtTime(0.2, startTime + duration - 0.04);
  volume.gain.linearRampToValueAtTime(0, startTime + duration);

  // Start oscillators
  osc1.start(startTime);
  osc2.start(startTime);

  // Stop oscillators
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
};



// Note frequencies
var   a1 = 55, bb1 = 58.27, b1 = 61.74, c2 = 65.41, db2= 69.30, d2 = 73.42, eb2 = 77.78, e2 = 82.41, f2 = 87.31, gb2 = 92.50,
      g2 = 98, ab2 = 103.83, a2 = 110.00, bb2 = 116.54, b2 = 123.47, c3 = 130.81, db3 = 138.59, d3 = 146.83,
      eb3 = 155.56, e3 = 164.81, f3 = 174.61, gb3 = 185, g3 = 196, ab3 = 207.65, a3 = 220, bb3 = 233.08,
      b3 = 246.94, c4 = 261.63, db4 = 277.18, d4 = 293.66, eb4 = 311.13, e4 = 329.63, f4 = 349.23, gb4 = 369.99
;


// Controls
var bpm = 117;
var noteLength = 0.3;

var  measure = [ ],
      nextPattern = [ gb2, db2, e2, gb2, e2, db2, b1, db2 ],
      end = false;

function start(){
  end = false;
  firstNote();
}
function stop(){
  end = true;
}

// The Loop
function firstNote(){
  if (!end) {
    tempo = (1000 * 60 / bpm / 2);
    measure = nextPattern;
    playNote(measure[0], context.currentTime, noteLength);
    window.setTimeout(secondNote, tempo);
  } else {
    return;
  }
}

function secondNote(){
  playNote(measure[1], context.currentTime, noteLength);
  window.setTimeout(thirdNote, tempo);
}

function thirdNote(){
  playNote(measure[2], context.currentTime, noteLength);
  window.setTimeout(fourthNote, tempo);
}

function fourthNote(){
  playNote(measure[3], context.currentTime, noteLength);
  window.setTimeout(fifthNote, tempo);
}

function fifthNote(){
  playNote(measure[4], context.currentTime, noteLength);
  window.setTimeout(sixthNote, tempo);
}

function sixthNote(){
  playNote(measure[5], context.currentTime, noteLength);
  window.setTimeout(seventhNote, tempo);
}

function seventhNote(){
  playNote(measure[6], context.currentTime, noteLength);
  window.setTimeout(eighthNote, tempo);
}

function eighthNote(){
  playNote(measure[7], context.currentTime, noteLength);
  window.setTimeout(firstNote, tempo);
