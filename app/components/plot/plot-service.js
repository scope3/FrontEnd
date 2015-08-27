/**
* @ngdoc service
* @module lcaApp.plot.service
* @name PlotService
* @description
* Factory Service. Creates objects used in plot directive.
*/
angular.module('lcaApp.plot.service', ['d3'])
    .factory('PlotService', [ 'd3Service', function(d3Service) {

        function Instance() {
            var obj = {},
                content = null,
                x = null,
                y = null,
                margin = null,
                resizeSvg = true;

            obj.content = function (_) {
                if (!arguments.length) return content;
                content = _;
                return obj;
            };

            obj.x = function (_) {
                if (!arguments.length) return x;
                x = _;
                return obj;
            };

            obj.y = function (_) {
                if (!arguments.length) return y;
                y = _;
                return obj;
            };

            obj.margin = function (_) {
                if (!arguments.length) return margin;
                margin = _;
                return obj;
            };

            obj.resizeSvg = function (_) {
                if (!arguments.length) return resizeSvg;
                resizeSvg = _;
                return obj;
            };

            return obj;
        }

        function Axis() {
            var axis = {},
                orientation = "left",
                addLine = true,
                offset = 50;

            axis.orientation = function (_) {
                if (!arguments.length) return orientation;
                orientation = _;
                return axis;
            };

            axis.addLine = function (_) {
                if (!arguments.length) return addLine;
                addLine = _;
                return axis;
            };

            axis.offset = function (_) {
                if (!arguments.length) return offset;
                offset = _;
                return axis;
            };

            axis.getOffset = function (o) {
                return o == orientation ? offset : 0;
            };

            return axis;
        }

        function Dimension() {
            var dimension = {},
                scale = null,
                axis = null,
                domain = null,
                unit = null,
                labelFn = null,
                valueFn = null;

            dimension.scale = function (_) {
                if (!arguments.length) return scale;
                scale = _;
                return dimension;
            };

            dimension.axis = function (_) {
                if (!arguments.length) return axis;
                axis = _;
                return dimension;
            };

            dimension.domain = function (_) {
                if (!arguments.length) return domain;
                domain = _;
                return dimension;
            };

            dimension.unit = function (_) {
                if (!arguments.length) return unit;
                unit = _;
                return dimension;
            };

            dimension.labelFn = function (_) {
                if (!arguments.length) return labelFn;
                labelFn = _;
                return dimension;
            };

            dimension.valueFn = function (_) {
                if (!arguments.length) return valueFn;
                valueFn = _;
                return dimension;
            };

            dimension.hasOrdinalScale = function () {
                return scale === "ordinal";
            };

            return dimension;
        }

        function Bar() {
            var elt = {},
                shape = "rect",
                color = "green",
                orientation = "horizontal",
                height = 20,
                width = null;

            elt.color = function (_) {
                if (!arguments.length) return color;
                color = _;
                return elt;
            };

            elt.shape = function () {
                return shape;
            };

            elt.orientation = function (_) {
                if (!arguments.length) return orientation;
                orientation = _;
                return elt;
            };

            elt.height = function (_) {
                if (!arguments.length) return height;
                height = _;
                return elt;
            };

            elt.width = function (_) {
                if (!arguments.length) return width;
                width = _;
                return elt;
            };
            return elt;
        }

        function Margin() {
            return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
        }

        return {
            createAxis: function () {
                return new Axis();
            },
            /**
             * @ngdoc
             * @name PlotService#createBar
             * @methodOf PlotService
             * @description
             * Creates objects to be used in plot configuration
             * @returns {object}    object created
             */
            createBar: function () {
                return new Bar();
            },

            createDimension: function () {
                return new Dimension();
            },

            createMargin: function ( top, right, bottom, left) {
                var margin = new Margin();
                if (arguments.length) {
                    margin.top = top;
                    if (arguments.length > 1) {
                        margin.right = right;
                        if (arguments.length > 2) {
                            margin.bottom = bottom;
                            if (arguments.length > 3) {
                                margin.left = left;
                            }
                            else {
                                margin.left = right;
                            }
                        }
                        else {
                            margin.bottom = top;
                            margin.left = right;
                        }
                    }
                    else {
                        //noinspection JSSuspiciousNameCombination
                        margin.right = margin.bottom = margin.left = top;
                    }
                }
                return margin;
            },

            createInstance: function () {
                return new Instance();
            }
        }
    }]);
