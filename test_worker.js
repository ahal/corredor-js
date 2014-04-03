/**
 * This is a dummy worker which shows how a marionette-js-runner host
 * could theoretically use corredor to run tests
 */

var strategy = require('./strategy');

var buildProfile = function() {
  // builds the profile
  return '/path/to/profile';
}


// Initialization/build first profile
var transport = new strategy.PingPong();

transport.registerAction('test_start', function(data) {
  var test = data['test'];
  console.log("Running test: " + test);

  // simulate running a test
  setTimeout(function() {
    console.log("ok.");
    // send test results back
    transport.sendData({'action': 'test_end', 'test': test, 'unexpected': false });
    // build next profile and wait for next test
    transport.sendData({'action': 'profile', 'profile': buildProfile()});
  }, 1000);
});

// kicks off the first test
transport.sendData({'action': 'profile', 'profile': buildProfile()});
