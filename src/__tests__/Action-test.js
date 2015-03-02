// __tests__/Action-test.js

jest.dontMock('../Action');
jest.dontMock('invariant');

describe('Action', function() {

  var Action = require('../Action');
  var dispatcher = {dispatch: jest.genMockFunction()};
  var mockAction;
  var callback;

  it('should attach the callback argument to the instance', function() {

    callback = function() {
      return;
    };

    mockAction = new Action(callback, dispatcher);

    expect(mockAction.callback).toBe(callback);

  });

  it('should attach the dispatcher.dispatch method to the instance', function() {

    expect(mockAction.dispatch).toBeDefined;

  });

});