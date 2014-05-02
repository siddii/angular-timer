'use strict';

describe('timer-set-countdown-seconds event handling tests', function () {
  beforeEach(module('timer'));

  it('should call the event and set single digit seconds correctly', function () {
    inject(function ($compile, $rootScope, $timeout) {
      var scope = $rootScope.$new();
      var element = $compile('<timer countdown="10" interval="1000" autostart="false">{{sseconds}}</timer>')(scope);
      scope.$digest();

      scope.$broadcast('timer-set-countdown-seconds', 5);

      $timeout(function () {
        scope.$digest();
        expect(element.html().indexOf('05')).toBeGreaterThan(-1);
      }, 500);

      $timeout.flush();
    });
  });

  it('should call the event and set larger second values correctly', function () {
    inject(function ($compile, $rootScope, $timeout) {
      var scope = $rootScope.$new();
      var element = $compile('<timer countdown="10" interval="1000" autostart="false">{{mminutes}}:{{sseconds}}</timer>')(scope);
      scope.$digest();

      scope.$broadcast('timer-set-countdown-seconds', 135);

      $timeout(function () {
        scope.$digest();
        expect(element.html().indexOf('02:15')).toBeGreaterThan(-1);
      }, 500);

      $timeout.flush();
    });
  });
});