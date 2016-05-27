////////////////////
//// filter.js ////
////////////////////

class FilterBank {
  constructor (config) {

    let filterValue = config.filterValue || 15000;
    let detune = config.detune || 1000;
    let q = config.q || 20;
    let connection = config.connection || amplifier.input;
    let delayValue = config.delayValue || 0.2;

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
