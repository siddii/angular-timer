angular.module('timer', [])
  .directive('timer', function ($rootScope, $timeout, $compile) {
    return  {
      restrict: 'E',
      replace: false,
      scope: {
          interval: '=interval',
          countdownattr: '=countdown',
          intervaleventattr: '=intervalevent'
      },
      controller: function ($rootScope, $scope, $element) {
        if ($element.html().trim().length === 0) {
          $element.append($compile('<span>{{millis}}</span>')($scope));
        }

        $scope.startTime = null;
        $scope.timeoutId = null; 
        $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
        $scope.isRunning = false;
        $scope.intervalEventCount = 0;
        $scope.intervalEvent = $scope.intervaleventattr;

        $scope.$on('timer-start', function (){
          $scope.start();
        });

        $scope.$on('timer-resume', function (){
          $scope.resume();
        });

        $scope.$on('timer-stop', function (){
          $scope.stop();
        });
        
        //example only: consume specific events in your controller
        //$scope.$on('event:save', function () {
        //$scope.$on('event:refreshData', function () {
        $scope.$on($scope.intervalEvent, function () {
        		$scope.intervalEventCount++;
        		$scope.intervalEventName = $scope.intervalEvent        		
        });
        
        function resetTimeout() {
          if ($scope.timeoutId) {
            $timeout.cancel($scope.timeoutId);
          }  
        }

        $scope.start = $element[0].start = function () {
          $scope.startTime = new Date();
          resetTimeout();
          tick();
        };

        $scope.resume = $element[0].resume = function () {
          resetTimeout();
          $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
          tick();
        };

        $scope.stop = $element[0].stop = function () {
          $scope.stoppedTime = new Date();
          $timeout.cancel($scope.timeoutId);
          $scope.timeoutId = null;
        };

        $element.bind('$destroy', function () {
          $timeout.cancel($scope.timeoutId);
        });

        var tick = function (){
            if ($scope.countdown > 0) {
                $scope.countdown--;
            }
            else if ($scope.countdown <= 0) {
                $scope.stop();
            }

            $scope.millis = new Date() - $scope.startTime;
            $scope.seconds = Math.floor(($scope.millis / 1000) % 60) ;
            $scope.minutes = Math.floor((($scope.millis / (1000*60)) % 60));
            $scope.hours = Math.floor((($scope.millis / (1000*60*60)) % 24));
            
            if($scope.intervalEvent != undefined) {
            	$rootScope.$broadcast($scope.intervalEvent);
          	}
            
            $scope.timeoutId = $timeout(function () {
              tick();
            }, $scope.interval);

            $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
        };

        $scope.start();
      }
    };
  });