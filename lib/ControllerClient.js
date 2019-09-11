var util = require('util');
var bleno = require('bleno');

var ControllerService = require('./ControllerService');


//==============================================================================
// ControllerClient
//==============================================================================
class ControllerClient {

  // construction
  constructor(uuid, portNum) {

    this.serviceUUID = uuid;
    this.portNum = portNum;

    // set a nice name for the controller
    this.peripheralName = 'Game Controller ' + portNum;
  }
  //----------------------------------------------------------------------------

  // initialization
  init() {

    console.info("Initializing peripheral:", this.peripheralName);

    // init bluetooth
    this.initBluetooth();
  }

  initBluetooth() {

    // create services
    var cs = new ControllerService(this);

    // install services
    bleno.setServices([cs]);

    // setup peripheral
    bleno.on('stateChange', (state) => {
      if(state === 'poweredOn') {
        console.log("Peripheral powered on");
        this.startAdvertising();
      } else {
        console.log("Peripheral powered off");
        bleno.stopAdvertising();
      }
    });

    bleno.on('advertisingStart', (err) => {

      if(err) {

        // check the error
        if(err.message == "Command Disallowed") {
          console.log("Advertising already started");
        } else {
          console.log("Failed to start advertising");
          console.log(err);
        }

      } else {

        // we're good
        console.log('Controller is advertising');
      }
    });

    bleno.on('accept', function(clientAddress) {
      console.log('Accepted client:', clientAddress);
    });

    bleno.on('disconnect', function(clientAddress) {
      console.log('Disconnected client:', clientAddress);
    });
  }
  //----------------------------------------------------------------------------

  // bluetooth methods
  startAdvertising() {
    bleno.startAdvertising(this.peripheralName, [this.serviceUUID]);
  }

  stopAdvertising() {
    bleno.disconnect();
    bleno.stopAdvertising();
  }

  disconnectController() {
    bleno.disconnect();
  }
  //----------------------------------------------------------------------------

  // callbacks
  onData(controllerData) {
    console.log(controllerData);
  }
  //----------------------------------------------------------------------------
}

module.exports = ControllerClient;
