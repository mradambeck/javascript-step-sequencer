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

// => to loop.js
