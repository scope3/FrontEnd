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
            var buttonTemplate =
'<button ng-show=row.entity.paramWrapper.enableEdit type="button" class="ngCell btn btn-default btn-sm" ng-click="ddParam(row.entity)" aria-label="duplicate or delete" title="{{ddTitle(row)}}"><span ng-class="ddClass(row)"></span></button>',
                paramTemplate =
'<div class="ngCellText" ng-class="col.colIndex() + editClass(row)"><span ng-cell-text>{{COL_FIELD}}</span></div>';

            $scope.gridOptions = {};
            $scope.editClass = getValidationStatusClass;
            $scope.ddClass = function( row) {
                return ParamModelService.valueInput(row.entity.paramWrapper)  ? "glyphicon glyphicon-trash" : "glyphicon glyphicon-duplicate";
            };
            $scope.ddTitle = function( row) {
                return ParamModelService.valueInput(row.entity.paramWrapper)  ? "Delete modified value" : "Copy default value";
            };
            $scope.ddParam = duplicateOrDeleteParam;
            $scope.directionClass = getDirectionClass;
            $scope.paramHintStyle = getParamHintStyle;
            $scope.$on('ngGridEventEndCellEdit', handleEndCellEdit);   // End cell edit event handler
            //$scope.$on('ngGridEventStartCellEdit', handleStartCellEdit);   // Start cell edit event handler

            /**
             * Get icon class for param change status
             * @param {{ entity : {paramWrapper : {editStatus : Number}} }} row
             * @returns {string}
             */
            function getValidationStatusClass( row) {
                var iconClass = "";
                switch (row.entity.paramWrapper.editStatus) {
                    case PARAM_VALUE_STATUS.changed :
                        iconClass = " has-success";
                        break;
                    case PARAM_VALUE_STATUS.invalid :
                        iconClass = " has-error";
                        break;
                }
                return iconClass;
            }

            function duplicateOrDeleteParam(entity) {
                if (ParamModelService.valueInput(entity.paramWrapper)) {
                    entity.paramWrapper.value = "";
                    entity.paramWrapper.copy = false;
                } else {
                    copyDefaultValue(entity, true);
                }
                updateStatus(entity);
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

            function copyDefaultValue(entity, saveCopy) {
                var targetField = getTargetField();
                if (targetField) {
                    ParamModelService.initParamWrapperValue(entity[targetField], entity.paramWrapper, saveCopy);
                    //$scope.$apply();    // Needed for IE
                }
            }

            function updateStatus( entity) {
                var errMsg = "",
                    targetField = getTargetField();

                if (targetField) {
                    errMsg = ParamModelService.setParamWrapperStatus(entity[targetField], entity.paramWrapper);

                    //$scope.$apply();    // Needed for IE

                    if (entity.paramWrapper.editStatus === PARAM_VALUE_STATUS.invalid) {
                        $window.alert(errMsg);
                    }
                }
            }

            /**
            * Handle changes to editable cell
            * @param evt   Event object containing row changed.
            */
            function handleEndCellEdit(evt) {
                $scope.$apply(updateStatus(evt.targetScope.row["entity"]));
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
                        {
                            field: 'paramWrapper.value',
                            displayName: 'Modified Value',
                            cellTemplate: paramTemplate,
                            enableCellEdit: false,
                            cellEditableCondition: 'row.getProperty(\'paramWrapper.enableEdit\')',
                            sortFn: sortParam
                        },
                        {field: 'paramWrapper.editStatus', displayName: '', enableCellEdit: false, width: 35}
                    ],
                    cols = $scope.columns;

                if ($scope.params) {
                    paramCol[0].visible = true;
                    if ($scope.params.canUpdate) {
                        paramCol[0].enableCellEdit = true;
                        paramCol[1].cellTemplate = buttonTemplate;
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

            function updateParamCols() {
                if ($scope.columnDefs && $scope.params.targetIndex && (($scope.params.targetIndex + 1) < $scope.columnDefs.length)) {
                    var paramIndex = $scope.params.targetIndex + 1,
                        statusIndex = paramIndex + 1,
                        cols = $scope.columnDefs;

                    cols[paramIndex].visible = true;
                    if ($scope.params.canUpdate) {
                        cols[paramIndex].enableCellEdit = true;
                        cols[statusIndex].cellTemplate = buttonTemplate;
                        cols[statusIndex].visible = true;

                    } else {
                        cols[statusIndex].visible = false;
                    }
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

            // Handle change to canUpdate after columns and parameters are defined
            $scope.$watch('params.canUpdate', function (newVal) {
                if (newVal) {
                    updateParamCols();
                }
            });

            init();

        }
    }]);