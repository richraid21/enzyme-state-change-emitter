# Enzyme State Change Emitter

## Problem
How can we make assertions in our test harness for values that are modified via async actions. Previously, there would just be explicit delays using `setTimeout` or `setInterval`, which would slow down the test suite and result in undefined behavior depending on how fast the mocks responded. 

## Solution
This library taps into the `React.Component` prototype to create custom wrapper around the `setState` method. Whenever a component gets mounted and executes a `setState` call, we intercept it, add an explicit callback, and emit events in the form of `<function>:<lifecycle>:<invocationCount>`. We then execute the original callback, if it exists. 


### Event Structure
Events for the `setState` method are emitted as emitted as both indexed and non-indexed events: `<function>:<lifecycle>` and `<function>:<lifecycle>:<invocationCount>`. This allows you to listen to every single lifecycle event, or pick and choose which ones you want to listen for. This is helpful if you know for certain when the component updates. 

### Example
The following example uses `jest` as the test harness. The component displays the current exchange rate of Bitcoin to USD. 
When the component runs, `componentDidMount` calls the price api and updates the state. Additionally, the component contains a button to manually increase the price. 

We first create an instance of the `StateChangeEmitter` by passing in our component under test.
Next, we register event listeners for the `setState` method and which call numbers we wish to listen to. 

On the final event listener, once we are satisfied with the assertions, we call `jest`'s asynchronous `done` function to indcate the test is complete. 
No explicit timeouts need to be provided.

```javascript
test('Combined render and update with async - new', (done) => {
        expect.assertions(3)

        const EnzymeStateChangeEmitter = require('./EnzymeStateChangeEmitter')
        const app = new EnzymeStateChangeEmitter(<App />)

        // The first invocation of setState has started
        app.on('setState:begin:1', (context) => {
            expect(app.wrapper.state('price')).toBe(0)
        })

        // The first invocation of setState has ended (the state is updated)
        app.on('setState:complete:1', (context) => {
            expect(app.wrapper.state('price')).toBe(50)
            app.wrapper.find('button').simulate('click')
        })

        // The second invocation of setState has ended (the state is updated)
        app.on('setState:complete:2', (context) => {
            expect(app.wrapper.state('price')).toBe(60)
            done()
        })

        app.mount()

    })
```