"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Action class
 */

var Action = (function () {

  /**
   * Constructs an Action object
   *
   * @param {function} callback - Callback method for Action
   * @constructor
   */

  function Action(callback, dispatcher) {
    _classCallCheck(this, Action);

    this.callback = callback;
    this.dispatcher = dispatcher;
  }

  _prototypeProperties(Action, null, {
    dispatch: {

      /**
       * Calls callback method from Dispatcher
       *
       * @param {...*} arguments - arguments for callback method
       * @constructor
       */

      value: function dispatch() {
        var payload = this.callback.apply(this, arguments);
        if (process.env.NODE_ENV !== "production" && !payload.actionType) {
          throw new Error("Invariant Violation: Payload object requires an actionType property");
        }
        this.dispatcher.dispatch(payload);
      },
      writable: true,
      configurable: true
    }
  });

  return Action;
})();

module.exports = Action;