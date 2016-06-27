var db = require('../models'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = db.User,
    Song = db.Song;

// GET ALL users

function index (req, res){
  User.find(function(err, users){
    if (err) {
      res.status(400).send({error: err});
      console.error("index error: " + err);
    }
    res.json(users);
  });
}

// GET One user

function show (req, res){
  db.User.findOne({_id: req.params.userId}, function(err, user){
    if (err) {
      res.status(400).send({error: err});
      console.error("index error: " + err);
    }
    res.json(user);
  });
}

function createUser (req, res){

  db.User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken, try logging in' });
    }
  });

  var patternArray = req.body.pattern.split(',');
  var noteArray = req.body.notes.split(',');
  var songFilterValue = req.body.filterValue,
      songDuration = req.body.duration,
      songDelay = req.body.delay,
      songFeedback = req.body.feedback,
      songWaveform = req.body.waveform,
      songBpm = req.body.bpm;

  var songArray = [];
  var firstSong = new Song ({
    title: "First Song",
    pattern: patternArray,
    notes: noteArray,
    bpm: songBpm,
    filterValue: songFilterValue,
    waveform: songWaveform,
    duration: songDuration,
    delay: songDelay,
    feedback: songFeedback
  });
  songArray.push(firstSong);

  User.register(new User({
      username: req.body.username,
      email: req.body.email,
      songs: songArray
    }), req.body.password,
    function (err, newUser) {
      if (err){
        res.status(500).send({error: err});
        console.error('Error when signing up');
      }
      console.log('created user: ', newUser);
      passport.authenticate('local')(req, res, function() {
        res.redirect('/users/' + newUser.id);
      });
    }
  );

}

function login(req, res) {
  console.log('logged in: ', req.user);
  res.redirect('/users/' + req.user.id);
}

function logout(req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect('/');
}


// export public methods here
module.exports = {
  index: index,
  createUser: createUser,
  login: login,
  logout: logout,
  show: show
};
