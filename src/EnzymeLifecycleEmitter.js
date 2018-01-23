const EventEmitter = require('events')
const React = require('react')
const enzyme = require('enzyme')

const mount = enzyme.mount

class EnzymeStateChangeEmitter extends EventEmitter {
    constructor(component, options){
        super()
        this.state = {
            component,
            methods: {}
        }

        this._prepareInterceptors([
            { name: 'setState', hasCallback: true, location: React.Component.prototype },
            { name: 'componentWillReceiveProps', hasCallback: false, location: component.prototype },
            { name: 'componentDidUpdate', hasCallback: false, location: component.prototype }
        ])
        
        return this
    }

    _prepareInterceptors(methods){
        
        const emit = (method, lifecycle) => {
            const callStack = this.state.methods[method].calls
            const context = {
                callCount: callStack.length,
                args: callStack[callStack.length - 1]
            }
            
            this.emit(`${method}:${lifecycle}`, context)
            this.emit(`${method}:${lifecycle}:${context.callCount}`, context)
        }

        const record = (method, args) => {
            this.state.methods[method].calls.push(args)
        }

        const intercept = (method, includeCallback, obj) => {
            const original = obj[method]
            
            obj[method] = function() {
                record(method, arguments)
                emit(method, 'begin')

                const _cb = () => {
                    emit(method, 'complete')
                    if (typeof arguments[1] === 'function'){
                        arguments[1]()
                    }
                }

                const args = [arguments[0]]

                if (includeCallback)
                    args.push(_cb)
                
                if (typeof original === 'function')
                    original.apply(this, args)
            }
        }
        
        methods.forEach(method => {
            this.state.methods[method.name] = { calls: [] }
            intercept(method.name, method.hasCallback, method.location)
        })

    }


    mount(){
        this.state.wrapper = mount(<this.state.component />)
        return this
    }

    get wrapper(){
        return this.state.wrapper
    }


}

module.exports = EnzymeStateChangeEmitter
