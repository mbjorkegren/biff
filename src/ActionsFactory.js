'use strict';

var Action = require('./Action');
var assign = require('object-assign');

/**
 * ActionsFactory class
 */
class ActionsFactory {

  /**
   * Constructs an ActionsFactory object and translates actions parameter into
   * Action objects.
   *
   * @param {object} actions - Object with methods to create actions with
   * @constructor
   */

  constructor(actions, dispatcher) {
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
  }
}

module.exports = ActionsFactory;
