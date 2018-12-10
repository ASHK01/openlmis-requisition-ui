[1mdiff --git a/src/requisition-calculations/calculation.factory.js b/src/requisition-calculations/calculation.factory.js[m
[1mindex ce0dafd..95e0620 100644[m
[1m--- a/src/requisition-calculations/calculation.factory.js[m
[1m+++ b/src/requisition-calculations/calculation.factory.js[m
[36m@@ -46,7 +46,8 @@[m
             //Q = TEMPLATE_COLUMNS.TOTAL_COST,[m
             S = TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY_ISA,[m
             T = TEMPLATE_COLUMNS.PRICE_PER_PACK,[m
[31m-            Z = TEMPLATE_COLUMNS.ADDITIONAL_QUANTITY_REQUIRED;[m
[32m+[m[32m            Z = TEMPLATE_COLUMNS.ADDITIONAL_QUANTITY_REQUIRED,[m
[32m+[m[41m        [m	[32mN = TEMPLATE_COLUMNS.MOS;[m
         //V = TEMPLATE_COLUMNS.PACKS_TO_SHIP,[m
         //Y = TEMPLATE_COLUMNS.TOTAL;[m
 [m
[36m@@ -62,10 +63,27 @@[m
             maximumStockQuantity: calculateMaximumStockQuantity,[m
             averageConsumption: calculateAverageConsumption,[m
             calculatedOrderQuantityIsa: calculatedOrderQuantityIsa,[m
[31m-            getOrderQuantity: getOrderQuantity[m
[32m+[m[32m            getOrderQuantity: getOrderQuantity,[m
[32m+[m[32m            mos: getMos[m
         };[m
         return calculationFactory;[m
 [m
[32m+[m
[32m+[m[32m        /**[m
[32m+[m[32m         * @ngdoc method[m
[32m+[m[32m         * @methodOf requisition-calculations.calculationFactory[m
[32m+[m[32m         * @name totalConsumedQuantity[m
[32m+[m[32m         *[m
[32m+[m[32m         * @description[m
[32m+[m[32m         * Calculates the value of the Total Consumed Quantity column based on the given line item.[m
[32m+[m[32m         *[m
[32m+[m[32m         * @param  {Object} lineItem the line item to calculate the value from[m
[32m+[m[32m         * @return {Number}          the calculated Total Consumed Quantity value[m
[32m+[m[32m         */[m
[32m+[m[32m        function getMos(lineItem) {[m
[32m+[m[32m            return getItem(lineItem, N);[m
[32m+[m[32m        }[m
[32m+[m[41m        [m
         /**[m
          * @ngdoc method[m
          * @methodOf requisition-calculations.calculationFactory[m
[1mdiff --git a/src/requisition-constants/template-columns.constant.js b/src/requisition-constants/template-columns.constant.js[m
[1mindex 4172611..504199d 100644[m
[1m--- a/src/requisition-constants/template-columns.constant.js[m
[1m+++ b/src/requisition-constants/template-columns.constant.js[m
[36m@@ -29,6 +29,7 @@[m
         .constant('TEMPLATE_COLUMNS', columns());[m
 [m
     function columns() {[m
[32m+[m[32m    console.log('test');[m
         return {[m
             APPROVED_QUANTITY: 'approvedQuantity',[m
             BEGINNING_BALANCE: 'beginningBalance',[m
[36m@@ -36,6 +37,7 @@[m
             REQUESTED_QUANTITY: 'requestedQuantity',[m
             REQUESTED_QUANTITY_EXPLANATION: 'requestedQuantityExplanation',[m
             STOCK_ON_HAND: 'stockOnHand',[m
[32m+[m[32m            MOS: 'mos',[m
             SKIPPED: 'skipped',[m
             TOTAL_RECEIVED_QUANTITY: 'totalReceivedQuantity',[m
             TOTAL_CONSUMED_QUANTITY: 'totalConsumedQuantity',[m
[1mdiff --git a/src/requisition-template/requisition-column.js b/src/requisition-template/requisition-column.js[m
[1mindex 420f14f..a567efc 100644[m
[1m--- a/src/requisition-template/requisition-column.js[m
[1m+++ b/src/requisition-template/requisition-column.js[m
[36m@@ -106,6 +106,9 @@[m
             calculatedOrderQuantity: [[m
                 TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY,[m
                 TEMPLATE_COLUMNS.STOCK_ON_HAND[m
[32m+[m[32m            ],[m
[32m+[m[32m            mos: [[m
[32m+[m[41m            [m	[32mTEMPLATE_COLUMNS.MOS[m
             ][m
         };[m
 [m
[1mdiff --git a/src/requisition-view-tab/requisition-view-tab.controller.js b/src/requisition-view-tab/requisition-view-tab.controller.js[m
[1mindex 0483a05..d707a1e 100644[m
[1m--- a/src/requisition-view-tab/requisition-view-tab.controller.js[m
[1m+++ b/src/requisition-view-tab/requisition-view-tab.controller.js[m
[36m@@ -141,6 +141,7 @@[m
         function onInit() {[m
             vm.lineItems = lineItems;[m
             vm.requisition = requisition;[m
[32m+[m[32m            columns[11].source = 'USER_INPUT';[m
             vm.columns = columns;[m
             vm.userCanEdit = canAuthorize || canSubmit;[m
             vm.showAddFullSupplyProductsButton = showAddFullSupplyProductsButton();[m
[1mdiff --git a/src/requisition-view/requisition-view.html b/src/requisition-view/requisition-view.html[m
[1mindex ff368ea..c4e2bd0 100644[m
[1m--- a/src/requisition-view/requisition-view.html[m
[1m+++ b/src/requisition-view/requisition-view.html[m
[36m@@ -10,20 +10,7 @@[m
 <status-messages requisition="vm.requisition"></status-messages>[m
 <nav>[m
     <ul>[m
[31m-        <li ui-sref-active="active" role="presentation"[m
[31m-            ng-class="{'is-invalid': !vm.isFullSupplyTabValid()}"[m
[31m-            popover="{{vm.invalidFullSupply}}">[m
[31m-            <a ui-sref="openlmis.requisitions.requisition.fullSupply">[m
[31m-                {{'requisitionView.fullSupplyProducts' | message}}[m
[31m-            </a>[m
[31m-        </li>[m
[31m-        <li ui-sref-active="active" ng-if="vm.requisition.program.showNonFullSupplyTab"[m
[31m-            role="presentation" ng-class="{'is-invalid': !vm.isNonFullSupplyTabValid()}"[m
[31m-            popover="{{vm.invalidNonFullSupply}}">[m
[31m-            <a ui-sref="openlmis.requisitions.requisition.nonFullSupply">[m
[31m-                {{'requisitionView.nonFullSupplyProducts' | message}}[m
[31m-            </a>[m
[31m-        </li>[m
[32m+[m[41m        [m
     </ul>[m
 </nav>[m
 <div ui-view=""></div>[m
[1mdiff --git a/src/requisition/requisition.js b/src/requisition/requisition.js[m
[1mindex 2b12a9a..51c50a9 100644[m
[1m--- a/src/requisition/requisition.js[m
[1m+++ b/src/requisition/requisition.js[m
[36m@@ -579,6 +579,7 @@[m
         function addLineItems(orderables) {[m
             var requisition = this;[m
             orderables.forEach(function(orderable) {[m
[32m+[m[32m            console.log('aamir:',orderable);[m
                 requisition.addLineItem(orderable);[m
             });[m
         }[m
