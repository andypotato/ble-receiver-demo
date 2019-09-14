var util = require('util');
var bleno = require('bleno');
const DraftLog = require('draftlog').into(console);

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

    this.connStatus = {
      ble: { isConnected: false, address: '' },
      ws:  { isConnected: false, address: '' }
    };

    this.controllerStatus = {
      dpad:    { up: false, down: false, left: false, right: false },
      buttons: { start: false, select: false, btn_a: false, btn_b: false },
      axis:    { x: 0, y: 0, z: 0 }
    }

    this.consoleDrafts = {};
  }
  //----------------------------------------------------------------------------

  // initialization
  init() {

    // init bluetooth
    this.initBluetooth();

    // draw controller
    this.drawController();
    this.updateController();
  }

  initBluetooth() {

    // create services
    var cs = new ControllerService(this);

    // install services
    bleno.setServices([cs]);

    // setup peripheral
    bleno.on('stateChange', (state) => {
      if(state === 'poweredOn') {
        this.startAdvertising();
      } else {
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

    bleno.on('accept', (clientAddress) => {
      this.connStatus.ble.isConnected = true;
      this.connStatus.ble.address = clientAddress;
      this.updateController();
    });

    bleno.on('disconnect', (clientAddress) => {
      this.connStatus.ble.isConnected = false;
      this.connStatus.ble.address = '';
      this.updateController();
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

  // controller drawing
  drawController() {
    console.log('');
    console.log('+-----------+--------------+-------------------+');
    this.consoleDrafts['bleStatus'] = console.draft();
    console.log('+-----------+--------------+-------------------+');
    this.consoleDrafts['wsStatus'] = console.draft();
    console.log('+-----------+--------------+-------------------+');
    console.log('');
    console.log('+---------+--------------------------+');
    this.consoleDrafts['dpadStatus'] = console.draft();
    console.log('+---------+--------------------------+');
    this.consoleDrafts['btnStatus'] = console.draft();
    console.log('+---------+--------------------------+');
    console.log('');
    console.log('+---------+------+');
    this.consoleDrafts['pitchStatus'] = console.draft();
    console.log('+---------+------+');
    this.consoleDrafts['rollStatus'] = console.draft();
    console.log('+---------+------+');
    this.consoleDrafts['yawStatus'] = console.draft();
    console.log('+---------+------+');
    console.log('');
  }

  updateController() {

    var bleInfo = ['Bluetooth'];
    bleInfo.push(this.connStatus.ble.isConnected ? 'Connected   ' : 'Disconnected');
    bleInfo.push((this.connStatus.ble.isConnected ? this.connStatus.ble.address : ' ').padEnd(17));
    this.consoleDrafts['bleStatus']('+ ' + bleInfo.join(' | ') + ' +');

    var wsInfo = ['Websocket'];
    wsInfo.push(this.connStatus.ws.isConnected ? 'Connected   ' : 'Disconnected');
    wsInfo.push((this.connStatus.ws.isConnected ? this.connStatus.ws.address : ' ').padEnd(17));
    this.consoleDrafts['wsStatus']('+ ' + wsInfo.join(' | ') + ' +');

    var dpadInfo = [];
    if(this.controllerStatus['dpad']['up'])    { dpadInfo.push('UP'); }
    if(this.controllerStatus['dpad']['down'])  { dpadInfo.push('DOWN'); }
    if(this.controllerStatus['dpad']['left'])  { dpadInfo.push('LEFT'); }
    if(this.controllerStatus['dpad']['right']) { dpadInfo.push('RIGHT'); }
    this.consoleDrafts['dpadStatus']('+ D-Pad   | ' + dpadInfo.join(' ').padEnd(24) + ' |');

    var btnInfo = [];
    if(this.controllerStatus['buttons']['start'])  { btnInfo.push('START'); }
    if(this.controllerStatus['buttons']['select']) { btnInfo.push('SELECT'); }
    if(this.controllerStatus['buttons']['btn_a'])  { btnInfo.push('BTN_A'); }
    if(this.controllerStatus['buttons']['btn_b'])  { btnInfo.push('BTN_B'); }
    this.consoleDrafts['btnStatus']('+ Buttons | ' + btnInfo.join(' ').padEnd(24) + ' |');

    this.consoleDrafts['pitchStatus']('+ Pitch   | ' + (this.controllerStatus.axis.x + '').padEnd(4) + ' |');
     this.consoleDrafts['rollStatus']('+ Roll    | ' + (this.controllerStatus.axis.y + '').padEnd(4) + ' |');
      this.consoleDrafts['yawStatus']('+ Yaw     | ' + (this.controllerStatus.axis.z + '').padEnd(4) + ' |');
  }
  //----------------------------------------------------------------------------

  // callbacks
  onData(controllerData) {
    this.controllerStatus = controllerData;
    this.updateController();
  }
  //----------------------------------------------------------------------------
}

module.exports = ControllerClient;
