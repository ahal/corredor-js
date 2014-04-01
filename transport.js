var zmq = require('zmq');

function Socket(socketType, protocol, location, port) {
  if (['tcp', 'udp'].indexOf(protocol) >= 0 && typeof port === 'undefined') {
    throw new Error("Must specify port for %s connections!" % protocol);
  }

  this.address = protocol + '://' + location;
  if (typeof port !== 'undefined') {
    this.address = this.address + ':' + port;
  }

  this._socket = zmq.socket(socketType);
  this.actionMap = {};

  var _this = this; 
  this._socket.on('message', function(action, data) {
    console.log('Received action: ' + action + ', data: ' + data);
    if (action in _this.actionMap) {
      data = JSON.parse(data);
      _this.actionMap[action](data);
    }
  });
};

Socket.prototype.connect = function() {
  this._socket.connect(this.address);
}

Socket.prototype.send = function(data) {
  this._socket.send([data['action'], JSON.stringify(data)]);
}

Socket.prototype.close = function() {
  this._socket.close();
}


function ExclusivePair(protocol, location, port) {
  this.socket = new Socket('pair', protocol, location, port);
  this.socket.connect();
}

ExclusivePair.prototype.registerAction = function(action, callback) {
  this.socket.actionMap[action] = callback;
}

ExclusivePair.prototype.sendData = function(data) {
  this.socket.send(data);
}

function StreamPublisher(protocol, location, port) {
  this.socket = new Socket('pub', protocol, location, port);
  this.socket.connect();
}

StreamPublisher.prototype.bindStreamToAction = function(stream, action) {
  var oldWrite = stream.write;

  var _this = this;
  var newWrite = function(string, encoding, fd) {
    _this.socket.send({'action': action, 'message': string, 'encoding': encoding});
    //oldWrite(string, encoding, fd);
  }

  stream.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(stream, arguments);
      newWrite(string, encoding, fd);
    }
  })(stream.write);
}

module.exports = {
  ExclusivePair: ExclusivePair,
  StreamPublisher: StreamPublisher
};
