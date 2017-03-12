var rpio = require('rpio');

var pin = 8;

function init() {
    rpio.open(pin, rpio.INPUT);
}

function readLightSensor() {
    var lightSensorVal = rpio.read(pin);
    console.log(`Light sensor reading: ${lightSensorVal}`);
}

function cleanup() {
    rpio.poll(pin, null);
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

init();
rpio.poll(pin, readLightSensor);