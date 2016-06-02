////////////////////
// SERVER SIDE JS //
////////////////////

// get me all the things
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    controllers = require('./controllers'),
    db = require('./models'),
    Song = db.Song,
    User = db.User
;

// configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// middleware for auth
app.use(cookieParser());
app.use(session({
  secret: 'ornamenttopochicoscrabble',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

////////////
// ROUTES //
////////////

//// HTML Endpoints ////

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html', { user: JSON.stringify(req.user) + " || null" });
});
app.get('/users/:userId', function homepage(req, res) {
  res.sendFile(__dirname + '/views/user.html', { user: JSON.stringify(req.user) + " || null" });
});


//// JSON Endpoints ////

// Songs
app.get     ('/api/songs',                    controllers.songs.index);
app.get     ('/api/users/:userId/songs/:id',  controllers.songs.show);
app.get     ('/api/users/:userId/songs',      controllers.songs.firstSong);
app.post    ('/api/users/:userId/songs',      controllers.songs.createSong);
app.put     ('/api/users/:userId/songs/:id',  controllers.songs.updateSong);
app.delete  ('/api/users/:userId/songs/:id',  controllers.songs.deleteSong);

// Users
app.get     ('/api/users',                    controllers.users.index);
app.post    ('/signup',                       controllers.users.createUser);
app.get     ('/logout',                       controllers.users.logout);

app.post    ('/login', passport.authenticate('local'), controllers.users.login);

////////////
// SERVER //
////////////

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on http://localhost:3000');
});
