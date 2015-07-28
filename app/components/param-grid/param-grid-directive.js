/**
 * @ngdoc directive
 * @name lcaApp.paramGrid.directive:paramGrid
 * @restrict E
 * @function
 * @scope
 *
 * @description
 * Directive for grids containing one modifiable LCA param.
 * Wraps ngGrid directive -  {@link http://angular-ui.github.com/ng-grid/ ngGrid}.
 *
 * @param {object} options Override default ngGrid gridOptions
 * @param {object} data    Data to be referenced by gridOptions.data
 * @param {object} data.paramWrapper    Wraps LCA param. Created by ParamModelService.wrapParam.
 * @param {object} columns Column defs to be referenced by gridOptions.columnDefs. This directive will add
 * columns for Parameter value and edit status.
 * @param {object} params Provides information on how to handle Parameter data. If not provided, Parameter columns
 * will not be visible.
 * @param {boolean} params.canUpdate Does user have access to edit parameters?
 * @param {number} params.targetIndex Index of column containing parameterizable field. Parameter column will be inserted
 * after that column.
 *
 */
angular.module('lcaApp.paramGrid.directive', ['ngGrid', 'lcaApp.models.param', 'lcaApp.format'])
.constant('DIRECTION_CELL_TEMPLATE', '<div class="cellIcon"><span ng-class="directionClass(row)"></span></div>')
.constant('PARAM_HINT_CELL_TEMPLATE',
    '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text ng-style="paramHintStyle(row)">{{row.getProperty(col.field) | numFormat}}</span></div>')
