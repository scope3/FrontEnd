exports.config = {
  //allScriptsTimeout: 11000,
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'test_*.js'
  ],

  suites: {
    anon: 'test_anon.js',
    auth: 'test_auth.js',
    cp: 'test_CompositionProfiles.js'
  },

  capabilities: {
    'browserName': 'firefox',
    'chromeOptions': {'args': ['--disable-extensions']}
  },

  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],

  baseUrl: 'http://localhost:8000/app/',
  //baseUrl: 'http://uo-lca.github.io/dist/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
