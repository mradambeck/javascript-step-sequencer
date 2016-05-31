// Allows you to dynamically generate octaves of base notes.

function Note() {
  this.pitches = {
    c: 32.70325, db: 34.647875, d: 36.708125, eb: 38.890875, e: 41.2035, f: 43.6535,
    gb: 46.24925, g: 48.999375, ab: 51.913125, a: 55, bb: 58.2705, b: 61.735375, x: 0
  }; // x is silence

  this.makePitch = function(note) {
    return function(octave) {
      if (octave === 0){
        return note / 2;
      } else if (octave === 1) {
        return note;
      } else {

        // function avail to created functions:
        let octaveMaker = function(note, octave){
          octave = octave - 1;
          for (var i = 0; i < octave; i ++){
            note = note * 2;
          }
          return note;
        };
        return octaveMaker(note, octave);
      }
    };
  };

  this.c = this.makePitch(this.pitches.c);
  this.db = this.makePitch(this.pitches.db);
  this.d = this.makePitch(this.pitches.d);
  this.eb = this.makePitch(this.pitches.eb);
  this.e = this.makePitch(this.pitches.e);
  this.f = this.makePitch(this.pitches.f);
  this.gb = this.makePitch(this.pitches.gb);
  this.g = this.makePitch(this.pitches.g);
  this.ab = this.makePitch(this.pitches.ab);
  this.a = this.makePitch(this.pitches.a);
  this.bb = this.makePitch(this.pitches.bb);
  this.b = this.makePitch(this.pitches.b);
  this.x = this.makePitch(this.pitches.x);
}
