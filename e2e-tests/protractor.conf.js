exports.config = {
  //allScriptsTimeout: 11000,
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'test_scenarios.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {'args': ['--disable-extensions']}
  },

  baseUrl: 'http://localhost:8000/app/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};
