/**
 * @ngdoc controller
 * @name lcaApp.modal.confirm:ModalConfirmController
 * @description
 * Controller for modal confirmation dialog.
 */
angular.module('lcaApp.modal.confirm', ['ui.bootstrap'])
    .controller('ModalConfirmController', function ($scope, $modalInstance, parameters) {

        var result = null;

        $scope.title = "Confirmation Dialog";

        $scope.question = "Are you sure?";

        $scope.ok = function () {
            $modalInstance.close(result);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        if (parameters.hasOwnProperty("title")){
            $scope.title = parameters.title;
        }

        if (parameters.hasOwnProperty("question")){
            $scope.question = parameters.question;
        }

        if (parameters.hasOwnProperty("result")) {
            result = parameters.result;
        }
    });