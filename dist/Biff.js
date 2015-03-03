!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Biff=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/Biff');
},{"./lib/Biff":4}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Action class
 */

var Action =

/**
 * Constructs an Action object
 *
 * @param {function} callback - Callback method for Action
 * @constructor
 */
function Action(callback, dispatcher) {
  _classCallCheck(this, Action);

  this.callback = callback;
  this.dispatch = dispatcher.dispatch.bind(dispatcher);
};

module.exports = Action;
},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Action = require("./Action");
var assign = require("object-assign");

/**
 * ActionsFactory class
 */

var ActionsFactory =

/**
 * Constructs an ActionsFactory object and translates actions parameter into
 * Action objects.
 *
 * @param {object} actions - Object with methods to create actions with
 * @constructor
 */

function ActionsFactory(actions, dispatcher) {
  _classCallCheck(this, ActionsFactory);

  var _actions = {};
  var a;
  var action;
  for (a in actions) {
    if (actions.hasOwnProperty(a)) {
      action = new Action(actions[a], dispatcher);
      _actions[a] = action.callback.bind(action);
    }
  }
  assign(this, _actions);
};

module.exports = ActionsFactory;
},{"./Action":2,"object-assign":11}],4:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Dispatcher = require("flux").Dispatcher;
var Store = require("./Store");
var ActionsFactory = require("./ActionsFactory");
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
  }

  _prototypeProperties(Biff, null, {
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    }
  });

  return Biff;
})();

module.exports = Biff;
},{"./ActionsFactory":3,"./Store":5,"flux":8,"object-assign":11}],5:[function(require,module,exports){
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
    this.callback = callback.bind(this);
    this._pending = false;
    this._errors = [];
    if ("production" !== "production" && methods.callback) {
      throw new Error("Invariant Violation: \"callback\" is a reserved name and cannot be used as a method name.");
    }
    if ("production" !== "production" && methods.mixin) {
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
        this.errorListener = function (event) {
          _this.isMounted() && _this.storeError && _this.storeError.call(_this, event);
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
        return this._pending;
      },
      writable: true,
      configurable: true
    },
    _setPending: {

      /**
       * Sets a Store's "pending" state
       */

      value: function _setPending(pending) {
        this._pending = pending;
      },
      writable: true,
      configurable: true
    },
    getErrors: {

      /**
       * Returns a Store's "errors" array
       */

      value: function getErrors() {
        return this._errors;
      },
      writable: true,
      configurable: true
    },
    _setError: {

      /**
       * Adds an error to a Store's "errors" array
       */

      value: function _setError(error) {
        this._errors.push(error);
      },
      writable: true,
      configurable: true
    },
    _clearErrors: {

      /**
       * Clears a Store's "errors" array
       */

      value: function _clearErrors(error) {
        this._errors.splice(0, this.errors.length);
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
},{"./util/console":6,"events":7,"object-assign":11}],6:[function(require,module,exports){
"use strict";

var SimpleConsole = require("simple-console");
module.exports = new SimpleConsole({
  noop: "production" === "production"
});
},{"simple-console":12}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":9}],9:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":10}],10:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],11:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var pendingException;
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}
	}

	if (pendingException) {
		throw pendingException;
	}

	return to;
};

},{}],12:[function(require,module,exports){
/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
(function (root) {
  // Patches
  var EMPTY_OBJ = {};
  var NOOP = function () {};

  // Console attributes
  var props = ["memory"];
  var meths = (
    "assert,clear,count,debug,dir,dirxml,error,exception,group," +
    "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles," +
    "profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace" +
    ",warn"
  ).split(",");

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
  // Global_Objects/Array/isArray
  var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };

  /**
   * Console abstraction.
   *
   * Provides a drop-in replacement for `console` with a few extras.
   *
   * @param {Object} opts       options object
   * @param {Object} opts.patch patch underlying `console`? (default: `true`)
   * @param {Object} opts.noop  have all methods be NOOP?   (default: `true`)
   */
  var SimpleConsole = function (opts) {
    var self = this;
    var i;

    // Starting state.
    var bind = self._getBind();
    var con = self._getConsole();
    var noConsole = !con; // Stash if console unavailable.

    // Protect variables.
    opts = opts || {};
    con = con || {};

    // Target: Add properties to console if patching.
    var target = {};
    if (opts.patch) {
      // Ensure that `window.console` is actually created, and set as target.
      target = window.console = window.console || target;
    }

    // Patch properties, methods.
    for (i = 0; i < props.length; i++) {
      // *Note*: Could consider _copying_ values.
      self[props[i]] = target[props[i]] = opts.noop ?
        EMPTY_OBJ :
        con[props[i]] || EMPTY_OBJ;
    }

    // Enable "apply" and "bind" on methods by converting to real function.
    // See: http://patik.com/blog/complete-cross-browser-console-log/
    for (i = 0; i < meths.length; i++) {
      // Set context _and_ the target.
      self[meths[i]] = target[meths[i]] = (function (methFn) {
        if (opts.noop || noConsole || !methFn) {
          // Noop cases.
          return NOOP;

        } else if (isArray(methFn)) {
          // Straight assign any array objects.
          // *Note*: Could do `.slice(0);` to clone.
          //
          // Fixes Safari on Mac OS X 10.9 on Sauce.
          // Issue is `console.profiles`, which is an array.
          // See: https://github.com/FormidableLabs/simple-console/issues/3
          // See: https://saucelabs.com/tests/9a89e381c91c4e43b25ab8ee16a514e1
          return methFn;

        } else if (bind) {
          // IE9 and most others: Bind to our create real function.
          // Should work if `console.FOO` is `function` or `object`.
          return bind.call(methFn, con);
        }

        // IE8: No bind, so even more tortured.
        return function () {
          Function.prototype.call.call(methFn, con,
            Array.prototype.slice.call(arguments));
        };
      })(con[meths[i]]);
    }
  };

  /**
   * Accessor to console object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   * @api private
   */
  var _console;
  SimpleConsole.prototype._getConsole = function () {
    if (typeof _console !== "undefined") { return _console; }
    _console = window.console || null;
    return _console;
  };

  /**
   * Accessor to bind object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   * @api private
   */
  var _bind;
  SimpleConsole.prototype._getBind = function () {
    if (typeof _bind !== "undefined") { return _bind; }
    _bind = Function.prototype.bind || null;
    return _bind;
  };

  // UMD wrapper: Borrowed from webpack version.
  /* istanbul ignore next */
  /*global exports define*/
  if (typeof exports === "object" && typeof module === "object") {
    // CommonJS
    module.exports = SimpleConsole;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return SimpleConsole;
    });
  } else {
    // VanillaJS / Old exports
    var mod = typeof exports === "object" ? exports : root;
    mod.SimpleConsole = SimpleConsole;
  }
})(this);

},{}]},{},[1])(1)
});