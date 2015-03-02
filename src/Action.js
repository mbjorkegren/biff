/**
 * Action class
 */
class Action {

  /**
   * Constructs an Action object
   *
   * @param {function} callback - Callback method for Action
   * @constructor
   */
  constructor(callback, dispatcher) {
    this.callback = callback;
    this.dispatch = dispatcher.dispatch.bind(dispatcher);
  }
}

module.exports = Action;