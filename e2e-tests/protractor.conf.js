exports.config = {
  //allScriptsTimeout: 11000,
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'test_*.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {'args': ['--disable-extensions']}
  },

  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],

  baseUrl: 'http://localhost:8000/app/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
