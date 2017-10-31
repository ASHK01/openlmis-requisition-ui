/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    angular
        .module('requisition-convert-to-order')
        .config(routes)
        .run(run);

    var cachedRequisitionService;

    routes.$inject = ['$stateProvider', 'FULFILLMENT_RIGHTS'];
    run.$inject = ['$rootScope', 'requisitionsForConvertFactory'];

    function run($rootScope, requisitionsForConvertFactory) {
        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            if (toState.name !== 'openlmis.requisitions.convertToOrder') {
                requisitionsForConvertFactory.clearCache();
            }
        });
    }

    function routes($stateProvider, FULFILLMENT_RIGHTS) {

        $stateProvider.state('openlmis.requisitions.convertToOrder', {
            showInNavigation: true,
            label: 'requisitionConvertToOrder.convertToOrder.label',
            url: '/convertToOrder?filterBy&filterValue&sortBy&descending&page&size',
            controller: 'ConvertToOrderController',
            controllerAs: 'vm',
            templateUrl: 'requisition-convert-to-order/convert-to-order.html',
            accessRights: [FULFILLMENT_RIGHTS.ORDERS_EDIT],
            params: {
                filterBy: 'all',
                filterValue: ''
            },
            resolve: {
                requisitions: function(paginationService, requisitionsForConvertFactory, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
						return cachedRequisitionService.forConvert(stateParams);
					});
				}
            }
        });
    }

})();
