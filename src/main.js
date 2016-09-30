const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const {app, BrowserWindow, Menu, Tray} = electron

const WIDTH = 570
const HEIGHT = 650

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray = null

function createTray () {
  tray = new Tray(path.join(__dirname, 'assets', 'menubar@2x.png'))
  tray.setPressedImage(path.join(__dirname, 'assets', 'menubar-white@2x.png'))
  createWindow(tray.getBounds())

  tray.on('click', function(event, bounds) {
    if (mainWindow) {
      mainWindow.close()
    } else {
      createWindow(bounds)
    }
  })
}



function createWindow (bounds) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    frame: false,
    x: bounds.x + bounds.width / 2 - WIDTH / 2,
    y: bounds.y + bounds.height + 10,
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createTray)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    // createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
