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
  var bpm = $('#bpm').val(); // Set beats per minute (calculated to milliseconds within Loop object)
  var userId = '';
  var waveform = $('#waveform').val(); // sets waveform value
  var filterValue = $("#filter").val();

  var settings = {
    bpm: bpm,
    filterValue: filterValue,
    waveform: waveform
  };


  if (window.location.pathname === "/"){
    $('#pattern').val(pattern);
    $('#notes').val(patternString);

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

  var generateSettings = function(song) {
    console.log(song.filterValue);
    $("#filter").val(song.filterValue);
    $('#bpm').val(song.bpm);
    $('#waveform').val(song.waveform);
  };

  function handleUserSuccess(json) {
    var userSongs = json.songs;
    var lastSong = userSongs[userSongs.length-1];
    pattern = lastSong.pattern;
    patternString = lastSong.notes;
    activateGrid(lastSong.notes);
    generateSettings(lastSong);
    // console.log('user: ', json);
    $('span.username').html(json.username);
    console.log('hey');
    console.log('lastSong.filterValue = ', lastSong.filterValue);
  }
  function handleUserError(xhr, status, errorThrown) {
    console.error(xhr, status, errorThrown);
  }

  function handleNoUserSuccess(json) {
  }
  function handleNoUserError(xhr, status, errorThrown) {
    console.error(xhr, status, errorThrown);
  }

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
  });

  var grabNoteOnOctaveClick = function(beatData, math){
    let activeNote = $(`button[data-column="${beatData}"].active`).attr('data-note');
    let noteData = 'note.' + activeNote;
    let octId = `o${beatData}`;
    let octCount = parseInt($(`#${octId}`).text());
    let newCount = octCount + math;
    let stringOfNoteFunction = `${activeNote}(${octCount})`;
    let newNoteString = `${activeNote}(${newCount})`;

    if (math === +1){
      if (octCount < 8 ){
        let newCount = (octCount + 1);
        $(`#${octId}`).text(newCount);
      }
    } else {
      if (octCount > 0){
        let newCount = (octCount - 1);
        $(`#${octId}`).text(newCount);
      }
    }

    var octaveObject = {
      activeNote: activeNote, noteData: noteData, octId: octId, newCount: newCount,
      octCount: octCount, stringOfNoteFunction: stringOfNoteFunction, newNoteString: newNoteString
    };
    return octaveObject;
  };

  // Changing Octaves
  $("button.octave-up").click(function(){
    let beatData = $(this).attr('data-column');
    let octaveHash = grabNoteOnOctaveClick(beatData, +1);
    pattern[beatData] = eval(octaveHash.noteData)(octaveHash.newCount);
    patternString[beatData] = octaveHash.newNoteString;
  });
  $("button.octave-down").click(function(){
    let beatData = $(this).attr('data-column');
    let octaveHash = grabNoteOnOctaveClick(beatData, -1);
    pattern[beatData] = eval(octaveHash.noteData)(octaveHash.newCount);
    patternString[beatData] = octaveHash.newNoteString;
  });

  // Starting the Loop
  $(".start-loop").click(function(){
    var loop = new Loop (CNTXT);
    loop.play(pattern, settings);
    $(".start-loop").prop('disabled', true);
    $(".stop-loop").prop('disabled', false);

    $("#bpm").change(function() {
      let beatsPer = $('#bpm').val();
      loop.tempo = (1000 * 60 / beatsPer / 2);
      settings.bpm = beatsPer;
    });

    $("#filter").change(function() {
      settings.filterValue = $('#filter').val();
      console.log(settings);
    });

    $('#waveform').change(function() {
      settings.waveform = $('#waveform').val();
      console.log(settings);
    });

    // Stopping the Loop
    $(".stop-loop").click(function(){
      $(".octave-count").removeClass("active");
      $(".start-loop").prop('disabled', false);
      $(".stop-loop").prop('disabled', true);

      loop.stop();
    });

  });



  // Save song
  $("button.save-song").click(function(){
    let newSong = {
      title: 'newest song',
      pattern: pattern,
      notes: patternString,
      bpm: settings.bpm,
      filterValue: settings.filterValue,
      waveform: settings.waveform
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
    settings.bpm = $('#bpm').val();
  });

});
