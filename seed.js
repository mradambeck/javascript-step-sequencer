var db = require("./models");

// var user_a = {
//   email: "a",
//   password: "a",
//   displayName: "Alan Perlis"
// };

var pattern = [
  {
    title: "Default Song",
    pattern: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    notes: ['x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)', 'x(0)']
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
