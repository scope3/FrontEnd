exports.config = {
  //allScriptsTimeout: 11000,
  // The address of a running selenium server.
  seleniumAddress: "http://localhost:4444/wd/hub",
  
  params: {
    auth: "auth=4e49337"
  },

  specs: [
    "test_*.js"
  ],

  suites: {
    cp: "test_CompositionProfiles.js",
    home: "test_Home.js",
    fragment: "test_Fragment*.js",
    lc: "test_LciaComparison.js",
    scenario: "test_Scenario*.js"
  },

  capabilities: {
    "browserName": "firefox",
    //"browserName": "internet explorer", no good support for this browser
    "chromeOptions": {"args": ["--disable-extensions"]}
  },

  //multiCapabilities: [{
  //  "browserName": "firefox"
  //}, {
  //  "browserName": "chrome"
  //}],

  //baseUrl: "http://localhost:8000/app/",
  baseUrl: "http://localhost:8000/dist/",
  //baseUrl: "http://uo-lca.github.io/dist/",
  //baseUrl: "http://publictest.calrecycle.ca.gov/LCAToolFrontEnd/",
  framework: "jasmine2",

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
