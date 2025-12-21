Note: It is recommended to have completed the Cancellable Interval question before attempting this question.

Solution
The complexity of this question lies in modelling the inner state of the interval, whether it's paused, running, or stopped (which is a terminal state) and how to modify the state correctly based on the methods.

Approach 1: Using a stopped boolean flag
We can have use variables, timerId and stopped to model all possible states:

If timerId is null, the interval is paused.
If timerId is non-null, the interval is running and the value is the ID of the timer.
If stopped is true, the interval has stopped and cannot be restarted, regardless of the timerId value.
In our start and pause functions, we first have to check if stopped is true and terminate if so.

In the start function, we have to first check if timerId != null, and terminate early as well, otherwise we will be running two intervals at the same time.

In the pause function, once we have determined the interval is not in the stopped state, call clearInterval(timerId) to stop the interval callback.

In the stop function, set stopped to true and call clearInterval(timerId) to stop the interval callback. It doesn't matter if the interval is still running because clearInterval(null) is a no-op.


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {{start: Function, pause: Function, stop: Function}}
 */
export default function createResumableInterval(callback, delay, ...args) {
  let timerId = null;
  let stopped = false;

  function start() {
    if (stopped || timerId != null) {
      return;
    }

    callback(...args);
    timerId = setInterval(callback, delay, ...args);
  }

  function clearTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function pause() {
    if (stopped) {
      return;
    }

    clearTimer();
  }

  function stop() {
    stopped = true;
    clearTimer();
  }

  return {
    start,
    pause,
    stop,
  };
}
We don't have to worry about this within the callback function because there's no option to pass a thisArg to setInterval unlike Array.prototype.forEach()/Array.prototype.reduce(). Read more about this on MDN.

Approach 2: State machine
With 3 states and 3 possible actions, modeling the state and actions with imperative logic is already starting to feel complicated. State machines are a declarative way to model state and the associated interactions. A state machine takes the current state and an action and returns the next state. We can then call the necessary logic based on the new state.

For this question, we have the following states and actions:

States: 'paused', 'stopped', 'running'
Actions: start(), pause(), stop()
We can define a stateMachine object where the top-level key is the current state, and the values are objects where the key is an action and value is the new state. Deriving the new state is simply const newState = stateMachine[state][action].

If the newState and the current state is the same, there's nothing to be done. Otherwise, we can perform the necessary logic based on the newState, either to stop the interval or start it. The exposed methods just have to call the nextState function with the corresponding action.

Although there's some duplication in the values of the key, it is much easier to determine at a glance that the state transitions are correct. Compare to the other approach, this state machine approach requires much fewer conditional statements and state assignment statements!


JavaScript

TypeScript

Open files in workspace

/**
 * @param {Function} callback
 * @param {number} delay
 * @param {...any} args
 * @returns {{start: Function, pause: Function, stop: Function}}
 */
export default function createResumableInterval(callback, delay, ...args) {
  let timerId;
  let state = 'paused';

  function nextState(action) {
    const newState = stateMachine[state][action];
    if (newState === state) {
      return;
    }

    state = newState;
    switch (state) {
      case 'paused':
      case 'stopped':
        clearInterval(timerId);
        timerId = null;
        return;
      case 'running':
        callback(...args);
        timerId = setInterval(callback, delay, ...args);
        return;
    }
  }

  return {
    start: () => nextState('start'),
    pause: () => nextState('pause'),
    stop: () => nextState('stop'),
  };
}

const stateMachine = {
  stopped: {
    pause: 'stopped',
    start: 'stopped',
    stop: 'stopped',
  },
  paused: {
    pause: 'paused',
    start: 'running',
    stop: 'stopped',
  },
  running: {
    pause: 'paused',
    start: 'running',
    stop: 'stopped',
  },
};
Resources
setInterval() | MDN