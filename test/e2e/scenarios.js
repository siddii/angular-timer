'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('timer directive', function() {

  beforeEach(function() {
    browser().navigateTo('../../index.html');
  });

  it('Simple timer', function() {
    sleep(2);
    var basicExample = angular.element('#timer1');
    console.log('######## basicExample = ', basicExample.html());
  });

});
