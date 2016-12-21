(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-core.directive:offline
     * @restrict A
     *
     * @description
     * Directive for determining if user is online or not.
     *
     * @example
     * ```
     * <button offline ng-disabled="isOffline">Do something</button>
     * ```
     */

    angular
        .module('openlmis-core')
        .directive('offline', offline);

    offline.$inject = ['OfflineService'];

    function offline(OfflineService) {
        var directive = {
            restrict: 'A',
            scope: false,
            replace: false,
            link: link
        }
        return directive;

        function link(scope, element, attr) {

            /**
             * @ngdoc property
             * @name isOffline
             * @propertyOf openlmis-core.directive:offline
             * @type {Boolean}
             *
             * @description
             * A boolean that says if there is an internet connection, as
             * determined by the offlineService.
             */
            scope.$watch(function(){
                return OfflineService.isOffline();
            }, function(isOffline) {
                scope.isOffline = isOffline;
            }, true);

            /**
             * @ngdoc property
             * @name checkConnection
             * @propertyOf openlmis-core.directive:offline
             * @type {Boolean}
             *
             * @description
             * Makes the offlineService check if there is a connection to the internet.
             */
            scope.checkConnection = function() {
                return OfflineService.checkConnection();
            };
        }
    }

})();