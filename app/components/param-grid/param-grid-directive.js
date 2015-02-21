/**
 * Directive for grids containing one modifiable LCA param.
 * Wraps ngGrid directive
 */
angular.module('lcaApp.paramGrid.directive', ['ngGrid', 'lcaApp.models.param'])
.directive('paramGrid', ['PARAM_VALUE_STATUS', 'ParamModelService', '$window',
    function($compile, PARAM_VALUE_STATUS, ParamModelService, $window) {
        return {
            restrict: 'E',
            template: '<span><div class=\"gridStyle\" ng-grid=\"gridOptions\" ng-style=\"dynamicGridStyle\"></div></span>',
            scope : { options : '=', data : '=', columns : '=', params : '=' },
            replace : true,
            transclude : false,
            controller : controller
        };

        function controller($scope, $attrs) {
            var targetField = null;

            $scope.dynamicGridStyle = null;
            $scope.gridOptions = {};
            $scope.changeClass = getChangeStatusClass;
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
            * Handle changes to editable cell
            * @param evt   Event object containing row changed.
            */
            function handleCellEdit(evt) {
                var rowObj = evt.targetScope.row.entity,
                    errMsg = "";

                if (targetField) {
                    errMsg = ParamModelService.setParamWrapperStatus(rowObj[targetField], rowObj.paramWrapper);

                    $scope.$apply();    // Needed for IE

                    if (rowObj.paramWrapper.editStatus === PARAM_VALUE_STATUS.invalid) {
                        $window.alert(errMsg);
                    }
                }
            }

            function addParamCols() {
                var paramCol = [
                        {field: 'paramWrapper.value', displayName: 'Parameter', enableCellEdit: false },
                        {field: 'paramWrapper.editStatus', displayName: '', enableCellEdit: false, width: 20}
                    ],
                    cols = $scope.columns;

                if ($scope.params) {
                    paramCol[0].visible = true;
                    if ($scope.params.canUpdate) {
                        // Unable to load cell template from file without browser error. Appears to be an ng-grid glitch.
                        paramCol[0].enableCellEdit = true;
                        paramCol[1].cellTemplate =
                            '<span class="glyphicon" ng-class="changeClass(row)"></span>';
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
                if ( $scope.params.targetIndex && $scope.params.targetIndex >= $scope.columnDefs.length) {
                    var colDef = $scope.columnDefs[$scope.params.targetIndex];
                    targetField = colDef.field;
                }
            }

            function init() {
                var options = $scope.options,
                    fixedOptions = {
                        columnDefs  : 'columnDefs',
                        data        : 'data'
                    },
                    defaultOptions = {
                        enableRowSelection: false,
                        enableCellEditOnFocus: true,
                        enableHighlighting: true
                    };
                addParamCols();
                getTargetField();
                adjustHeight();

                angular.extend($scope.gridOptions, defaultOptions);
                angular.extend($scope.gridOptions, options);
                angular.extend($scope.gridOptions, fixedOptions);

            }

            init();


        }
    }]);