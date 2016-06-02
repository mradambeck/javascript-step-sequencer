// user.js
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    Song = require('./song');

var UserSchema = new Schema({
  created: { type: Date, default: Date.now },
  username: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  songs: [ Song.schema ]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);
module.exports = User;
