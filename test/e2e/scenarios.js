'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('timer directive', function() {

  beforeEach(function() {
      browser().navigateTo('angular-timer/index.html');
  });

  it('should stop when user click on stop button [Simple Timer]', function() {
      sleep(1);
      element('#basic-timer button:last-child').click();
      var oldValue = element('#basic-timer span').text();
      sleep(1);   
      expect( element('#basic-timer span').text() ).toBe( oldValue );
  });
  
  it('should be reset when user click on start button again [Simple Timer]', function() {
      sleep(1);
      var oldValue = element('#basic-timer span').text();
      element('#basic-timer button:nth-child(3)').click();
      element('#basic-timer button:last-child').click();
      expect( element('#basic-timer span').text() ).toBeLessThan( oldValue );
  });

});
