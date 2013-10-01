'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('Angular Timer E2E Tests', function () {

  beforeEach(function () {
    browser().navigateTo('/index.html');
  });

  it("Simple Timer - Should stop ticking when user clicks 'Stop' button", function () {
    sleep(1);
    element('#basic-timer button:last-child').click();
    var originalValue = null, currentValue = null;
    element('#basic-timer span').query(function (span, done) {
      originalValue = span.html();
      console.log('##### originalValue', originalValue);
      done();
    });
    sleep(1);
    element('#basic-timer span').query(function (span, done) {
      currentValue = span.html();
      console.log('##### currentValue', currentValue);
      done();
    });
  });

  it('Simple Timer - Should reset timer value when user click on start button again', function () {
    sleep(1);
    var oldValue = element('#basic-timer span').text();
    element('#basic-timer button:nth-child(3)').click();
    element('#basic-timer button:last-child').click();
    expect(element('#basic-timer span').text()).toBeLessThan(oldValue);
  });
});
