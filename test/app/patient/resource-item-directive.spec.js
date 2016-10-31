'use strict';

describe("Directive: resourceItem", function() {
  beforeEach(module('fhirReader'));
  beforeEach(module('dir-templates'));

  var element;

  beforeEach(function() {

    inject(function($rootScope, $compile) {
      element = angular.element('<resource-item resource="\'AllergyIntolerance\'" ></resource-item>');

      $compile(element)($rootScope);

      $rootScope.$digest();
    })
  });

  it('should be defined', function() {
    expect(element.html().length).toBeGreaterThan(0);
  });
});