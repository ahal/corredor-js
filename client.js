var zmq = require('zmq');

var pub = zmq.socket('pub');
pub.connect('ipc:///tmp/corredor_worker_output');

var master = zmq.socket('pair');
master.connect('ipc:///tmp/corredor_exclusivepair');
console.log('connected');
master.send(['ready', JSON.stringify({})]);
console.log('sent ready');

master.on('message', function(action, data) {
  console.log('Received action: ' + action + ', data: ' + data);
  data = JSON.parse(data);
  if (action == 'fin') {
    pub.close()
    process.exit();
  }
  var result = {"action": "test_end", "result": data["test"] + " passed."};
  master.send(["test_end", JSON.stringify(result)]);
});

var i = 0;
var interval = setInterval(function() {
  i++;
  console.log('generating output ' + i);
  var action = "stdout";
  data = {"action": action, "message": "foo" + i};
  pub.send([action, JSON.stringify(data)]);

  var action = "stderr";
  data = {"action": action, "message": "bar" + i};
  pub.send([action, JSON.stringify(data)]);

  var action = "irrelevant";
  data = {"action": action, "message": "baz" + i};
  pub.send([action, JSON.stringify(data)]);
}, 100);
