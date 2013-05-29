'use strict';

/* jasmine specs for directives go here */

describe('timer directive', function() {
  beforeEach(module('timer'));

  describe('default timer', function() {
    it('should run timer with 1 millisecond interval', function() {

      inject(function($compile, $rootScope, $browser, $timeout) {
        var $scope = $rootScope.$new();
        var element = $compile('<timer/>')($scope);
        $timeout(function() {
          console.log('######### $scope = ', element.html());
          console.log('########## $scope.startTime = ', $scope.startTime);
        }, 100);
        $timeout(function() {
          console.log('######### $scope = ', element.html());
          console.log('########## $scope.startTime = ', $scope.startTime);
        }, 200);
        $browser.defer.flush();
      });
    });
  });

});
