var helpers = require('./helpers');
var config = require('./config.json');
var rpio = helpers.isWindows(process.platform) ? helpers.rpioMock : require('rpio');
var cron = require('node-cron');

var initializePhaseTimeoutId = null;

function init() {
    cron.schedule(`${config.startTime.seconds} ${config.startTime.minutes} ${config.startTime.hour} * * *`, () => {
        cleanupTimer();
        start();
    });
    cron.schedule(`${config.endTime.seconds} ${config.endTime.minutes} ${config.endTime.hour} * * *`, () => {
        cleanupTimer();
        stop(true);
    });
    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    // Start the night light circuit immediately
    // for 10 minutes.  Allows for testing immediately to see it working.
    // Then set to state dictated by task times.  If task occurs during testing
    // that supersedes and takes over
    initializePhaseTimeoutId = setTimeout(() => {
        if (isNowBetweenTimes(config.endTime, config.startTime)) {
            stop(true);
        }
        initializePhaseTimeoutId = null;
    }, config.initializationTimeInMs);
    start(true);
}

function isNowBetweenTimes(startTime, endTime) {
    var nowDate = new Date();
    var startDate = new Date(nowDate.getTime());
    var endDate = new Date(nowDate.getTime());

    startDate.setHours(startTime.hour);
    startDate.setMinutes(startTime.minutes);
    startDate.setSeconds(startTime.seconds);

    endDate.setHours(endTime.hour);
    endDate.setMinutes(endTime.minutes);
    endDate.setSeconds(endTime.seconds);

    return nowDate >= startDate && nowDate < endDate;
}

function readLightSensor(pin) {
    var lightSensorVal = rpio.read(pin);
    rpio.write(config.nightLightPin, 
        lightSensorVal === rpio.LOW ? rpio.HIGH : rpio.LOW);
    printLighSensorReading(lightSensorVal);
}

function printLighSensorReading(lightSensorVal) {
    console.log(`Light sensor reading: ${lightSensorVal}`);
}

function start(shouldResetPin) {
    console.log('Turning on night light circuit');
    rpio.open(config.lightSensorPin, rpio.INPUT);
    rpio.open(config.nightLightPin, rpio.OUTPUT, shouldResetPin ? rpio.HIGH : undefined);
    readLightSensor(config.lightSensorPin);
    rpio.poll(config.lightSensorPin, readLightSensor);
}

function stop(shouldPreservePin) {
    console.log('Turning off night light circuit');
    rpio.write(config.nightLightPin, rpio.LOW);
    rpio.close(config.lightSensorPin);
    rpio.close(config.nightLightPin,
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

init();