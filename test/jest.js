const React = require('react')
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const mount = enzyme.mount

enzyme.configure({ adapter: new Adapter() })

global.React = React
global.mount = mount