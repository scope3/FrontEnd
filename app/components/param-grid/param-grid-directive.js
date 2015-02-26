/**
 * Directive for grids containing one modifiable LCA param.
 * Wraps ngGrid directive
 */
angular.module('lcaApp.paramGrid.directive', ['ngGrid', 'lcaApp.models.param'])
.constant('DIRECTION_CELL_TEMPLATE', '<div class="cellIcon"><span ng-class="directionClass(row)"></span></div>')
.directive('paramGrid', ['$compile', 'PARAM_VALUE_STATUS', 'ParamModelService', '$window', 'DIRECTION_CELL_TEMPLATE',
    function($compile, PARAM_VALUE_STATUS, ParamModelService, $window, DIRECTION_CELL_TEMPLATE) {
        return {
            restrict: 'E',
            template: '<span><div class=\"gridStyle\" ng-grid=\"gridOptions\" ng-style=\"dynamicGridStyle\"></div></span>',
            scope : { options : '=', data : '=', columns : '=', params : '=' },
            replace : true,
            transclude : false,
            controller : paramGridController
        };

        function paramGridController($scope, $attrs) {

            $scope.dynamicGridStyle = null;
            $scope.gridOptions = {};
            $scope.changeClass = getChangeStatusClass;
            $scope.directionClass = getDirectionClass;
            $scope.$on('ngGridEventEndCellEdit', handleCellEdit);   // Cell edit event handler

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
                        iconClass = "glyphicon-remove";
                        break;
                }
                return iconClass;
            }

            /**
             * Get icon class for Input / Ouput
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
            * Handle changes to editable cell
            * @param evt   Event object containing row changed.
            */
            function handleCellEdit(evt) {
                var rowObj = evt.targetScope.row.entity,
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

            function addParamCols() {
                var paramCol = [
                        {field: 'paramWrapper.value', displayName: 'Parameter', cellFilter: 'numFormat',
                         enableCellEdit: false },
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

            function adjustHeight() {
                var gridHeight = $scope.data.length * 30 + 50;
                $scope.dynamicGridStyle = { height: gridHeight};
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
                        enableHighlighting: true
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

            $scope.$watch('data', function (newVal) {
                if (newVal) {
                    adjustHeight();
                }
            });

            $scope.$watch('params', function (newVal) {
                if (newVal ) {
                    getTargetField();
                }
            });

            init();

        }
    }]);