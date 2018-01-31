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

describe('programService', function() {

    var $rootScope, programService, program1, program2, template, $q;

    beforeEach(function() {
        module('admin-program-list', function($provide) {
            var templateServiceSpy = jasmine.createSpyObj('templateService', ['getAll']);

            templateServiceSpy.getAll.andCallFake(function() {
                return $q.when([template]);
            });

        	$provide.factory('templateService', function(){
        		return templateServiceSpy;
        	});
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            programService = $injector.get('programService');
            $q = $injector.get('$q');
        });

        template = {
            id: '1',
            programId: '2'
        };
        program1 = {
            id: '1',
            name: 'name1'
        };
        program2 = {
            id: '2',
            name: 'name2',
            $template: template
        };

        spyOn(programService, 'getAll').andCallFake(function() {
            return $q.when([program1, program2]);
        });
    });

    it('should get all programs with templates', function() {
        var data;

        programService.getAllProgramsWithTemplates().then(function(response) {
            data = response;
        });

        $rootScope.$apply();

        expect(data[0].id).toEqual(program1.id);
        expect(data[1].id).toEqual(program2.id);
        expect(data[1].$template.id).toEqual(template.id);
        expect(data[1].$template.programId).toEqual(template.programId);
    });
});
