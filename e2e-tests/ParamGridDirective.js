function ParamGridDirective () {
    var ngGrid = null;

    this.gridOptions = ngGrid ? ngGrid.getAttribute("gridOptions") : null;
    this.renderedRows = ngGrid ? ngGrid.element.all(by.repeater("row in renderedRows")) : null;

    this.get = function (index) {
        ngGrid = element.all(by.css(".ngGrid")).get(index);
    };
}

module.exports = ParamGridDirective;