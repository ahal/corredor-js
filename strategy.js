var util = require('util'),
    zmq = require('zmq');

var BaseStrategy = function() {};
BaseStrategy.prototype.execute = function() {
  throw new Error('BaseStrategy#execute needs to be overriden');
}


var PingPong = function() {
  BaseStrategy.call(this);
};
util.inherits(PingPong, BaseStrategy);
PingPong.prototype = Object.create(BaseStrategy.prototype);
