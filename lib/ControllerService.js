var util = require('util');
var bleno = require('bleno');

var InputCharacteristic = require('./InputCharacteristic');


//==============================================================================
// ControllerService
//==============================================================================
function ControllerService(controllerClient) {
  bleno.PrimaryService.call(this, {
    uuid: controllerClient.serviceUUID,
    characteristics: [
      new InputCharacteristic(controllerClient)
    ]
  });
}

util.inherits(ControllerService, bleno.PrimaryService);

module.exports = ControllerService;

