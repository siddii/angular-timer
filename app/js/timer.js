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

        $scope.$on('timer-stop', function (){
          $scope.stop();
        });

        $scope.start = $element[0].start = function () {
          $scope.startTime = new Date();
          updateTime();
          updateLater();
        };

        $scope.stop = $element[0].stop = function () {
          $timeout.cancel($scope.timeoutId);
        };

        function updateTime() {
          $scope.timeTaken = new Date() - $scope.startTime;
          $scope.minutes = Math.floor($scope.timeTaken / (1000 * 60));
          $scope.seconds = Math.floor(($scope.timeTaken - ($scope.minutes * 60)) / 1000) % 60;
        }

        function updateLater() {
          $scope.timeoutId = $timeout(function () {
            updateTime();
            updateLater();
          }, $scope.interval);
        }

        $element[0].stop = function () {
          $timeout.cancel($scope.timeoutId);
        };

        $element.bind('$destroy', function () {
          $timeout.cancel($scope.timeoutId);
        });

        $scope.start();
      }
    };
  });