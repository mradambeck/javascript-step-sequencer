var db = require('../models');

// GET ALL songs (really only for admin/testing)
function index (req, res){
  db.Song.find(function(err, songs){
    if (err) { res.status(400).send({error: err}); }
    res.json(songs);
  });
}


// GET ONE song
function show (req, res){
  db.User.findOne({_id: req.params.userId}, function (err, foundUser){
    if (err) {
      console.error ('songsController, show err: ', err);
      return res.status(404).send({ error: err });
    }
    var songPath = foundUser.song;
    var specificSong = songPath.id(req.params.id);
    res.json(specificSong);
  });
}

function firstSong (req, res){
  // console.log("I am a callback");
  // res.sendStatus(418);
  db.User.findOne({_id: req.params.userId}, function (err, foundUser){
    if (err) {
      console.error ('songsController, firstSong err: ', err);
      return res.status(404).send({ error: err });
    }
    var firstSong = foundUser.songs;
    res.json(firstSong);
  });
}

// SAVE one song
function createSong (req, res){
  if (!req.user) {
    res.sendStatus(401);
  }
  // set the value of the user id
  var userId = req.params.userId;

  // store new song in memory with data from request body
  var newSong = new Song(req.body.song);

  // find user in db by id and add new song
  db.User.findOne({_id: userId}, function (err, foundUser) {
    foundUser.songs.push(newSong);
    foundUser.save(function (err, savedUser) {
      res.json(newSong);
    });
  });
}


// UPDATE a song
function updateSong (req, res) {
  if (!req.user) {
    res.sendStatus(401);
  }

  // set the value of the user and song ids
  var userId = req.params.userId;
  var songId = req.params.id;

  // find user in db by id
  db.User.findOne({_id: userId}, function (err, foundUser) {
    // find song embedded in user
    var foundSong = foundUser.songs.id(songId);
    // update song text and completed with data from request body
    foundSong.title = req.body.song.title;
    foundSong.pattern = req.body.song.pattern;
    foundSong.notes = req.body.song.notes;
    foundUser.save(function (err, savedUser) {
      res.json(foundSong);
    });
  });
}


// DELETE a users song
function deleteSong (req, res) {

  if (!req.user) {
    res.sendStatus(401);
  }

  // set the value of the user and song ids
  var userId = req.params.userId;
  var songId = req.params.id;

  // find user in db by id
  db.User.findOne({_id: userId}, function (err, foundUser) {
    // find song embedded in user
    var foundSong = foundUser.songs.id(songId);
    // remove song
    foundSong.remove();
    foundUser.save(function (err, savedUser) {
      res.json(foundSong);
    });
  });

}


// export public methods here
module.exports = {
  index: index,
  show: show,
  firstSong: firstSong,
  createSong: createSong,
  updateSong: updateSong,
  deleteSong: deleteSong
};
