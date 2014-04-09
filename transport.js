var util = require('util'),
    zmq = require('zmq');

function SocketPattern(socketType) {
  this.socket = zmq.socket(socketType);
  this.actionMap = {};

  var self = this;
  this.socket.on('message', function(action, data) {
    //console.log('JS: received action: ' + action + ', data: ' + data);
    if (action in self.actionMap) {
      data = JSON.parse(data);
      self.actionMap[action](data);
    }
  });
};

SocketPattern.prototype.bind = function(address) {
  this.socket.bind(address);
  this.address = address;
}

SocketPattern.prototype.connect = function(address) {
  this.socket.connect(address);
  this.address = address;
}

SocketPattern.prototype.send = function(data) {
  this.socket.send([data['action'], JSON.stringify(data)]);
}

SocketPattern.prototype.close = function() {
  this.socket.close();
}


function ExclusivePair() {
  SocketPattern.call(this, 'pair');
}
util.inherits(ExclusivePair, SocketPattern);

ExclusivePair.prototype.registerAction = function(action, callback) {
  this.actionMap[action] = callback;
}

ExclusivePair.prototype.close = function() {
  this.socket.close();
}


function Publisher() {
  SocketPattern.call(this, 'pub');
}
util.inherits(Publisher, SocketPattern);


function StreamPublisher() {
  SocketPattern.call(this, 'pub');
}
util.inherits(StreamPublisher, SocketPattern);

StreamPublisher.prototype.bindStreamToAction = function(stream, action) {
  var oldWrite = stream.write;

  var _this = this;
  var newWrite = function(string, encoding, fd) {
    _this.socket.send({'action': action, 'message': string, 'encoding': encoding});
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
  Publisher: Publisher,
  StreamPublisher: StreamPublisher
};
