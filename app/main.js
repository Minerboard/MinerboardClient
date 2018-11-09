const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow () {
	
	mainWindow = new BrowserWindow({
		width: 800,
		  height: 600,
		  // resizable: false,
		  // webPreferences: {
			//   zoomFactor: 1.5
		  // }
  })
  
  global.runtime = {
    isJustStarted: true
  }

  // mainWindow.setMenu(null);  // hide menu

  mainWindow.loadFile('static/auth.html')
  // mainWindow.loadFile('static/mining.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})