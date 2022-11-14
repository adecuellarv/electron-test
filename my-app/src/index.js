const { app, BrowserWindow, ipcMain, screen } = require('electron');
const Redirect = require('react-router-dom').Redirect;
const BrowserRouter = require('react-router-dom').BrowserRouter;
//const electronReload = require('electron-reload')
const path = require('path');

if (process.env.NODE_ENV !== "production") {
  require('electron-reload')(__dirname, {
    //electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let screen1Window, screen2Window;
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
    if(display?.bounds?.x < 0){
      return true;
    }else return false;
    //return display.bounds.x !== 0 || display.bounds.y !== 0
  })


  //Detecta pantalla 2
  if (externalDisplay) {
    screen1Window = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      title: "Pantalla equipo azul",
      fullscreen: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    //screen1Window.loadURL('https://github.com')
    screen1Window.loadFile(path.join(__dirname, 'pages/screen-azul.html'));

    // Open the DevTools.
    //screen1Window.webContents.openDevTools();
  } else {
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
    screen1Window.loadFile(path.join(__dirname, 'pages/screen-azul.html'));
    //screen1Window.webContents.openDevTools();
  }
};

const createThreeWindow = () => {

  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    //let screenDetected = false;
    if(display?.bounds?.x > 0){
      return true;
    }else return false;
    //return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  
  //Detecta pantalla 2
  if (externalDisplay) {
    screen2Window = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
      title: "Pantalla equipo rojo",
      fullscreen: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    screen2Window.loadFile(path.join(__dirname, 'pages/screen-rojo.html'));
    //screen2Window.webContents.openDevTools();
  } else {
    screen2Window = new BrowserWindow({
      width: 800,
      height: 700,
      title: "Pantalla equipo rojo",
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    screen2Window.maximize();
    screen2Window.loadFile(path.join(__dirname, 'pages/screen-rojo.html'));
    //screen2Window.webContents.openDevTools();
  }
};

app.on('ready', createWindow);
app.on('ready', createSecondWindow);
app.on('ready', createThreeWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    //createWindow();
    //createSecondWindow();
    createThreeWindow();
  }
});

ipcMain.on('main:createscreens', (e, statusScreen) => {
  if (!screen1Window) {
    createSecondWindow();
  }
  if (!screen2Window) {
    createThreeWindow();
  }
})

ipcMain.on('screen1:teamRed', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:teamRed', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:teamRedFailed', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:teamRedFailed', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:error', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:error', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:success', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:success', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:time', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:time', statusScreen);
  //screen1Window.close();
})

ipcMain.on('screen1:winner', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:winner', statusScreen);
})

ipcMain.on('screen1:startRamdomTeam', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:startRamdomTeam', statusScreen);
})

ipcMain.on('screen1:winRamdomTeam', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:winRamdomTeam', statusScreen);
})

ipcMain.on('screen1:startGame', (e, statusScreen) => {
  screen1Window.webContents.send('screen1:startGame', statusScreen);
})
//////////////////////////////
ipcMain.on('screen2:teamRed', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:teamRed', statusScreen);
  //screen2Window.close();
})

ipcMain.on('screen2:teamRedFailed', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:teamRedFailed', statusScreen);
  //screen2Window.close();
})

ipcMain.on('screen2:error', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:error', statusScreen);
  //screen2Window.close();
})

ipcMain.on('screen2:success', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:success', statusScreen);
  //screen2Window.close();
})

ipcMain.on('screen2:time', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:time', statusScreen);
  //screen2Window.close();
})

ipcMain.on('screen2:winner', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:winner', statusScreen);
})

ipcMain.on('screen2:startRamdomTeam', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:startRamdomTeam', statusScreen);
})

ipcMain.on('screen2:winRamdomTeam', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:winRamdomTeam', statusScreen);
})

ipcMain.on('screen2:startGame', (e, statusScreen) => {
  screen2Window.webContents.send('screen2:startGame', statusScreen);
})