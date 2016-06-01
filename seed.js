var db = require("./models");

// var user_a = {
//   email: "a",
//   password: "a",
//   displayName: "Alan Perlis"
// };

var pattern = [
  {
    title: "Default Song",
    pattern: [ 261.626, 0, 293.665, 0, 261.626, 0, 293.665, 0 ],
    notes: ['c(4)', 'x(0)', 'd(4)', 'x(0)', 'c(4)', 'x(0)', 'd(4)', 'x(0)']
  }
];

// remove all records that match {} -- which means remove ALL records
db.Song.remove({}, function(err, songs){
  if(err) {
    console.log('Error occurred in remove', err);
  } else {
    console.log('removed all songs');

    // create new records based on the array books_list
    db.Song.create(pattern, function(err, songs){
      if (err) { return console.log('err', err); }
      console.log("created", pattern.length, "songs");
      process.exit();
    });
  }
});
