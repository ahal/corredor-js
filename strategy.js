var transport = require('./transport'),
    zmq = require('zmq');


var PingPong = function() {
  this.output = new transport.StreamPublisher('ipc', '/tmp/corredor_worker_output');
  this.output.bindStreamToAction(process.stdout, 'stdout');
  this.output.bindStreamToAction(process.stderr, 'stderr');

  this.master = new transport.ExclusivePair('ipc', '/tmp/corredor_exclusivepair');
  var _this = this;
  this.master.registerAction('fin', function(data) {
    _this.master.socket.close();
    process.exit(0);
  });
};

PingPong.prototype.registerAction = function(action, callback) {
  this.master.socket.actionMap[action] = callback;
}

PingPong.prototype.sendData = function(data) {
  this.master.socket.send(data);
}

module.exports.PingPong = PingPong;
