var app = angular.module('timer');

app.factory('progressBarService', function() {

  var ProgressBarService = function() {};

  /**
   * calculate the remaining time in a progress bar in percentage
   * @param {momentjs} startValue in seconds
   * @param {integer} currentCountdown, where are we in the countdown
   * @param {integer} remainingTime, remaining milliseconds
   * @param {integer} endTime, end time, can be undefined
   * @param {integer} coutdown, original coutdown value, can be undefined
   *
   * joke : https://www.youtube.com/watch?v=gENVB6tjq_M
   * @return {float} 0 --> 100
   */
  ProgressBarService.prototype.calculateProgressBar = function calculateProgressBar(startValue, remainingTime, endTimeAttr, coutdown) {
    var displayProgressBar = 0,
      endTimeValue,
      initialCountdown;

    remainingTime = remainingTime / 1000; //seconds


    if(endTimeAttr !== null){
      endTimeValue = moment(endTimeAttr);
      initialCountdown = endTimeValue.diff(startValue, 'seconds');
      displayProgressBar = remainingTime * 100 / initialCountdown;
    }
    else {
      displayProgressBar = remainingTime * 100 / coutdown;
    }

    displayProgressBar = 100 - displayProgressBar; //To have 0 to 100 and not 100 to 0
    displayProgressBar = Math.round(displayProgressBar * 10) / 10; //learn more why : http://stackoverflow.com/questions/588004/is-floating-point-math-broken

    if(displayProgressBar > 100){ //security
      displayProgressBar = 100;
    }

    return displayProgressBar;
  };

  return new ProgressBarService();
});
