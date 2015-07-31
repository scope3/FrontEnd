function CompositionProfilesPage () {
    this.flow = element(by.model("flow"));
    this.referenceFlowPropertyName = element(by.binding("referenceFlowProperty.name"));
    this.referenceUnit = element(by.binding("referenceFlowProperty.referenceUnit"));
    this.scenario = element(by.model("scenario"));

    this.get = function () {
        browser.get("index.html#/home/composition-profiles");
    };
}

module.exports = CompositionProfilesPage;