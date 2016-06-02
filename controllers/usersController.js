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



function createUser (req, res){

  db.User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken, try logging in' });
    }
  });

  var songArray = [];
  var defaultSong = new Song ({
    title: "New Song",
    pattern: [554.366, 0, 369.994, 587.33, 277.183, 369.994, 0, 277.183],
    notes: [ 'db(5)', 'x(0)', 'gb(4)', 'd(5)', 'db(4)', 'gb(4)', 'x(0)', 'db(4)' ]
  });
  songArray.push(defaultSong);

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
  logout: logout
};
