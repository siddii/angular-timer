'use strict';

/* jasmine specs for directives go here */

describe('timer directive', function() {
  beforeEach(module('timer'));

  describe('default timer', function() {
    it('should run timer with 1 millisecond interval', function() {

      inject(function($compile, $rootScope, $browser, $timeout, $exceptionHandler) {
        var $scope = $rootScope.$new();
        var element = $compile('<timer/>')($scope);
        $scope.$digest();
        $timeout(function() {
          expect(element.html()).toMatch(/^<span class="ng-scope ng-binding">/);
          expect(element.html().indexOf('</span>')).toBeGreaterThan(-1);
          $rootScope.$broadcast('timer-stop');
        }, 300);
        $timeout.flush();
        expect($exceptionHandler.errors).toEqual(undefined);
      });
    });
  });
});
