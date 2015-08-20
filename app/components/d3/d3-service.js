/**
 * @ngdoc service
 * @module d3
 * @name d3Service
 * @memberOf d3
 * @description
 * Factory service. Wraps bower component, d3, in an angular service so that dependencies will be more apparent.
 * d3 has functions that are useful in all kinds of app modules, not just graphic directives.
 */
angular.module('d3', [])
    .factory('d3Service', [function(){
        /*
         * d3 may include a text wrapping function in the future. Until then, adding function from d3 example for wrapping
         * long axis labels.
         */

        /* globals d3 */

        function textWrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", 0);
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).text(word);
                        ++lineNumber;
                    }
                }
                if (lineNumber > 0) {
                    text.selectAll("tspan").attr("dy", function (d, i) {
                        return i * lineHeight - dy + "em";
                    });
                }
            });
        }

        if (!d3.hasOwnProperty("textWrap")) d3.textWrap = textWrap;

        return d3;
    }]);
