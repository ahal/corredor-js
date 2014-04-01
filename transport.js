var util = require('util'),
    zmq = require('zmq');


var Transport = function(protocol, location, port) {
  this._protocol = protocol;
  this._location = location;
  this._port = port;
};

Transport.prototype.connect = function() {
  if (['tcp', 'udp'].indexOf(this._protocol) >= 0 && typeof this._port === 'undefined') {
    throw new Error("Must specify port for %s connections!" % this._protocol);
  }

  var address = this._protocol + '://' this._location;

  if (typeof this._port !== 'undefined') {
    address = address + ':' + this._port;
  }

  this.socket.connect(address);
  this.socket.on('message', this.recv);
  this.address = address;
}

Transport.prototype.send = function(data) {
  this.socket.send([data['action'], JSON.stringify(data)]);
}

Transport.prototype.recv = function(action, data) {
  console.log('Received action: ' + action + ', data: ' + data);
  data = JSON.parse(data);
  if (action == 'fin') {
    process.exit()

}



var ExclusivePair = function(protocol, location, port) {
  Transport.call(this, protocol, location, port);

  this.socket = zmq.socket('pair');
  this.connect();
}
util.inherits(ExclusivePair, BaseTransport);
