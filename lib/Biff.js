"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Dispatcher = require("flux").Dispatcher;
var Store = require("./Store");
var ActionsFactory = require("./ActionsFactory");
var FluxComponent = require("./FluxComponent");
var assign = require("object-assign");

/**
 * Main Biff Class
 */

var Biff = (function () {

  /**
   * Instatiates Biff along with actions object, stores array and sets
   * dispatcher to Dispatcher.
   *
   * @constructor
   */

  function Biff() {
    _classCallCheck(this, Biff);

    this.actions = {};
    this.stores = [];
    this.dispatcher = new Dispatcher();
    this.connect = FluxComponent;
  }

  _createClass(Biff, {
    createStore: {

      /**
       * Creates an instance of a Store, registers the supplied callback with the
       * dispatcher, and pushes it into the global list of stores
       *
       * @param {object} methods - Public methods for Store instance
       * @param {function} callback - Callback method for Dispatcher dispatches
       * @return {object} - Returns instance of Store
       */

      value: function createStore(methods, callback) {
        var store = new Store(methods, callback);
        store.dispatcherID = this.dispatcher.register(store.callback);
        this.stores.push(store);
        return store;
      }
    },
    createActions: {

      /**
       * Creates an instance of an ActionsFactory and adds the supplied actions
       * to the global list of actions
       *
       * @param {object} actions - Action methods
       * @return {object} - Returns instance of ActionsFactory
       */

      value: function createActions(actions) {
        var actionFactory = new ActionsFactory(actions, this.dispatcher);
        assign(this.actions, actionFactory);
        return actionFactory;
      }
    }
  });

  return Biff;
})();

module.exports = Biff;