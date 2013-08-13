angular.module('timer', [])
    .directive('timer', ['$timeout', '$compile', function ($timeout, $compile) {
        return  {
            restrict: 'E',
            replace: false,
            scope: {
                interval: '=interval',
                startTimeAttr: '=startTime',
                countdownattr: '=countdown',
                autoStart: '=autoStart'
            },
            controller: function ($scope, $element) {
                if ($element.html().trim().length === 0) {
                    $element.append($compile('<span>{{millis}}</span>')($scope));
                }

                $scope.startTime = null;
                $scope.timeoutId = null;
                $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
                $scope.isRunning = false;

                $scope.$on('timer-start', function () {
                    $scope.start();
                });

                $scope.$on('timer-resume', function () {
                    $scope.resume();
                });

                $scope.$on('timer-stop', function () {
                    $scope.stop();
                });

                function resetTimeout() {
                    if ($scope.timeoutId) {
                        clearTimeout($scope.timeoutId);
                    }
                }

                $scope.start = $element[0].start = function () {
                    $scope.startTime = $scope.startTimeAttr ? new Date($scope.startTimeAttr) : new Date();
                    $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
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
                    resetTimeout();
                    $scope.$emit('timer-stopped', {millis: $scope.millis, seconds: $scope.seconds, minutes: $scope.minutes, hours: $scope.hours, days: $scope.days});
                    $scope.timeoutId = null;
                };

                $element.bind('$destroy', function () {
                    resetTimeout();
                });

                function calculateTimeUnits() {
                    $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
                    $scope.minutes = Math.floor((($scope.millis / (1000 * 60)) % 60));
                    $scope.hours = Math.floor((($scope.millis / (1000 * 60 * 60)) % 24));
                    $scope.days = Math.floor((($scope.millis / (1000 * 60 * 60)) / 24));
                }

                var tick = function () {

                    $scope.millis = new Date() - $scope.startTime;

                    if ($scope.countdown > 0) {
                        $scope.millis = $scope.countdown * 1000;
                    }

                    calculateTimeUnits();
                    if ($scope.countdown > 0) {
                        $scope.countdown--;
                    }
                    else if ($scope.countdown <= 0) {
                        $scope.stop();
                        return;
                    }

                    //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
                    $scope.timeoutId = setTimeout(function () {
                        tick();
                        $scope.$apply();
                    }, $scope.interval);

                    $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
                };

                if ($scope.autoStart == undefined || $scope.autoStart == true) {
                    $scope.start();
                }
            }
        };
    }]);
