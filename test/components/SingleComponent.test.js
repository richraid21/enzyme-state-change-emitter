const LifecycleEmitter = require('../../src/EnzymeLifecycleEmitter')

describe('Single Component Tests', () => {
    let prototype
    let component
    
    beforeEach(() => {
        const path = './SingleComponent.js'

        const SingleComponent = require(path).default
        component = SingleComponent
    })

    test('It should emit a stateChange begin/complete event', (done) => {
        expect.assertions(2)

        const _render1 = new LifecycleEmitter(component)

        _render1.on('setState:begin:1', (context) => {
            expect(context.callCount).toBe(1)
        })

        _render1.on('setState:complete:1', (context) => {
            expect(context.callCount).toBe(1)
            done()
        })

        _render1.mount()
    })

    test('It should pass along the setState arguments', (done) => {
        expect.assertions(1)

        const _render1 = new LifecycleEmitter(component)

        _render1.on('setState:begin:1', (context) => {
            expect(context.args[0].hasOwnProperty('price')).toBe(true)
            done()
        })

        _render1.mount()
    })

    test('It should emit a componentDidUpdate', (done) => {
        expect.assertions(1)
        const _render1 = new LifecycleEmitter(component)
        
        _render1.on('componentDidUpdate:begin:1', (context) => {
            expect(_render1.wrapper.state('price')).toBe(80)
            done()
        })

        _render1.mount()
    })

    test('It should emit a componentWillReceiveProps', (done) => {
        expect.assertions(1)
        const _render1 = new LifecycleEmitter(component)
        const propUpdate = { new: 'Value' }
        
        _render1.on('componentWillReceiveProps:begin:1', (context) => {
            expect(context.args[0]).toEqual(propUpdate)
            done()
        })

        _render1.mount()
        _render1.wrapper.setProps(propUpdate)
    })
})