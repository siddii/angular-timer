function startTimer(sectionId) {
  document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
}

function stopTimer(sectionId) {
  document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
}


function addCDSeconds(sectionId, extraTime) {
  document.getElementById(sectionId).getElementsByTagName('timer')[0].addCDSeconds(extraTime);
}

function stopResumeTimer(sectionId, btn) {
  if (btn.innerHTML === 'Start') {
    document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
    btn.innerHTML = 'Stop';
  }
  else if (btn.innerHTML === 'Stop') {
    document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
    btn.innerHTML = 'Resume';
  }
  else {
    document.getElementById(sectionId).getElementsByTagName('timer')[0].resume();
    btn.innerHTML = 'Stop';
  }
}
angular.module('timer-demo',['timer']).controller('TimerDemoController',['$scope',  function ($scope) {
    $scope.linkAnchors = function () {
        $('ul.nav a').click(function (){
            var path = $(this).attr('href');
            if (path != '#') {
                window.location = path;
            }
        });
    };
    
    $scope.callbackTimer={};
    $scope.callbackTimer.status='Running';
    $scope.callbackTimer.callbackCount=0;    
    $scope.callbackTimer.finished=function(){
        $scope.callbackTimer.status='COMPLETE!!';
        $scope.callbackTimer.callbackCount++;
        $scope.$apply();
    };
}]);
