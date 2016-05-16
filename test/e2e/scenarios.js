'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('home page', function(){

  // it('should get a valid web page', function(){
  //   browser.get('http://localhost:8000/app');

  //   expect(browser.getLocationAbsUrl()).toBe('http://localhost:8000/app/index.html');

  // });

  it ('should have a title', function(){
    browser.get('http://localhost:8000/app');

    expect(browser.getTitle()).toEqual('My HTML File');
  });

});