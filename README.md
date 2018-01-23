# Enzyme Lifecycle Emitter
*Status: pre-release*

## Problem
How can we make assertions in our test harness for values that are modified via async actions. Previously, there would just be explicit delays using `setTimeout` or `setInterval`, which would slow down the test suite and result in undefined behavior depending on how fast the mocks responded. 

## Solution
This library taps into the `React.Component` prototype or the provided `Component` prototype to create custom wrapper around the lifecycle methods. Whenever a component gets mounted and executes a `setState`, `componentDidUpdate`, etc. call, we intercept it, add an explicit callback, and emit events in the form of `<function>:<lifecycle>:<invocationCount>`. We then execute the original callback, if it exists. 


### Event Structure
Events for the lifecycle methods are emitted as both indexed and non-indexed events: `<function>:<lifecycle>` and `<function>:<lifecycle>:<invocationCount>`. This allows you to listen to every single lifecycle event, or pick and choose which ones you want to listen for. This is helpful if you know for certain when the component updates. 

### Example
Check out the test directly for examples on how to use it with `jest`