////////////////////
//// filter.js ////
////////////////////

class FilterBank {
  constructor (config) {

    let filterValue = config.filterValue || null;
    let detune = config.detune || null;
    let q = config.q || null;
    let connection = config.connection || null;
    let delayValue = config.delayValue || null;

    // Biquad Filter
    let bq = this.biquadFilter = context.createBiquadFilter();
    bq.frequency.value = filterValue;
    bq.detune.value = detune;
    bq.Q.value = q;

    // Delay
    let delay = this.delay = context.createDelay();
    delay.delayTime.value = delayValue;

    // Send Delay and Reverb through a sidechain
    let sideChainVolume = this.sideChainVolume = context.createGain();
    sideChainVolume.gain.value = 0.1;


    // Connections
    bq.connect(delay);
    delay.connect(sideChainVolume);
    sideChainVolume.connect(connection);
    bq.connect(connection);

  }
}

// => to amplifier.js
