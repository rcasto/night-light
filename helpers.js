var windowsRegex = /^win/;
var rpioMock = {
    read: (pin) => {
        console.log(`Read from pin ${pin}`);
        return Math.random() >= 0.5 ? rpio.HIGH : rpio.LOW; 
    },
    write: (pin, voltage) => {
        console.log(`Wrote ${getVoltageString(voltage)} to pin ${pin}`);
    },
    open: (pin, mode, voltage) => {
        console.log(`Pin ${pin} open in ${mode} mode with initial voltage ${getVoltageString(voltage)}`);
    },
    close: (pin) => {
        console.log(`Pin ${pin} has been closed`);
    },
    poll: (pin, handle) => {
        console.log(`Polling pin ${pin}`);
        this.pollHandle = handle;
        if (this.pollHandle) {
            setTimeout(() => this.pollHandle, 1000);
        }
    },
    pollHandle: null,
    HIGH: 1,
    LOW: 0,
    OUTPUT: 'output'
};

function getVoltageString(voltage) {
    return voltage > 0 ? 'HIGH' : 'LOW';
}

function isWindows(platform) {
    return windowsRegex.test(platform);
}

module.exports = {
    rpioMock,
    isWindows
};