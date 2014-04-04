describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/view1");
  });


  describe('jobRuns', function() {

    beforeEach(function() {
      browser().navigateTo('#/jobRuns');
    });


    it('should render jobRuns when user navigates to /jobRuns', function() {
      expect(element('#selectedJobRun').text()).
        toMatch(/ID: /);
    });

  });
});
