angular.module('timer', [])
  .directive('timer', function ($timeout) {
    return  {
      restrict: 'E',
      template: "<h3>{{timeTaken}}</h3>",
      replace: false,
      scope: {interval: '=interval'},
      link: function ($scope, $element, $attrs) {

        var startTime = null;
        var timeoutId;

        $scope.start = $element[0].start = function (){
          startTime = new Date();
          updateTime();
          updateLater();
        };

        $scope.stop = $element[0].stop = function (){
          $timeout.cancel(timeoutId);
        };

        function updateTime() {
          $scope.timeTaken = new Date() - startTime;
          $scope.minutes = Math.floor($scope.timeTaken/ (1000 * 60));
          $scope.seconds = Math.floor(($scope.timeTaken - ($scope.minutes * 60)) / 1000) % 60;
        }

        function updateLater() {
          timeoutId = $timeout(function () {
            updateTime();
            updateLater();
          }, $scope.interval);
        }

        $element[0].stop = function (){
          $timeout.cancel(timeoutId);
        };

        $element.bind('$destroy', function () {
          $timeout.cancel(timeoutId);
        });

        $scope.start();
      }
    };
  })
  .filter('timerDisplay', function (dateFilter) {
    var ONE_SECOND = 1000; //in milliseconds
    var ONE_MINUTE = ONE_SECOND * 60;
    var TWO_MINUTE = ONE_MINUTE * 2;
    var ONE_HOUR = ONE_MINUTE * 60;
    return function (elapsedTime) {
      if (elapsedTime < ONE_SECOND) {
        return dateFilter(elapsedTime, "s 'second'");
      }
      else if (elapsedTime > ONE_SECOND && elapsedTime < ONE_MINUTE) {
        return dateFilter(elapsedTime, "s 'seconds'");
      }
      else if (elapsedTime > ONE_MINUTE && elapsedTime < TWO_MINUTE) {
        return dateFilter(elapsedTime, "m 'minute' & s 'seconds'");
      }
      else if (elapsedTime > TWO_MINUTE && elapsedTime < ONE_HOUR) {
        return dateFilter(elapsedTime, "m 'minutes' & s 'seconds'");
      }
      return dateFilter(elapsedTime, "h 'hour(s)', m 'minute(s)', s 'second(s)'");
    };
  });