.directive('paramGrid', ['$compile', 'PARAM_VALUE_STATUS', 'ParamModelService', '$window',
    function($compile, PARAM_VALUE_STATUS, ParamModelService, $window) {
        return {
            restrict: 'E',
            template: '<span><div class=\"gridStyle\" ng-grid=\"gridOptions\"></div></span>',
            scope : { options : '=', data : '=', columns : '=', params : '=' },
            replace : true,
            transclude : false,
            controller : paramGridController
        };

        function paramGridController($scope) {
            $scope.gridOptions = {};
            $scope.changeClass = getChangeStatusClass;
            $scope.directionClass = getDirectionClass;
            $scope.paramHintStyle = getParamHintStyle;
            $scope.$on('ngGridEventEndCellEdit', handleEndCellEdit);   // End cell edit event handler
            $scope.$on('ngGridEventStartCellEdit', handleStartCellEdit);   // Start cell edit event handler

            /**
             * Get icon class for param change status
             * @param {{ entity : {paramWrapper : {editStatus : Number}} }} row
             * @returns {string}
             */
            function getChangeStatusClass( row) {
                var iconClass = "";
                switch (row.entity.paramWrapper.editStatus) {
                    case PARAM_VALUE_STATUS.changed :
                        iconClass = "glyphicon-ok";
                        break;
                    case PARAM_VALUE_STATUS.invalid :
                        iconClass = "glyphicon-exclamation-sign";
                        break;
                }
                return iconClass;
            }

            /**
             * Get icon class for Input / Output
             * @param {{ entity : {paramWrapper : {editStatus : Number}} }} row
             * @returns {string}
             */
            function getDirectionClass( row) {
                var iconClass = "";
                switch (row.entity.direction) {
                    case "Input" :
                        iconClass = "glyphicon glyphicon-arrow-left";
                        break;
                    case "Output" :
                        iconClass = "glyphicon glyphicon-arrow-right";
                        break;
                }
                return iconClass;
            }

            /**
             * Get style for hinting that current cell value is affected by parameter
             * @param {{ entity : {paramWrapper : {paramResource : null | {}}} }} row
             * @returns {string}
             */
            function getParamHintStyle( row) {
               return (row.entity.paramWrapper && row.entity.paramWrapper.paramResource) ?
                   {'font-weight' : 'bold'} : {};
            }

            function handleStartCellEdit(evt) {
                var rowObj = evt.targetScope.row["entity"],
                    targetField = getTargetField();

                if (targetField) {
                    ParamModelService.initParamWrapperValue(rowObj[targetField], rowObj.paramWrapper);

                    $scope.$apply();    // Needed for IE
                }
            }

            /**
            * Handle changes to editable cell
            * @param evt   Event object containing row changed.
            */
            function handleEndCellEdit(evt) {
                var rowObj = evt.targetScope.row["entity"],
                    errMsg = "",
                    targetField = getTargetField();

                if (targetField) {
                    errMsg = ParamModelService.setParamWrapperStatus(rowObj[targetField], rowObj.paramWrapper);

                    $scope.$apply();    // Needed for IE

                    if (rowObj.paramWrapper.editStatus === PARAM_VALUE_STATUS.invalid) {
                        $window.alert(errMsg);
                    }
                }
            }

            function setColWidths() {
                $scope.columns.forEach( function (col) {
                    if (!col.hasOwnProperty("width")) {
                        col.width = "*"
                    }
                })
            }

            function compare(a, b) {
                if (a < b) {
                    return -1;
                }
                else if (a > b) {
                    return 1;
                }
                else {
                    return 0;
                }
            }

            function sortParam (a, b) {
                if (typeof(a) === typeof(b)) {
                    return compare(a, b);
                } else {
                    return typeof(a) === "number" ? -1 : 1;
                }
            }

            function addParamCols() {
                var paramCol = [
                        {field: 'paramWrapper.value', displayName: 'Modified Value',
                         enableCellEdit: false, cellEditableCondition: 'row.getProperty(\'paramWrapper.enableEdit\')',
                            sortFn: sortParam },
                        {field: 'paramWrapper.editStatus', displayName: '', enableCellEdit: false, width: 20}
                    ],
                    cols = $scope.columns;

                if ($scope.params) {
                    paramCol[0].visible = true;
                    if ($scope.params.canUpdate) {
                        // Unable to load cell template from file without browser error. Appears to be an ng-grid glitch.
                        paramCol[0].enableCellEdit = true;
                        paramCol[1].cellTemplate =
                            '<div class="cellIcon"><span class="glyphicon" ng-class="changeClass(row)"></span></div>';
                        paramCol[1].visible = true;

                    } else {
                        paramCol[1].visible = false;
                    }

                    if (cols && cols.length > 0) {
                        if (!$scope.params.targetIndex || $scope.params.targetIndex >= cols.length) {
                            $scope.params.targetIndex = cols.length - 1 ;
                        }
                        cols.splice($scope.params.targetIndex + 1, 0, paramCol[0], paramCol[1]);
                        $scope.columnDefs = cols;
                    } else {
                        // Not really a valid case. Other columns should be displayed.
                        $scope.columnDefs = paramCol;
                    }
                } else {
                    // No params, add invisible param columns
                    paramCol[0].visible = false;
                    paramCol[1].visible = false;
                    $scope.columnDefs = cols.concat(paramCol);
                }
            }

            function getTargetField() {
                if ( $scope.params.targetIndex && $scope.params.targetIndex < $scope.columns.length) {
                    var colDef = $scope.columns[$scope.params.targetIndex];
                    return colDef.field;
                } else {
                    return null;
                }
            }

            function init() {
                var options = $scope.options,
                    fixedOptions = {
                        columnDefs  : 'columns',
                        data        : 'data'
                    },
                    defaultOptions = {
                        enableRowSelection: false,
                        enableCellEditOnFocus: true,
                        enableHighlighting: true,
                        enableColumnResize: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                    };


                angular.extend($scope.gridOptions, defaultOptions);
                angular.extend($scope.gridOptions, options);
                angular.extend($scope.gridOptions, fixedOptions);

            }

            $scope.$watch('columns', function (newVal) {
                if (newVal && newVal.length > 0) {
                    setColWidths();
                    addParamCols();
                }
            });

            init();

        }
    }]);