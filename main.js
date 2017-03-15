var helpers = require('./helpers');
var rpio = helpers.isWindows(process.platform) ? helpers.rpioMock : require('rpio');
var cron = require('node-cron');

var lightSensorPin = 8;
var nightLightPin = 7;

function init() {
    rpio.open(lightSensorPin, rpio.INPUT);
    rpio.open(nightLightPin, rpio.OUTPUT);
    // Start the night light circuit at 9:30pm
    cron.schedule('30 21 * * *', start);
    // Stop the night light circuit at 6:30am
    cron.schedule('30 6 * * *', stop);
    // Start the night light circuit immediately
    // the tasks will put it back into the regular rhythm
    start();
}

function readLightSensor(pin) {
    var lightSensorVal = rpio.read(pin);
    rpio.write(nightLightPin, 
        lightSensorVal === rpio.LOW ? rpio.HIGH : rpio.LOW);
    printLighSensorReading(lightSensorVal);
}

function printLighSensorReading(lightSensorVal) {
    console.log(`Light sensor reading: ${lightSensorVal}`);
}

function start() {
    console.log('Turning on night light circuit');
    readLightSensor(lightSensorPin);
    rpio.poll(lightSensorPin, readLightSensor);
}

function stop() {
    console.log('Turning off night light circuit');
    rpio.write(nightLightPin, rpio.LOW);
    rpio.poll(lightSensorPin, null);
}

function cleanup() {
    rpio.poll(lightSensorPin, null);
    rpio.close(lightSensorPin);
    rpio.close(nightLightPin);
    process.exit();
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

init();