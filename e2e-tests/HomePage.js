function HomePage () {
    this.scenarios = element.all(by.repeater("scenario in scenarios"));
    this.lciaMethods = element.all(by.repeater("method in lciaMethods"));
    this.infoMessages = element.all(by.css(".alert-info"));
    this.newButton = element(by.buttonText("New"));

    this.get = function (auth) {
        var path = "index.html#/home";
        if (auth) {
            path = path + "?" + auth;
        }
        browser.get(path);
    };
}

module.exports = HomePage;