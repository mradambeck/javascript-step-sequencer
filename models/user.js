// user.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Song = require('./song');

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  password: String,
  songs: [ Song.schema ]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
