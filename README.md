# Front End of the LCA Tool

Single Page Application for data visualization. We expect this page to be loaded in a CalRecycle web page iframe. 
This is an AngularJS app bootstrapped from [angular-seed](https://github.com/angular/angular-seed).
It communicates with the back end via the [web API](https://github.com/uo-lca/CalRecycleLCA/tree/master/vs/LCIAToolAPI).

## Getting Started

Install the dependencies...

### Prerequisites

* Node [http://nodejs.org/](http://nodejs.org/).
* Git - On Windows, it must installed with option to run from Windows command prompt (it must be added to PATH).
* Bower - After Node is installed, and git has been added to PATH, execute 
```
npm install -g bower
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

Npm has been configured to automatically run bower. In command prompt, cd to this directory and execute

```
npm install
```

*Note: On Ubuntu, if you see
```
npm WARN This failure might be due to the use of legacy binary "node"
```
then you need to install 
```
nodejs-legacy
```
before you can use npm to install this project's dependencies.*

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is to execute (from the FrontEnd directory):

```
npm start
```

Now browse to the app at `http://localhost:8000/app/index.html`.

NOTE: there may be firewall or other transport-level obstructions to npm's
automatic package retrieval.  Proposed fixes vary; one that has been shown
to work in some cases is to modify the local Git configuration to use https
by default:

```
git config --global url."https://".insteadOf git://
```

See also this issue report: https://github.com/bower/bower/issues/689

## Repository directory structure

* app/                --> all of the source files for the application
    * components/           --> shared modules (services and directives)
        * change-buttons        --> Directive containing buttons to Apply and Revert Changes
        * color-code            --> Maps categories to colors
        * d3                    --> d3 wrapper service
        * d3-tip                --> d3.tip service
        * format                --> Formatting service and filter
        * fragment-navigation   --> Service for keeping track of fragment navigation state
        * idmap                 --> Maps resource ID to resource
        * lcia-detail           --> LCIA bar chart directive, service, and css
        * modal                 --> template html and controller used with UI Bootstrap modal window service
        * models                --> Services providing models for resource data
        * name                  --> Resource name transformation service
        * param-grid            --> Param grid directive
        * reference-link/       --> Directive for displaying resource link reference (ILCD XML)
        * resources-mocks/      --> Mock resource data for unit tests
        * resources/            --> Web API resource service
        * sankey/               --> Sankey diagram service and directive   
        * selection/            --> Service for recalling selections during web app session
        * status/               --> Service for updating shared spinner and alert message
        * version/              --> version related components (came with angular-seed)
        * waterfall/            --> Directive, service, and css used to draw waterfall charts
    * fragment-lcia/        --> Fragment LCIA view and controller
    * fragment-sankey/      --> Fragment sankey view and controller
    * home/                 --> Main view and controller
    * lcia-method/          --> LCIA Method Detail view and controller
    * process-flow-param/   --> Process Flow Detail view and controller
    * process-instance/     --> Process Instance view and controller
    * process-lcia/         --> Process LCIA view and controller
    * scenario/             --> Scenario Editing view and controller
    * templates/            --> angular-bootstrap HTML templates
* karma.conf.js         --> config file for running unit tests with Karma
* e2e-tests/            --> end-to-end tests (not currently implemented)
* help/             --> Contains application Help files (see README in that folder)

## Testing

Unit tests have been created for almost all modules in this project. End to end tests have not yet been developed.

### Running Unit Tests

The app is preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The angular-seed app came with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests will be created under `e2e-tests`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this. Open a new window and run the following command in this directory.

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Start WebDriver by executing 

```
npm run start-webdriver
```

Once our web app and WebDriver web server are both running, open a new window and 
run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Updating Angular

Use package managers, npm and bower, to update dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.

## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The angular-seed project comes preconfigured with a local development webserver.  It is a node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.

## Production 

### Release build

Install dependencies using npm install.

Use grunt commandline interface to build. To install it globally, run the following command as Windows Adminstrator.

```
npm install -g grunt-cli
```

Command to concatenate and minify files:

```
grunt release
```

Result is in dist folder.


### How to Publish on Production Server


Copy the `dist/` folder to a web server host. In IIS, create a web app that points to the dist folder.

Edit `dist/config.js`.
Change `API_ROOT` setting to the base URI of the web API.
Change `HELP_ROOT` setting to the help web site URL. Currently, it is set to the wiki of the project's GitHub Pages.

Configure the web app to enable loading of application JSON files. In IIS, add MIME type extension: `.json`,  MIME type: `application/json`.

### Test

Test the deployed web app using protractor.  

Edit e2e-tests/protractor.conf.js and change the baseUrl setting
to the base URL of the deployed web app (Example: http://kbcalr.isber.ucsb.edu/app/dist/).

If you have not already done so, install and run WebDriver by executing the following commands in the FrontEnd directory.

```
npm run update-webdriver
npm run start-webdriver
```

Once our web app and WebDriver web server are both running, open a new window and 
run the end-to-end tests using the supplied npm script:

```
npm run protractor
```



