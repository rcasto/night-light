# night-light
A little night light circuit powered by a Raspberry Pi.  This night light will turn "on" during a certain part of the day that you configure.
When it is in this "on" state the LED's are not necessarily on unless the light level around the night light is sufficiently low

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
