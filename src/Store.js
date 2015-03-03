'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var con = require('./util/console');

/**
 * Store class
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */
  constructor(methods, callback) {
    var self = this;
    this.callback = callback;
    this.__pending = false;
    this.__errors = [];
    if (process.env.NODE_ENV !== 'production' && methods.callback) {
      throw new Error('Invariant Violation: "callback" is a reserved name and cannot be used as a method name.');
    }
    if (process.env.NODE_ENV !== 'production' && methods.mixin) {
      throw new Error('Invariant Violation: "mixin" is a reserved name and cannot be used as a method name.');
    }
    assign(this, EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function () {
        if (!this.storeDidChange) {
          con.warn('A change handler is missing from a component with a Biff mixin. Notifications from Stores are not being handled.');
        }
        this.listener = ()=> { this.isMounted() && this.storeDidChange(); }
        this.errorListener = ()=> { this.isMounted() && this.storeError && this.storeError(); }
        self.addChangeListener(this.listener);
        self.addErrorListener(this.errorListener);
      },
      componentWillUnmount: function () {
        this.listener && self.removeChangeListener(this.listener);
        this.errorListener && self.removeErrorListener(this.errorListener);
      }
    }
  }

  /**
   * Returns dispatch token
   */
  getDispatchToken() {
    return this.dispatcherID;
  }

  /**
   * Returns a Store's "pending" state
   */
  getPending() {
    return this.__pending;
  }

  /**
   * Sets a Store's "pending" state
   */
  _setPending(pending) {
    this.__pending = pending;
  }

  /**
   * Returns a Store's "errors" array
   */
  getErrors() {
    return this.__errors;
  }

  /**
   * Adds an error to a Store's "errors" array
   */
  _setError(error) {
    this.__errors.push(error);
  }

  /**
   * Clears a Store's "errors" array
   */
  _clearErrors(error) {
    this.__errors.splice(0, this.errors.length);
  }

  /**
   * Emits change event
   */
  emitChange() {
    this.emit('change');
  }

  /**
   * Emits an error event
   */

  emitError() {
    this.emit('error', arguments);
  }

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  addChangeListener(callback) {
    this.on('change', callback);
  }

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

  /**
   * Adds an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  addErrorListener(callback) {
    this.on('error', callback);
  }

  /**
   * Removes an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  removeErrorListener(callback) {
    this.removeListener('error', callback);
  }

}

module.exports = Store;
