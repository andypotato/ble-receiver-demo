
# BLE Receiver (Peripheral) Demo
Demo implementation of a Bluetooth BLE peripheral in NodeJS using the [Bleno library](https://github.com/noble/bleno "Bleno library"). This is the counterpart to my [Bluetooth Controller Demo](https://github.com/andypotato/ble-controller-demo "Bluetooth Controller Demo") and will convert the incoming Bluetooth controller data to a Websocket for use with HTML5 / JavaScript Applications.

This project is part of a [tutorial on using Bluetooth Controllers with HTML5 / JavaScript applications](https://medium.com/@andreas.schallwig "tutorial on using Bluetooth Controllers with HTML5 / JavaScript applications").

## Usage

> Note: This demo currently **does NOT run on macOS** due to an issue with the bleno library. Also if you're running this **on a Raspberry Pi 3 you need to use Node 8.x** as the project's native bindings won't compile on newer Node versions.

### Bluetooth

Before using this demo make sure to read the [Bleno documentation](https://github.com/noble/bleno) and follow the instructions on how to make this library work with your Bluetooth adapter on your OS. If you're **on Windows don't try to use the build-in adapter** of your system but get a cheap USB dongle instead.

Once you have your Bluetooth adapter working continue with the following steps:

- Clone or download the repository
- Install all dependencies using `npm i`

Afterwards you can run the receiver using:
```
node bin/receiver -u <uuid> -p <port>
```
- `uuid` is the 16-bit service identifier your peripheral will be  advertising, for example `F0BA`
- `port` is a number which identifies the ID of the connected controller (0, 1, 2, ...). In combination with the `uuid` this is helpful to create several non-conflicting receivers for multi-player environments

**Example:**
```
node bin/receiver -u F0BA -p 0
```
The console will output detailed log information about the connected devices and controller input. Try connecting your controller App now and you should see the console updating according to your controller input:

```
Starting Controller Client
UUID: F0BA
Port: 0

+-----------+--------------+-------------------+
+ Bluetooth | Connected    | F0:BA:13:37:42:23 +
+-----------+--------------+-------------------+
+ Websocket | Disconnected |                   +
+-----------+--------------+-------------------+

+---------+--------------------------+
+ D-Pad   | UP LEFT                  |
+---------+--------------------------+
+ Buttons | START BTN_A              |
+---------+--------------------------+

+---------+------+
+ Pitch   | 2    |
+---------+------+
+ Roll    | -42  |
+---------+------+
+ Yaw     | 20   |
+---------+------+

Controller is advertising
```
### Websocket

tbw.
