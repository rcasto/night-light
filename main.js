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
    var buffer = Buffer.alloc(100);
    rpio.readbuf(pin, buffer);
    buffer.forEach((entry) => console.log('Buffer read:', entry));

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