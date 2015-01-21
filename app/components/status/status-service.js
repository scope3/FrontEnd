/**
 * Service to display status in all app views
 */
angular.module('lcaApp.status.service', ['angularSpinner', 'ui.bootstrap.alert'])
    .constant("SPINNER_KEY", "spinner-lca")
    .factory('StatusService', [ 'usSpinnerService', 'SPINNER_KEY', '$rootScope',
        function (usSpinnerService, SPINNER_KEY, $rootScope) {
            var svc = { };

            svc.startWaiting = function () {
                $rootScope.alert = null;
                usSpinnerService.spin(SPINNER_KEY);
            };

            svc.stopWaiting = function () {
                usSpinnerService.stop(SPINNER_KEY);
            };

            svc.handleFailure = function (errMsg) {
                svc.stopWaiting();
                $rootScope.alert = { type: "danger", msg: errMsg };
            };

            svc.handleSuccess = function () {
                    svc.stopWaiting();
                    $rootScope.alert = null;
            };

            return svc;
    }]);
