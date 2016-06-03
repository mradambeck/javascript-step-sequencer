var mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI ||
  process.env.MONGOHQ_URL ||
  "mongodb://localhost/javascript-step-sequencer"
);

// import models:

module.exports.Song = require("./song.js");
module.exports.User = require("./user.js");
