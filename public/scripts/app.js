/////////////
// Angular //
/////////////

angular
  .module('jsSynth', []);
}


////////////
// jQuery //
////////////

$(function(){
  const CNTXT = new window.AudioContext() || window.webkitAudioContext(); // This creates the space in which all audio occurs

  var note = new Note(); // allows you to generate octaves of notes dynamically

  var pattern = [ note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0) ]; // notes in the measure

  $.ajax({
    method: 'GET',
    url: '/api/songs',
    success: handleSuccess,
    error: handleError
  });

  function handleSuccess(json) {
    pattern = json[0].pattern;
    console.log(json[0]);
  }

  function handleError(xhr, status, errorThrown) {
    console.log(xhr, status, errorThrown);
  }

  var bpm = $('#bpm').val(); // Set beats per minute (calculated to milliseconds within Loop object)

  // Selecting notes
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

  // Changing Octaves
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

  // Starting the Loop
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

  // Changing BPM
  $("#bpm").change(function() {
    bpm = $('#bpm').val();
  });

});
