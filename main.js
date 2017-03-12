var rpio = require('rpio');

var lightSensorPin = 8;
var nightLightPin = 7;

function init() {
    rpio.open(lightSensorPin, rpio.INPUT);
    rpio.open(nightLightPin, rpio.OUTPUT);
    
    readLightSensor(lightSensorPin);
    rpio.poll(lightSensorPin, readLightSensor);
}

function readLightSensor(pin) {
    var lightSensorVal = rpio.read(pin);
    rpio.write(nightLightPin, lightSensorVal === rpio.LOW ? rpio.HIGH : rpio.LOW);
    console.log(`Light sensor reading: ${lightSensorVal}`);
}

function cleanup() {
    rpio.poll(lightSensorPin, null);
    rpio.close(lightSensorPin);
    rpio.close(nightLightPin);
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

init();