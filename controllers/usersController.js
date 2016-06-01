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

  var newSong = new db.Song({
    title: "New Song",
    pattern: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    notes: [ 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)' ]
  });

  var newUser = new db.User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.pasword,
    songs: newSong
  });

  newUser.save(function handleSave(err, data){
    if (err){
      console.error('handleSave err: ', err);
      return res.status(400).send({error: err});
    }
    res.redirect('/users/' + data._id);
  });  
}



// export public methods here
module.exports = {
  index: index,
  createUser: createUser
};
