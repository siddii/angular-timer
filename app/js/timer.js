angular.module('timer', [])
  .directive('timer', function ($timeout, $compile) {
    return  {
      restrict: 'E',
      replace: false,
      scope: {interval: '=interval'},
      controller: function ($scope, $element) {
        if ($element.html().trim().length === 0) {
          $element.append($compile('<span>{{millis}}</span>')($scope));
        }

        $scope.startTime = null;
        $scope.timeoutId = null;

        $scope.$on('timer-start', function (){
          $scope.start();
        });

        $scope.$on('timer-resume', function (){
          $scope.resume();
        });

        $scope.$on('timer-stop', function (){
          $scope.stop();
        });

        $scope.start = $element[0].start = function () {
          $scope.startTime = new Date();
          tick();
        };

        $scope.resume = $element[0].resume = function () {
          $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
          tick();
        };

        $scope.stop = $element[0].stop = function () {
          $scope.stoppedTime = new Date();
          $timeout.cancel($scope.timeoutId);
        };

        $element.bind('$destroy', function () {
          $timeout.cancel($scope.timeoutId);
        });

        var tick = function (){
            $scope.millis = new Date() - $scope.startTime;
            $scope.seconds = Math.floor(($scope.millis / 1000) % 60) ;
            $scope.minutes = Math.floor((($scope.millis / (1000*60)) % 60));
            $scope.hours = Math.floor((($scope.millis / (1000*60*60)) % 24));
            $scope.timeoutId = $timeout(function () {
              tick();
            }, $scope.interval);
        };

        $scope.start();
      }
    };
  });