/**
 * Service to display status in all app views
 */
angular.module('lcaApp.status.service', ['angularSpinner', 'ui.bootstrap.alert'])
    .constant("SPINNER_KEY", "spinner-lca")
    .factory('StatusService', [ 'usSpinnerService', 'SPINNER_KEY', '$rootScope', '$log',
        function (usSpinnerService, SPINNER_KEY, $rootScope, $log) {
            var svc = { };

            svc.startWaiting = function () {
                $rootScope.alert = null;
                usSpinnerService.spin(SPINNER_KEY);
            };

            svc.stopWaiting = function () {
                usSpinnerService.stop(SPINNER_KEY);
            };

            /**
             * Stop waiting and display error.
             * @param {string | {}} err     httpResponse for failed request, error message, or instance of Error
             */
            svc.handleFailure = function (err) {
                var errMsg = "";
                svc.stopWaiting();
                if (typeof(err) === "string") {
                    errMsg = err;
                } else {
                    if (err.hasOwnProperty("status")) {
                        switch (+err["status"]) {
                            case 401 :
                                errMsg = "Web API authorization failed.\n";
                                break;
                            case 409 :
                                errMsg = "Web API request conflicts with another request that is in progress.\n";
                                break;
                        }
                        if (err.hasOwnProperty("data")) {
                            if (typeof (err["data"])  === "string") {
                                errMsg += err["data"];
                            }
                            else {
                                var errData = err["data"];
                                if (errData.hasOwnProperty("exceptionMessage")) {
                                    errMsg = 'Web API Exception : ' + errData["exceptionMessage"];
                                    $log.error(JSON.stringify(err));
                                }
                            }
                        }
                    } else if (err.hasOwnProperty("message") ) {
                        errMsg = err["message"];
                    }

                }
                $rootScope.alert = { type: "danger", msg: errMsg };
            };

            svc.handleSuccess = function (infoMsg) {
                    svc.stopWaiting();
                    $rootScope.alert = null;
                    if (infoMsg) {
                        $rootScope.alert = { type: "success", msg: infoMsg };
                    }
            };

            return svc;
    }]);
