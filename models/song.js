// song.js
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  pattern: Array,
  notes: Array
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;