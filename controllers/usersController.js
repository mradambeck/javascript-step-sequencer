var db = require('../models');

// GET ALL users

function index (req, res){
  db.User.find(function(err, users){
    if (err) {
      res.status(400).send({error: err});
      console.error("index error: " + err);
    }
    res.json(users);
  });
}



function createUser (req, res){

  var songArray = [];
  var defaultSong = new db.Song({
    title: "New Song",
    pattern: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    notes: [ 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)' ]
  });

  songArray.push(defaultSong);

  db.User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken, try logging in' });
    }
    var newUser = new db.User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      songs: songArray
    });
    newUser.save(function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      // res.send({ token: auth.createJWT(result) });
      res.redirect('/users/', result.id);
    });
  });

}



// export public methods here
module.exports = {
  index: index,
  createUser: createUser
};
