// delay.js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
delay(2000).then(() => process.exit(0));  // 2000 milliseconds = 2 seconds
