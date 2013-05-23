angular.module('timer', [])
  .directive('timer', function ($timeout) {
    return  {
      restrict: 'E',
      template: "<h3>{{timeTaken}}</h3>",
      replace: false,
      scope: {interval: '=interval'},
      controller: function ($scope, $element) {

        $scope.startTime = null;
        $scope.timeoutId = null;

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