# BLE Receiver (Peripheral) Demo
Demo implementation of a Bluetooth BLE peripheral in NodeJS using the [Bleno library](https://github.com/noble/bleno "Bleno library"). This is the counterpart to my [Bluetooth Controller Demo](https://github.com/andypotato/ble-controller-demo "Bluetooth Controller Demo") and will output the incoming Bluetooth controller data to a websocket in JSON format for use with HTML5 / JavaScript Applications.

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
node bin/receiver -u <uuid> -c <controllerPort> -p <websocketPort>
```
- `uuid` is the 16-bit service identifier your peripheral will be  advertising, for example `F0BA`
- `controllerPort` is a number which identifies the ID of the connected controller (0, 1, 2, ...). In combination with the `uuid` this is helpful to create several non-conflicting receivers for multi-player environments
- `websocketPort` specifies which port the websocket server will run on

**Example:**
```
node bin/receiver -u F0BA -c 0 -p 1337
```
The console will output detailed log information about the connected devices and controller input. Try connecting your controller App now and you should see the console updating according to your controller input:

```
Starting Controller Client 0
UUID: F0BA
Websocket Port: 1337

+-----------+--------------+---------------------+
+ Bluetooth | Connected    | F0:BA:13:37:42:23   +
+-----------+--------------+---------------------+
+ Websocket | Disconnected |                     +
+-----------+--------------+---------------------+

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

The receiver process will start a local websocket server on the port you specified with the `-p` commandline parameter. Once you connect a websocket client the bluetooth input will be output via the websocket using the following JSOn format:

```
{
    "dpad": {
        "up": true,
        "down": false,
        "left": false,
        "right": false
    },
    "buttons": {
        "start": false,
        "select": false,
        "btn_a": true,
        "btn_b": false
    },
    "axis": {
        "x": -2,
        "y": 1,
        "z": 337
    },
    "port": 0
}
```

