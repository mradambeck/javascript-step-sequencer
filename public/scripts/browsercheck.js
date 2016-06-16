// BROWSER CHECKS.

var isChromium = window.chrome,
  winNav = window.navigator,
  vendorName = winNav.vendor,
  isOpera = winNav.userAgent.indexOf("OPR") > -1,
  isIEedge = winNav.userAgent.indexOf("Edge") > -1,
  isIOSChrome = winNav.userAgent.match("CriOS");


if(isIOSChrome){
  alert("This app uses features from Javascript ES6, which are currently not supported in this browser. :( \n\nI'm reworking it to be compatible with all browsers, but in the meantime, please check it out on the desktop version of Chrome instead! I promise it's worth it.");
   // is Google Chrome on IOS
} else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
  console.log("It's Chrome!");
   // is Google Chrome
} else {
  alert("This app uses features from Javascript ES6, which are currently not supported in this browser. :( \n\nI'm reworking it to be compatible with all browsers, but in the meantime, please check it out on Chrome instead! I promise it's worth it.");
  console.error('Not Google Chrome. :(');
   // not Google Chrome
}
