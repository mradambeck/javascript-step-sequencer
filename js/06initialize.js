///////////////////////
//// initialize.js ////
///////////////////////

var initFx = {
  filterValue: 3000,
  detune: 1000,
  q: 20,
  connection: amplifier.input,
  delayValue: 0.2
};


var fx = new FilterBank(initFx);
var osc1 = new Synth('triangle', fx.biquadFilter);

// osc1.playNote();
