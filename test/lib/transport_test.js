var Transport = require('../../lib/transport'),
    assert = require('chai').assert;

suite('SocketPattern', function() {
  var subject;

  setup(function() {
    subject = new Transport.SocketPattern('pub');
  });

  test('should set empty action map', function() {
    assert.typeOf(subject.actionMap, 'object');
    assert.lengthOf(Object.keys(subject.actionMap), 0);
  });

  test.skip('should setup socket that calls actions on messages', function() {
    // TODO
  });

  suite('#bind', function() {
    // TODO
  });

  suite('#connect', function() {
    // TODO
  });

  suite('#send', function() {
    // TODO
  });

  suite('#close', function() {
    // TODO
  });
});

suite('ExclusivePair', function() {
  suite('#registerAction', function() {
    // TODO
  });
});

suite('Publisher', function() {
  // TODO
});

suite('StreamPublisher', function() {
  suite('#bindStreamToAction', function() {
  });
});
