const { app, BrowserWindow, ipcMain, screen } = require('electron');
const Redirect = require('react-router-dom').Redirect;
const BrowserRouter = require('react-router-dom').BrowserRouter;
//const electronReload = require('electron-reload')
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require

if (process.env.NODE_ENV !== "production") {
  require('electron-reload')(__dirname, {
    //electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let screen1Window;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    //fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'pages/home.html'));
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createSecondWindow = () => {
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  /*
  Detecta pantalla 2
  if (externalDisplay) {
    screen1Window = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
      title: "Video 1",
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    //screen1Window.loadURL('https://github.com')
    screen1Window.loadFile(path.join(__dirname, 'video1.html'));
  }

  */
  
  // Create the browser window.
  screen1Window = new BrowserWindow({
    width: 800,
    height: 700,
    title: "Pantalla equipo azul",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  screen1Window.maximize();
  // and load the index.html of the app.
  screen1Window.loadFile(path.join(__dirname, 'pages/screen-azul.html'));

  // Open the DevTools.
  //screen1Window.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', createSecondWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    createSecondWindow();
  }
});

ipcMain.on('screen1:teamRed', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:teamRed', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:teamRedFailed', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:teamRedFailed', statusScreen);
  //screen1Window.close();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
