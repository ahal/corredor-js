var strategy = require('./strategy');

testTransport = new strategy.PingPong();
testTransport.start()
