var mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  "mongodb://localhost/javascript-step-sequencer"
);

// import models:

module.exports.Song = require("./song.js");
