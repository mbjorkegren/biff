// __tests__/Store-test.js

jest.dontMock('../Biff');
jest.dontMock('../Store');
jest.dontMock('../ActionsFactory');
jest.dontMock('../Action');
jest.dontMock('object-assign');

describe('Biff', function() {

  var Biff = require('../Biff');
  var Store = require('../Store');
  var ActionsFactory = require('../ActionsFactory');
  var Biff,mockStore,mockActionsFactory;

  Biff = new Biff();

  it('should instantiate a new dispatcher and attach it to the new instance', function() {

    expect(Biff.dispatcher).toBeDefined();

  });

  it('should create a new Store when createStore is called', function() {

    mockStore = Biff.createStore({testMethod: function(){}}, function(){});

    expect(mockStore instanceof Store).toEqual(true);

  });

  it('should store created Stores in a stores property', function() {

    expect(Biff.stores.indexOf(mockStore) !== -1).toEqual(true);

  });

  it('should register created Stores with the Dispatcher and store the token', function() {

    expect(mockStore.getDispatchToken()).toEqual("ID_1");

  });

  it('should create a new ActionsFactory when createActions is called', function() {

    mockActionsFactory = Biff.createActions({
      testMethod: function(test) {
        this.dispatch({
          actionType: 'TEST_ADD',
          data: test
        });
      }
    });

    expect(mockActionsFactory instanceof ActionsFactory).toEqual(true);

  });

  it('should store created ActionsFactory methods in an actions property', function() {

    expect("testMethod" in Biff.actions).toEqual(true);

  });

});