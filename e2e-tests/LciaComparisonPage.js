function LciaComparisonPage () {
    this.exportButton = element(by.id("export-lcia-results"));
    this.grid = element(by.id("selection-grid"));
    this.gridRows = this.grid.all(by.repeater("row in renderedRows"));
    this.removeRowButtons = this.gridRows.all(by.css("button"));
    this.selection = {
        type : element(by.model("selection.type")),
        fragment : element(by.model("selection.fragment")),
        process : element(by.model("selection.process")),
        scenario : element(by.model("selection.scenario")),
        activityLevel : element(by.model("selection.activityLevel")),
        chartLabel : element(by.model("selection.chartLabel")),
        addButton : element(by.css("form button"))
    };
    this.methodCols = element.all(by.repeater("method in lciaMethods"));
    this.charts = element.all(by.css(".chart-group"));
    this.bars = this.charts.all(by.css(".bar.g"));

    this.get = function () {
        browser.get("index.html#/home/lcia-comparison");
    };
}

module.exports = LciaComparisonPage;