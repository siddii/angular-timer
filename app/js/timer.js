angular.module('timer', [])
  .directive('timer', function ($timeout, $compile) {
    return  {
      restrict: 'E',
      replace: false,
      scope: {interval: '=interval'},
      controller: function ($scope, $element) {
        if ($element.html().trim().length === 0) {
          $element.append($compile('<span>{{timeTaken}}</span>')($scope));
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
          tick();
        };

        $scope.stop = $element[0].stop = function () {
          $timeout.cancel($scope.timeoutId);
        };


        $element[0].stop = function () {
          $timeout.cancel($scope.timeoutId);
        };

        $element.bind('$destroy', function () {
          $timeout.cancel($scope.timeoutId);
        });

        var tick = function (){
            $scope.timeTaken = new Date() - $scope.startTime;
            $scope.minutes = Math.floor($scope.timeTaken / (1000 * 60));
            $scope.seconds = Math.floor(($scope.timeTaken - ($scope.minutes * 60)) / 1000) % 60;

            $scope.timeoutId = $timeout(function () {
              tick();
            }, $scope.interval);
        };

        $scope.start();
      }
    };
  });