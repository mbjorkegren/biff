"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

function withErrorLogging(f) {
  return function () {
    try {
      f.apply(this, arguments);
    } catch (e) {
      console.error(e.stack);
    }
  };
};

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
    this.callback = withErrorLogging(callback).bind(this);
    this._pending = false;
    this._errors = [];
    if (process.env.NODE_ENV !== "production" && methods.callback) {
      throw new Error("Invariant Violation: \"callback\" is a reserved name and cannot be used as a method name.");
    }
    if (process.env.NODE_ENV !== "production" && methods.mixin) {
      throw new Error("Invariant Violation: \"mixin\" is a reserved name and cannot be used as a method name.");
    }
    assign(this, EventEmitter.prototype, methods);
    this.setMaxListeners(0);
    this.mixin = {
      componentDidMount: function componentDidMount() {
        var _this = this;

        if (!this.storeDidChange) {
          console.warn("A change handler is missing from a component with a Biff mixin. Notifications from Stores are not being handled.");
        }
        this.listener = function (data) {
          _this.isMounted() && _this.storeDidChange(data);
        };
        this.errorListener = function (data) {
          _this.isMounted() && _this.storeError && _this.storeError(data);
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

  _createClass(Store, {
    getDispatchToken: {

      /**
       * Returns dispatch token
       */

      value: function getDispatchToken() {
        return this.dispatcherID;
      }
    },
    getPending: {

      /**
       * Returns a Store's "pending" state
       */

      value: function getPending() {
        return this._pending;
      }
    },
    _setPending: {

      /**
       * Sets a Store's "pending" state
       */

      value: function _setPending(pending) {
        this._pending = pending;
      }
    },
    getErrors: {

      /**
       * Returns a Store's "errors" array
       */

      value: function getErrors() {
        return this._errors;
      }
    },
    _setError: {

      /**
       * Adds an error to a Store's "errors" array
       */

      value: function _setError(error) {
        this._errors.push(error);
      }
    },
    _clearErrors: {

      /**
       * Clears a Store's "errors" array
       */

      value: function _clearErrors(error) {
        this._errors.splice(0, this._errors.length);
      }
    },
    emitChange: {

      /**
       * Emits change event
       */

      value: function emitChange() {
        this.emit("change", arguments[0]);
      }
    },
    emitError: {

      /**
       * Emits an error event
       */

      value: function emitError() {
        this.emit("error", arguments[0]);
      }
    },
    addChangeListener: {

      /**
       * Adds a change listener
       *
       * @param {function} callback - Callback method for change event
       */

      value: function addChangeListener(callback) {
        this.on("change", callback);
      }
    },
    removeChangeListener: {

      /**
       * Removes a change listener
       *
       * @param {function} callback - Callback method for change event
       */

      value: function removeChangeListener(callback) {
        this.removeListener("change", callback);
      }
    },
    addErrorListener: {

      /**
       * Adds an error listener
       *
       * @param {function} callback - Callback method for error event
       */

      value: function addErrorListener(callback) {
        this.on("error", callback);
      }
    },
    removeErrorListener: {

      /**
       * Removes an error listener
       *
       * @param {function} callback - Callback method for error event
       */

      value: function removeErrorListener(callback) {
        this.removeListener("error", callback);
      }
    }
  });

  return Store;
})();

module.exports = Store;