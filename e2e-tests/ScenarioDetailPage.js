function ScenarioDetailPage () {
    this.name = element(by.binding("scenario.name"));
    this.fragmentName = element(by.binding("fragment.name"));
    this.activityLevel = element(by.binding("scenario.activityLevel"));
    this.referenceFlowName = element(by.binding("referenceFlow.name"));
    this.referenceUnit = element(by.binding("unit"));
    this.description = element(by.binding("scenario.description"));

    this.get = function (scenarioID) {
        var path = "index.html#/home/scenario/";
        path += scenarioID ? scenarioID : 1;
        browser.get(path);
    };
}

module.exports = ScenarioDetailPage;