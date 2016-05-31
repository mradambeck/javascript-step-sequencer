angular
  .module('jsSynth', [])
  .controller('GridController', GridController);

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
    pattern[beatData] = eval(noteData)(octCount); // TODO: Find a different way of doing this, besides using eval

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
