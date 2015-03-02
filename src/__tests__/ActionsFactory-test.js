// __tests__/ActionsFactory-test.js

jest.dontMock('../ActionsFactory');
jest.dontMock('../Action');
jest.dontMock('object-assign');

describe('ActionsFactory', function() {

  var ActionsFactory = require('../ActionsFactory');
  var mockActionsFactory;
  var dispatcherStub = {
    dispatch: function() {
      return;
    }
  };

  it('create new Actions and return an object with the supplied method names as callers', function() {

    mockActionsFactory = new ActionsFactory({
      testMethodA: function(){
        this.dispatch({
          actionType: 'TEST_ACTION_A',
          data: arguments
        })
      },
      testMethodB: function(){
        this.dispatch({
          actionType: 'TEST_ACTION_B',
          data: arguments
        });
      }
    }, dispatcherStub);

    expect(mockActionsFactory.testMethodA).toBeDefined();
    expect(mockActionsFactory.testMethodB).toBeDefined();

  });

});