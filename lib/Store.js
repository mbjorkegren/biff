"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var con = require("./util/console");

/**
 * Store class
 */

var Store = (function () {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */

  function Store(methods, callback) {
    _classCallCheck(this, Store);

    var self = this;
    this.callback = callback;
    this.pending = false;
    this.errors = [];
    if (process.env.NODE_ENV !== "production" && methods.callback) {
      throw new Error("Invariant Violation: \"callback\" is a reserved name and cannot be used as a method name.");
    }
    if (process.env.NODE_ENV !== "production" && methods.mixin) {
      throw new Error("Invariant Violation: \"mixin\" is a reserved name and cannot be used as a method name.");
    }
    assign(this, EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function componentDidMount() {
        var _this = this;

        if (!this.storeDidChange) {
          con.warn("A change handler is missing from a component with a Biff mixin. Notifications from Stores are not being handled.");
        }
        this.listener = function () {
          _this.isMounted() && _this.storeDidChange();
        };
        this.errorListener = function () {
          _this.isMounted() && _this.storeError && _this.storeError();
        };
        self.addChangeListener(this.listener);
        self.addErrorListener(this.errorListener);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.listener && self.removeChangeListener(this.listener);
        this.errorListener && self.removeErrorListener(this.errorListener);
      }
    };
  }

  _prototypeProperties(Store, null, {
    getDispatchToken: {

      /**
       * Returns dispatch token
       */

      value: function getDispatchToken() {
        return this.dispatcherID;
      },
      writable: true,
      configurable: true
    },
    getPending: {

      /**
       * Returns a Store's "pending" state
       */

      value: function getPending() {
        return this.pending;
      },
      writable: true,
      configurable: true
    },
    _setPending: {

      /**
       * Sets a Store's "pending" state
       */

      value: function _setPending(pending) {
        this.pending = pending;
      },
      writable: true,
      configurable: true
    },
    getErrors: {

      /**
       * Returns a Store's "errors" array
       */

      value: function getErrors() {
        return this.errors;
      },
      writable: true,
      configurable: true
    },
    _setError: {

      /**
       * Adds an error to a Store's "errors" array
       */

      value: function _setError(error) {
        this.errors.push(error);
      },
      writable: true,
      configurable: true
    },
    _clearErrors: {

      /**
       * Clears a Store's "errors" array
       */

      value: function _clearErrors(error) {
        this.errors.splice(0, this.errors.length);
      },
      writable: true,
      configurable: true
    },
    emitChange: {

      /**
       * Emits change event
       */

      value: function emitChange() {
        this.emit("change");
      },
      writable: true,
      configurable: true
    },
    emitError: {

      /**
       * Emits an error event
       */

      value: function emitError() {
        this.emit("error", arguments);
      },
      writable: true,
      configurable: true
    },
    addChangeListener: {

      /**
       * Adds a change listener
       *
       * @param {function} callback - Callback method for change event
       */

      value: function addChangeListener(callback) {
        this.on("change", callback);
      },
      writable: true,
      configurable: true
    },
    removeChangeListener: {

      /**
       * Removes a change listener
       *
       * @param {function} callback - Callback method for change event
       */

      value: function removeChangeListener(callback) {
        this.removeListener("change", callback);
      },
      writable: true,
      configurable: true
    },
    addErrorListener: {

      /**
       * Adds an error listener
       *
       * @param {function} callback - Callback method for error event
       */

      value: function addErrorListener(callback) {
        this.on("error", callback);
      },
      writable: true,
      configurable: true
    },
    removeErrorListener: {

      /**
       * Removes an error listener
       *
       * @param {function} callback - Callback method for error event
       */

      value: function removeErrorListener(callback) {
        this.removeListener("error", callback);
      },
      writable: true,
      configurable: true
    }
  });

  return Store;
})();

module.exports = Store;