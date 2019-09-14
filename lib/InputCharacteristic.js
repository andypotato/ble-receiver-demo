var util = require('util');
var bleno = require('bleno');


//==============================================================================
// InputCharacteristic
//==============================================================================
var InputCharacteristic = function(controllerClient) {

  // store controller client reference
  this.controllerClient = controllerClient;

  // configure characteristic
  var charUUID = '1337',
      descUUID = '2901',
      desc     = 'Controller data port';

  bleno.Characteristic.call(this, {
    uuid: charUUID,
    properties: ['writeWithoutResponse'],
    descriptors: [
      new bleno.Descriptor({
        uuid: descUUID,
        value: desc
      })
    ]
  });
};

util.inherits(InputCharacteristic, bleno.Characteristic);

// handle write requests
InputCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

  // expects 32 bits (4 bytes) data packet:
  // ======================================
  //
  // Byte 1:           Byte 2:           Byte 3:           Byte 4:
  // Digital input     Analog input X    Analog input Y    Analog input Z
  // -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-
  // 0|0|0|0|0|0|0|0   0|0|0|0|0|0|0|0   0|0|0|0|0|0|0|0   0|0|0|0|0|0|0|0
  // -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-   -+-+-+-+-+-+-+-
  // 7 6 5 4 3 2 1 0   7 6 5 4 3 2 1 0   7 6 5 4 3 2 1 0   7 6 5 4 3 2 1 0
  //
  // Digital values:   Analog values (Byte 2 - 4):
  // ---------------   ---------------------------
  // 0: up             Signed CHAR values
  // 1: down           Range 0 to 255
  // 2: left           Positive: Counterclockwise rotation
  // 3: right          Negative: Clockwise rotation
  // 4: start
  // 5: select
  // 6: btn a
  // 7: btn b

  if(offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
    return;
  }
  else if(data.length != 4) {
    // payload is not 32 bit (4 byte) long
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    return;
  }

  // read the digital and analog values
  var byteBtn = data.readUInt8(0);
  var byteX = data.readUInt8(1);
  var byteY = data.readUInt8(2);
  var byteZ = data.readUInt8(3);

  var adj = 360 / 255;

  // convert the input data
  var controllerData = {
    dpad: {
      up:     ((byteBtn & (1 << 0)) > 0),
      down:   ((byteBtn & (1 << 1)) > 0),
      left:   ((byteBtn & (1 << 2)) > 0),
      right:  ((byteBtn & (1 << 3)) > 0)
    },
    buttons: {
      start:  ((byteBtn & (1 << 4)) > 0),
      select: ((byteBtn & (1 << 5)) > 0),
      btn_a:  ((byteBtn & (1 << 6)) > 0),
      btn_b:  ((byteBtn & (1 << 7)) > 0)
    },
    axis: {
      x: Math.round(byteX * adj - 180),
      y: Math.round(byteY * adj - 180),
      z: Math.round(byteZ * adj)
    }
  };

  // pass the data back to controller client
  this.controllerClient.onData(controllerData);

  if(!withoutResponse) {
    callback(this.RESULT_SUCCESS);
  }
}

module.exports = InputCharacteristic;
