////////////////////
// SERVER SIDE JS //
////////////////////

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// connect to db models
var db = require('./models');

// configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

//////////////
// DATABASE //
//////////////

 function Note() {
   this.pitches = {
     c: 32.70325, db: 34.647875, d: 36.708125, eb: 38.890875, e: 41.2035, f: 43.6535,
     gb: 46.24925, g: 48.999375, ab: 51.913125, a: 55, bb: 58.2705, b: 61.735375, x: 0 // x is silence
   };

   this.makePitch = function(note) {
     return function(octave) {
       if (octave === 0){
         return note / 2;
       } else if (octave === 1) {
         return note;
       } else {

         // function avail to created functions:
         var octaveMaker = function(note, octave){
           octave = octave - 1;
           for (var i = 0; i < octave; i ++){
             note = note * 2;
           }
           return note;
         };
         return octaveMaker(note, octave);
       }
     };
   };

   // Not a big fan of this, but there's no way to dynamically name functions...
   this.c = this.makePitch(this.pitches.c);
   this.db = this.makePitch(this.pitches.db);
   this.d = this.makePitch(this.pitches.d);
   this.eb = this.makePitch(this.pitches.eb);
   this.e = this.makePitch(this.pitches.e);
   this.f = this.makePitch(this.pitches.f);
   this.gb = this.makePitch(this.pitches.gb);
   this.g = this.makePitch(this.pitches.g);
   this.ab = this.makePitch(this.pitches.ab);
   this.a = this.makePitch(this.pitches.a);
   this.bb = this.makePitch(this.pitches.bb);
   this.b = this.makePitch(this.pitches.b);
   this.x = this.makePitch(this.pitches.x);
 }

var note = new Note();

// var pattern = { notes: [ note.c(4), note.x(0), note.d(4), note.x(0), note.c(4), note.x(0), note.d(4), note.x(0) ],
//                 names: ['c(4)', 'x(0)', 'd(4)', 'x(0)', 'c(4)', 'x(0)', 'd(4)', 'x(0)']};

////////////
// ROUTES //
////////////

// HTML Endpoints

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// JSON Endpoints

app.get('/api/songs', function (req, res) {
  db.Song.find(function(err, songs){
    if (err) { return console.log("index error: " + err); }
    res.json(songs);
  });
});


////////////
// SERVER //
////////////

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on http://localhost:3000');
});
