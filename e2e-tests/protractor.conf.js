exports.config = {
  //allScriptsTimeout: 11000,
  // The address of a running selenium server.
  seleniumAddress: "http://localhost:4444/wd/hub",
  
  params: {
    auth: "auth=bwTest"
  },

  specs: [
    "test_*.js"
  ],

  suites: {
    cp: "test_CompositionProfiles.js",
    home: "test_Home.js",
    fragment: "test_Fragment*.js",
    scenario: "test_Scenario*.js"
  },

  capabilities: {
    "browserName": "firefox",
    "chromeOptions": {"args": ["--disable-extensions"]}
  },

  //multiCapabilities: [{
  //  "browserName": "firefox"
  //}, {
  //  "browserName": "chrome"
  //}],

  baseUrl: "http://localhost:8000/app/",
  //baseUrl: "http://uo-lca.github.io/dist/",

  framework: "jasmine2",

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
