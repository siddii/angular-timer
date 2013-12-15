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
    expect(element('#clock-timer timer').html()).toMatch(/0 hours,/);
    expect(element('#clock-timer timer').html()).toMatch(/0 minutes,/);
    expect(element('#clock-timer timer').html()).not().toMatch(/0 seconds./);
  });

  it('Countdown Timer - Starts from 100', function () {
    expect(element('#countdown-timer timer span').html()).toBeLessThan(100);
  });

  it('Autostart False Timer - Init from 0', function () {
    expect(element('#auto-start-false-timer timer span').html()).toBe('0');
    element('#auto-start-false-timer button:nth-child(3)').click();
    sleep(2);
    expect(element('#auto-start-false-timer timer span').html()).toBeGreaterThan(0);
    expect(element('#auto-start-false-timer timer span').html()).toBeLessThan(100);
  });

  it('End Time Timer - Ends at beginning of 2014', function () {
    var beforeTime = element('#timer-with-end-time timer span').html();
    sleep(3);
    var afterTime = element('#timer-with-end-time timer span').html();
    expect(beforeTime).toHaveMoreSecondsThan(afterTime);
  });
});
