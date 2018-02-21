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

describe('FullSupplyController', function() {

    var vm, requisition, requisitionValidator, lineItems, paginatedListFactory, columns,
        stateParams, canAuthorize, $controller, RequisitionColumnDataBuilder;

    beforeEach(function() {
        module('requisition-full-supply');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);

        paginatedListFactory = jasmine.createSpyObj('paginatedListFactory', ['getPaginatedItems']);
        paginatedListFactory.getPaginatedItems.andCallFake(function(lineItems) {
            return [lineItems];
        });

        requisition = jasmine.createSpyObj('requisition', ['$isInitiated', '$isSubmitted','$isRejected']);
        requisition.template = jasmine.createSpyObj('RequisitionTemplate', ['getColumns', 'hasSkipColumn']);
        requisition.requisitionLineItems = [
            lineItem('One', true),
            lineItem('Two', true),
            lineItem('One', true),
            lineItem('Two', true),
            lineItem('Three', false)
        ];

        lineItems = [
            requisition.requisitionLineItems[0],
            requisition.requisitionLineItems[1],
            requisition.requisitionLineItems[2],
            requisition.requisitionLineItems[3]
        ];

        requisition.$isInitiated.andReturn(false);
        requisition.$isSubmitted.andReturn(false);
        requisition.$isRejected.andReturn(false);

        requisition.program = {
            code: 'program-code'
        }

        columns = [new RequisitionColumnDataBuilder().buildSkipColumn()];

        stateParams = {
            page: 0,
            size: 10
        };

        function lineItem(category, fullSupply) {
            var lineItem = jasmine.createSpyObj('lineItem', ['canBeSkipped']);
            lineItem.canBeSkipped.andCallFake(function() {
                return lineItem.$program.orderableCategoryDisplayName === 'One';
            });
            lineItem.skipped = false;
            lineItem.$program =  {
                orderableCategoryDisplayName: category,
                fullSupply: fullSupply
            };
            return lineItem;
        }
    });

    it('should expose requisitionValidator.isLineItemValid method', function() {
        initController();

        expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
    });

    it('should mark all full supply line items as skipped', function() {
        initController();
        vm.$onInit();

        vm.skipAll();

        expect(requisition.requisitionLineItems[0].skipped).toBe(true);
        expect(requisition.requisitionLineItems[2].skipped).toBe(true);

        expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        expect(requisition.requisitionLineItems[4].skipped).toBe(false);
    });

    it('should mark all full supply line items as not skipped', function() {
        initController();
        vm.$onInit();

        vm.unskipAll();

        expect(requisition.requisitionLineItems[0].skipped).toBe(false);
        expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        expect(requisition.requisitionLineItems[2].skipped).toBe(false);
        expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        expect(requisition.requisitionLineItems[4].skipped).toBe(false);
    });

    describe('$onInit', function() {

        it('should not show skip controls', function(){
            initController();

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

        it('should show skip controls if the requisition status is INITIATED', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition status is SUBMITTED and user has authorize right', function(){
            canAuthorize = true;
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition status is REJECTED', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isRejected.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition template has a skip columm', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);
            columns[0].name = 'skipped';

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });


        it('should not show skip controls if the requisition template doesnt have a skip columm', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(false);
            requisition.$isInitiated.andReturn(true);
            columns[0].name = 'foo';

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

        it('should not show skip controls if user does not authorize right and requisition is submitted', function() {
            canAuthorize = false;
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

    });

    function initController() {
        vm = $controller('FullSupplyController', {
            totalItems: 4,
            columns: columns,
            lineItems: lineItems,
            stateParams: stateParams,
            requisition: requisition,
            requisitionValidator: requisitionValidator,
            canAuthorize: canAuthorize,
            paginatedListFactory: paginatedListFactory
        });
        vm.items = [
            lineItems[0],
            lineItems[1]
        ];
    }
});
