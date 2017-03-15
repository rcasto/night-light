var rpio = require('rpio');
var schedule = require('node-schedule');

var startHour = 21;  // 9pm
var endHour = 7;     // 7am
var lightSensorPin = 8;
var nightLightPin = 7;

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)]; // every day of the week
rule.hour = [new schedule.Range(startHour, endHour)];

function init() {
    rpio.open(lightSensorPin, rpio.INPUT);
    rpio.open(nightLightPin, rpio.OUTPUT);

    schedule.scheduleJob(rule, () => {
        readLightSensor(lightSensorPin);
        rpio.poll(lightSensorPin, readLightSensor);
    }).on('run', () => {
        var now = new Date(Date.now);
        if (now.getHours() < startHour && now.getHours() >= endHour) {
            reset();
        }
    });
    
    reset();
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

function reset() {
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