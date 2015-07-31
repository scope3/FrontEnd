function FragmentSankeyPage () {
    this.scenario = element(by.model("scenario"));
    this.sankeyDiagram = element(by.css('sankey-diagram'));
    this.legendRows = element.all(by.css('.legend-row'));

    this.get = function () {
        browser.get("index.html#/home/fragment-sankey");
    };
}

module.exports = FragmentSankeyPage;