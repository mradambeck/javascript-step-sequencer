///////////////////////
//// initialize.js ////
///////////////////////

var fx = new FilterBank(initFx);
var osc1 = new Synth('triangle', fx.biquadFilter);
osc1.playNote();
