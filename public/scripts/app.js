/////////////
// Angular //
/////////////

angular
  .module('jsSynth', []);



////////////
// jQuery //
////////////

var activateGrid = function (arr){
  for (var i = 0; i < arr.length; i++ ){
    console.log(arr[i]);
    let splitNote = arr[i].split('(');
    let splitNum = splitNote[1].split(')');
    console.log(splitNum);
    if (splitNote[0] !== 'x'){
      $(`button[data-note=${splitNote[0]}][data-column="${i}"]`).addClass('active');
      $(`button[data-note="x"][data-column="${i}"]`).removeClass('active');
      $(`button[data-column="${i}"][data-octave="count"]`).text(splitNum[0]);
    }


  }
};

$(function(){
  const CNTXT = new window.AudioContext() || window.webkitAudioContext(); // This creates the space in which all audio occurs

  var note = new Note(); // allows you to generate octaves of notes dynamically
  var pattern = [ note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0) ]; // notes in the measure



  if (window.location.pathname === "/"){
    $.ajax({
      method: 'GET',
      url: '/api/songs',
      success: handleNoUserSuccess,
      error: handleNoUserError
    });
  } else {

    let path = window.location.pathname;
    let userId = path.split('/')[2];

    $.ajax({
      method: 'GET',
      url: ('/api/users/' + userId + '/songs'),
      success: handleUserSuccess,
      error: handleUserError
    });
  }

  function handleUserSuccess(json) {
    pattern = json[0].pattern;
    console.log(json[0].pattern);
    activateGrid(json[0].notes);
  }

  function handleUserError(xhr, status, errorThrown) {
    console.log(xhr, status, errorThrown);
  }

  function handleNoUserSuccess(json) {
    // pattern = json[0].pattern;
    // console.log(json[0]);
  }

  function handleNoUserError(xhr, status, errorThrown) {
    console.log(xhr, status, errorThrown);
  }


  var bpm = $('#bpm').val(); // Set beats per minute (calculated to milliseconds within Loop object)

  // Selecting notes
  $(".note").click(function(){
    let noteData = 'note.' + ($(this).attr('data-note'));
    console.log('noteData: ',noteData);
    let beatData = parseInt($(this).attr('data-column'));
    console.log('beatData: ',beatData);
    let octCount = parseInt($(`#o${beatData}`).text());
    console.log('octCount: ',octCount);
    // TODO: Find a way of doing this without using eval
    pattern[beatData] = eval(noteData)(octCount);

    console.log(pattern);

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
