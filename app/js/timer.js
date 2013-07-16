angular.module('timer', [])
    .directive('timer', function ($timeout, $compile) {
        return  {
            restrict: 'E',
            replace: false,
            scope: {
                interval: '=interval',
                countdownattr: '=countdown'
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
                    clearTimeout($scope.timeoutId);
                    $scope.timeoutId = null;
                };

                $element.bind('$destroy', function () {
                    $timeout.cancel($scope.timeoutId);
                });

                var tick = function () {
                    if ($scope.countdown > 0) {
                        $scope.countdown--;
                    }
                    else if ($scope.countdown <= 0) {
                        $scope.stop();
                    }

                    $scope.millis = new Date() - $scope.startTime;

                    if ($scope.countdown > 0) {
                        $scope.millis = $scope.countdown * 1000
                    }

                    $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
                    $scope.minutes = Math.floor((($scope.millis / (1000 * 60)) % 60));
                    $scope.hours = Math.floor((($scope.millis / (1000 * 60 * 60)) % 24));
                    // Workaround to allow e2e tests.
                    // We can't use $timeout which makes the e2e test to hang
                    // https://github.com/angular/angular.js/issues/2402
                    $scope.timeoutId = setTimeout(function () {
                        tick();
                        $scope.$apply();
                    }, $scope.interval);

                    $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
                };

                $scope.start();
            }
        };
    });
