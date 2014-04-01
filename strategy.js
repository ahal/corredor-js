var transport = require('./transport'),
    zmq = require('zmq');


var PingPong = function() {
  this.output = new transport.StreamPublisher('ipc', '/tmp/corredor_worker_output');
  this.output.bindStreamToAction(process.stdout, 'stdout');
  this.output.bindStreamToAction(process.stderr, 'stderr');

  this.master = new transport.ExclusivePair('ipc', '/tmp/corredor_exclusivepair');
  var _this = this;
  this.master.registerAction('test_start', function(data) {
    var test = data['test'];
    console.log("Running test: " + test);

    // simulate running a test
    setTimeout(function() {
      console.log("ok.");
      _this.master.sendData({'action': 'test_end', 'test': test, 'unexpected': false });
    }, 1000);
  });

  this.master.registerAction('fin', function(data) {
    _this.master.socket.close();
    process.exit(0);
  });
};

PingPong.prototype.start = function() {
  this.master.sendData({'action': 'ready'});
}

module.exports.PingPong = PingPong;
