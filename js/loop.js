/////////////////
//// loop.js ////
/////////////////

var bpm = 117,
    end = false;

class Loop {
  constructor (pattern) {
    if (pattern.length === 8) {
      this.pattern = pattern;
    } else {
      console.error('Pattern was the wrong length');
      this.pattern = [ gb2, db2, e2, gb2, e2, db2, b1, db2 ];
    }
    this.tempo = (1000 * 60 / bpm/ 2);
  }
}

///////////////////////////////////
/// everything below this sucks ///
///////////////////////////////////
Loop.prototype.startLoop = function () {
  function firstNote(){
    if (!end) {
      measure = this.pattern;
      playNote(measure[0]);
      window.setTimeout(secondNote, this.tempo);
    } else {
      return;
    }
  }

  function secondNote(){
    playNote(measure[1]);
    window.setTimeout(thirdNote, this.tempo);
  }

  function thirdNote(){
    playNote(measure[2]);
    window.setTimeout(fourthNote, this.tempo);
  }

  function fourthNote(){
    playNote(measure[3]);
    window.setTimeout(fifthNote, this.tempo);
  }

  function fifthNote(){
    playNote(measure[4]);
    window.setTimeout(sixthNote, this.tempo);
  }

  function sixthNote(){
    playNote(measure[5]);
    window.setTimeout(seventhNote, this.tempo);
  }

  function seventhNote(){
    playNote(measure[6]);
    window.setTimeout(eighthNote, this.tempo);
  }

  function eighthNote(){
    playNote(measure[7]);
    window.setTimeout(firstNote, this.tempo);
  }
  firstNote();
};

Loop.prototype.stopLoop = function() {
  end = true;
};

var loop = new Loop();
// => to initialize.js
