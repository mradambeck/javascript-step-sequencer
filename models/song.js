// song.js
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: String,
  pattern: Array,
  notes: Array,
  bpm: Number,
  filterValue: Number,
  waveform: String,
  duration: Number
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;
