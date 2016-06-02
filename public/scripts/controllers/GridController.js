////////////////////////
// Angular controller //
////////////////////////

angular
  .module('jsSynth', [])
  .controller('GridController', GridController);


// Used to create the note grid in the browser:
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
