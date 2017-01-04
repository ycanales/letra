// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer

window.nodeRequire = require
delete window.require
delete window.exports
delete window.module

const angular = nodeRequire('angular')
nodeRequire('angular-animate')
nodeRequire('angular-aria')
nodeRequire('angular-material')

nodeRequire('./app.module')
nodeRequire('./secret')
nodeRequire('./main.controller')
nodeRequire('./lyrics.service')

ipc.on('async', (event, arg) => {
  console.log('recibiento evento')
  console.log(arg)
  if (arg.type === 'analytics') {
    const {category, action, label, value} = arg.payload
    analytics.event(category, action, label, value)
  }
})
