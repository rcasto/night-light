# night-light
A little night light circuit powered by a Raspberry Pi.  This night light will turn "on" during a certain part of the day that you configure.
When it is in this "on" state the LED's are not necessarily on unless the light level around the night light is sufficiently low as dictated by the light sensor.

## Getting Started
#### Things you'll Need
##### Software
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)

##### Hardware
* Photoresistor
  * Or some other light sensor
* LED's
* [Raspberry Pi](https://www.raspberrypi.org/products/)
* [AC to 5V DC Power Supply](https://www.amazon.com/gp/product/B0140K8AXE/)

#### Up and Running
* Clone the directory somewhere on your computer using the command:
  * `git clone https://github.com/rcasto/night-light`
* `cd` to the cloned repository and run the following command at the root to install the necessary dependencies:
  * `npm install`
* Start the night light circuit by then running the command:
  * `npm start`
* You got yourself a new night light

## Default Configuration
The default configuration of the night light is driven by the **config.json** file which starts out with the following values:
```json
{
    "lightSensorPin": 8,
    "nightLightPin": 7,
    "initializationTimeInMs": 600000, // 10 minutes
    "startTime": {
        "hour": 21,
        "minutes": 30,
        "seconds": 0
    },
    "endTime": {
        "hour": 6,
        "minutes": 30,
        "seconds": 0
    }
}
```
**lightSensorPin** - This is the pin the Raspberry Pi will read from to determine the light level (HIGH or LOW).  HIGH = there is a high light level, LOW = there is a low light level.

**nightLightPin** - This is the pin the Raspberry Pi will write to, to turn on the night light.  When the light level is low the output will be HIGH, when the light level is high the output will be LOW.

**initializationTimeInMs** - This is the amount of time that the night light circuit will remain in the initialization phase.  During this phase the night light circuit is on no matter whether it should be or not.  After this phase the night light circuit will return to the state it should be at that time.  It's mainly used for initial testing/seeing if it works.

**startTime** - Object containing hour, minutes, and seconds.  This object defines the time the night light circuit should turn "on".  By "on" it is reading from the lightSensor to determine whether the night light should be on or not.

**endTime** - Object containing hour, minutes, and seconds.  This object defines the time the night light circuit should turn off.  At this point in time it is no longer reading from the light sensor.
