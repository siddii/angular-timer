'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('Angular Timer E2E Tests', function () {

  angular.scenario.dsl('futureValue', function() {
    return function(value) {
      return this.addFuture('value to future', function(done) {
        done(null, value);
      });
    };
  });

  angular.scenario.matcher('toHaveMoreSecondsThan', function(future) {
    function extractTime(value){
      return value.match(/\b\d+\b/g);
    }
    function totalSeconds(value) {
      return value[0]*3600*24 + value[1]*3600 + value[2]*60 + value[3];
    }
    var actualValue = extractTime(this.actual)
    var futureValue = extractTime(future.value);
    return totalSeconds(actualValue) > totalSeconds(futureValue);
  });

  angular.scenario.matcher('toCompareWith', function(future) {
    function getUnitValue (text, unitName) {
      var arr = text.toLowerCase().match(/\w+/g),
          returnVal,
          numInd= -1;
      arr.every(function (item,index,list) {
          if(isNaN(item)) {
            if(index===0) {
              numInd=1;
            }
            if(item === unitName) {
              returnVal = list[index+numInd];
              return false;
            }
          }
          return true;
      });
      return returnVal;
    }

    var unitVal = getUnitValue(this.future.timerText.value,this.future.unit),
        compareResultFlag=false;
    if(this.future.compareTo === 'GreaterThan') {
      compareResultFlag = Number(unitVal) > Number(future);
    } else if(this.future.compareTo === 'LessThan') {
      compareResultFlag = Number(unitVal) < Number(future);
    } else if(this.future.compareTo === 'EqualTo') {
      compareResultFlag = Number(unitVal) == Number(future);
    }

    return compareResultFlag;
  });

  beforeEach(function () {
    if (window.location.host.indexOf("github.io") > -1) {
      browser().navigateTo('/angular-timer/index.html');
    }
    else {
      browser().navigateTo('/index.html');
    }
  });


  it("Simple Timer - Should stop ticking when user clicks 'Stop' button", function () {
    sleep(1);
    element('#basic-timer button:last-child').click();
    var oldValue = null;
    element('#basic-timer timer span').query(function (span, done) {
      oldValue = span.html();
      done();
    });
    sleep(1);
    element('#basic-timer timer span').query(function (span, done) {
      expect(futureValue(oldValue)).toBe(span.html());
      done();
    });
  });

  it('Simple Timer - Should reset timer value when user click on start button again', function () {
    sleep(2);
    var oldValue = element('#basic-timer timer span').text();
    element('#basic-timer button:nth-child(3)').click();
    expect(element('#basic-timer span').text()).toBeLessThan(oldValue);
  });

  it('Clock Timer - with hours, minutes & seconds', function () {
    sleep(3);
    expect(element('#clock-timer timer').text()).toMatch(/0 hours/);
    expect(element('#clock-timer timer').text()).toMatch(/0 minutes/);
    expect(element('#clock-timer timer').text()).toMatch(/3 seconds./); //because of sleep(3);
  });

  it('Countdown Timer - Starts from 100', function () {
    expect(element('#countdown-timer timer span').html()).toBeLessThan(100);
  });

  it('Countdown Timer - Can have time added to it', function () {
    element('#countdown-timer button').click();
    expect(element('#countdown-timer timer span').html()).toBeLessThan(110);
    expect(element('#countdown-timer timer span').html()).toBeGreaterThan(100);
  });

  it('Autostart False Timer - Init from 0', function () {
    expect(element('#auto-start-false-timer timer span').html()).toBe('0');
    element('#auto-start-false-timer button:nth-child(3)').click();
    sleep(2);
    expect(element('#auto-start-false-timer timer span').html()).toBeGreaterThan(0);
    expect(element('#auto-start-false-timer timer span').html()).toBeLessThan(100);
  });

  it('End Time Timer - Ends at beginning of next year', function () {
    var beforeTime = element('#timer-with-end-time timer span').html();
    sleep(3);
    var afterTime = element('#timer-with-end-time timer span').html();
    expect(beforeTime).toHaveMoreSecondsThan(afterTime);
  });

  it('Plural / Singular Units - Should properly pluralize units', function () {
    expect(element('#plural-unit-timer .singular-counter timer').html()).toMatch(/1 day,/);
    expect(element('#plural-unit-timer .singular-counter timer').html()).toMatch(/1 hour,/);
    expect(element('#plural-unit-timer .singular-counter timer').html()).toMatch(/1 minute,/);
    expect(element('#plural-unit-timer .singular-counter timer').html()).toMatch(/1 second/);

    expect(element('#plural-unit-timer .plural-counter timer').html()).toMatch(/days,/);
    expect(element('#plural-unit-timer .plural-counter timer').html()).toMatch(/hours,/);
    expect(element('#plural-unit-timer .plural-counter timer').html()).toMatch(/minutes,/);
    expect(element('#plural-unit-timer .plural-counter timer').html()).toMatch(/seconds/);
  });

  it('Leading zero timer - should add a leading zero if number is smaller than 10', function() {
    sleep(1);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/00 hours,/);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/00 minutes,/);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/01 second/);
    sleep(10);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/00 hours,/);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/00 minutes,/);
    expect(element('#clock-timer-leading-zero timer').text()).toMatch(/11 seconds/);
  });

  it('Countdown finish - Should fire callback on completion', function () {
    expect(element('#finish-callback-timer .timer-status').html()).toBe('Running');
    expect(element('#finish-callback-timer .timer-callbacks').html()).toBe('0');

    sleep(5);
    expect(element('#finish-callback-timer .timer-status').html()).toBe('COMPLETE!!');
    expect(element('#finish-callback-timer .timer-callbacks').html()).toBe('1');

  });

  it('Start time with auto start', function() {
    expect(element('#start-time-and-auto-start-set timer span').html()).toBeGreaterThan(1000);
  });

  it('Countdown timer with maxTimeUnit- should display time value from lower to specified maxTimeUnit', function() {
    var timer1Val = element('#max-time-unit-countdown-timer .WithMaxTimeUnitAsMinute timer').text();
    expect(timer1Val).toMatch(/minutes/);
    expect(timer1Val).toMatch(/167/);
    expect(timer1Val).toMatch(/seconds/);
    expect(timer1Val).toMatch(/21/);

    var timer2Val = element('#max-time-unit-countdown-timer .WithMaxTimeUnitAsSecond timer').text();
    expect(timer2Val).toMatch(/minute/);
    expect(timer2Val).toMatch(/0/);
    expect(timer2Val).toMatch(/seconds/);
    expect(timer2Val).toMatch(/10041/);

    var timer3Val = element('#max-time-unit-countdown-timer .WithMaxTimeUnitAsYear timer').text();
    expect(timer3Val).toMatch(/years/);
    expect(timer3Val).toMatch(/03/);
    expect(timer3Val).toMatch(/months/);
    expect(timer3Val).toMatch(/02/);
    expect(timer3Val).toMatch(/days/);
    expect(timer3Val).toMatch(/22/);
    expect(timer3Val).toMatch(/hours/);
    expect(timer3Val).toMatch(/03/);
    expect(timer3Val).toMatch(/minute/);
    expect(timer3Val).toMatch(/40/);
    expect(timer3Val).toMatch(/second/);
    expect(timer3Val).toMatch(/00/);
  });

  it('i18n Countdown Timer - Spanish and French', function () {
      sleep(1);
      expect(element('#clock-timer-i18n #spanish timer').html()).toMatch(/segundo/);
      expect(element('#clock-timer-i18n #french timer').html()).toMatch(/seconde/);
  });

  it('Progress bar display', function () {
    sleep(1);
    expect(element('#progressbar-timer timer#countdown').html()).toMatch(/3.3%/);
  });

});
