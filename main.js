var helpers = require('./helpers');
var rpio = helpers.isWindows(process.platform) ? helpers.rpioMock : require('rpio');
var cron = require('node-cron');

var lightSensorPin = 8;
var nightLightPin = 7;

var initializationPhaseTime = 1 * 60 * 1000; // 10 minutes
var initializePhaseTimeoutId = null;

// Start the night light circuit at 9:30pm
var startTime = {
    hour: 21,
    minutes: 30
};
// Stop the night light circuit at 6:30am
var endTime = {
    hour: 6,
    minutes: 30
};

function init() {
    cron.schedule(`${startTime.minutes} ${startTime.hour} * * *`, start);
    cron.schedule(`${endTime.minutes} ${endTime.hour} * * *`, () => stop(true));
    // Start the night light circuit immediately
    // for 10 minutes.  Allows for testing immediately to see it working.
    // Then set to state dictated by task times.  If task occurs during testing
    // that supersedes and takes over
    initializePhaseTimeoutId = setTimeout(() => {
        if (isNowBetweenTimes(endTime, startTime)) {
            stop(true);
        }
    }, initializationPhaseTime);
    start();
}

function isNowBetweenTimes(startTime, endTime) {
    var nowDate = new Date();
    var startDate = new Date(nowDate.getTime());
    var endDate = new Date(nowDate.getTime());

    startDate.setHours(startTime.hour);
    startDate.setMinutes(startTime.minutes);

    endDate.setHours(endTime.hour);
    endDate.setMinutes(endTime.minutes);

    return nowDate >= startDate && nowDate < endDate;
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
    rpio.open(lightSensorPin, rpio.INPUT);
    rpio.open(nightLightPin, rpio.OUTPUT);
    readLightSensor(lightSensorPin);
    rpio.poll(lightSensorPin, readLightSensor);
}

function stop(shouldPreservePin) {
    console.log('Turning off night light circuit');
    rpio.write(nightLightPin, rpio.LOW);
    rpio.close(lightSensorPin);
    rpio.close(nightLightPin,
        shouldPreservePin ? rpio.PIN_PRESERVE : rpio.PIN_RESET);
}

function cleanupTimer() {
    if (initializePhaseTimeoutId) {
        clearTimeout(initializePhaseTimeoutId);
    }
    initializePhaseTimeoutId = null;
}

function cleanup() {
    stop(false);
    cleanupTimer();
    process.exit();
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

init();