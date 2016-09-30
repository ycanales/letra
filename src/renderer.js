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
nodeRequire('./main.controller')
nodeRequire('./lyrics.service')
