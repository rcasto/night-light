var rpio = require('rpio');
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = [new schedule.Range(21, 7)];

var lightSensorPin = 8;
var nightLightPin = 7;

function init() {
    rpio.open(lightSensorPin, rpio.INPUT);
    rpio.open(nightLightPin, rpio.OUTPUT);

    schedule.scheduleJob(rule, () => {
        readLightSensor(lightSensorPin);
        rpio.poll(lightSensorPin, readLightSensor);
    });
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

function cleanup() {
    rpio.poll(lightSensorPin, null);
    rpio.close(lightSensorPin);
    rpio.close(nightLightPin);
    process.exit();
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

init();