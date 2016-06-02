/////////////
// Angular //
/////////////

angular
  .module('jsSynth', []);



////////////
// jQuery //
////////////

$(function(){
  const CNTXT = new window.AudioContext() || window.webkitAudioContext(); // This creates the space in which all audio occurs

  var note = new Note(); // allows you to generate octaves of notes dynamically
  var pattern = [ note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0), note.x(0) ]; // notes in the measure
  var patternString = [ 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)' ]; // string version (used in recall of pattern)

  var userId = '';

  if (window.location.pathname === "/"){
    $(".note").click(function(){
      $('#pattern').val(pattern);
      $('#notes').val(patternString);
    });


  } else {

    let path = window.location.pathname;
    userId = path.split('/')[2];

    $.ajax({
      method: 'GET',
      url: ('/api/users/' + userId),
      success: handleUserSuccess,
      error: handleUserError
    });


  }

  // adds styling to grid to show what notes are active
  var activateGrid = function (arr){
    for (var i = 0; i < arr.length; i++ ){
      let splitNote = arr[i].split('(');
      let splitNum = splitNote[1].split(')');
      if (splitNote[0] !== 'x'){
        $(`button[data-note=${splitNote[0]}][data-column="${i}"]`).addClass('active');
        $(`button[data-note="x"][data-column="${i}"]`).removeClass('active');
        $(`button[data-column="${i}"][data-octave="count"]`).text(splitNum[0]);
      }
    }
  };

  function handleUserSuccess(json) {
    var userSongs = json.songs;
    console.log('userSongs, pattern: ', userSongs[userSongs.length-1].pattern);
    console.log('userSongs, notes: ', userSongs[userSongs.length-1].notes);
    pattern = userSongs[userSongs.length-1].pattern;
    patternString = userSongs[userSongs.length-1].notes;
    activateGrid(userSongs[userSongs.length-1].notes);
    // console.log('user: ', json);
    $('span.username').html(json.username);
  }

  function handleUserError(xhr, status, errorThrown) {
    console.log(xhr, status, errorThrown);
  }

  function handleNoUserSuccess(json) {

  }

  function handleNoUserError(xhr, status, errorThrown) {
    console.log(xhr, status, errorThrown);
  }


  var bpm = $('#bpm').val(); // Set beats per minute (calculated to milliseconds within Loop object)

  // Selecting notes
  $(".note").click(function(){
    let activeNote = $(this).attr('data-note');
    let noteData = 'note.' + activeNote;
    let beatData = parseInt($(this).attr('data-column'));
    let octCount = parseInt($(`#o${beatData}`).text());
    let stringOfNoteFunction = `${activeNote}(${octCount})`;

    // TODO: Find a way of doing this without using eval
    pattern[beatData] = eval(noteData)(octCount);
    patternString[beatData] = stringOfNoteFunction;

    $(`button[data-column=${beatData}]`).each(function() {
      $(this).removeClass('active');
    });

    $(this).addClass('active');
    console.log(patternString);
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
    });

  });

  // Save song
  $("button.save-song").click(function(){
    let newSong = {
      title: 'newest song',
      pattern: pattern,
      notes: patternString
    };

    $.ajax({
      method: "POST",
      url: "/api/users/" + userId + "/songs",
      data: newSong,
      dataType: "json",
      success: submitSongSuccess,
      error: submitSongError
    });

    var submitSongSuccess = function(){
      console.log('yay');
    };
    var submitSongError = function(){
      console.error('boo');
    };
  });

  // Changing BPM
  $("#bpm").change(function() {
    bpm = $('#bpm').val();
  });

});
