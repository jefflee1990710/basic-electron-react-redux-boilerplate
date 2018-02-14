'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path')
const url = require('url')
const BackgroundService = require('./libs/BackgroundService');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let bgService;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  prepareAppHome();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false,
    'minHeight': 300,
    'minWidth': 300
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
    bgService = new BackgroundService(mainWindow);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('readJwtToken', (event, arg) => {
  try{
    let token = fs.readFileSync(path.join(getUserHome(), '.rawduck', 'token'), 'utf8');
    console.log('Read token from app home : ', token);
    event.returnValue = token;
  }catch(err){
    console.log('Token not found in app home, return null!');
    event.returnValue = null;
  }
});

ipcMain.on('writeJwtToken', (event, arg) => {
  fs.writeFileSync(path.join(getUserHome(), '.rawduck', 'token'), arg);
  event.returnValue = null;
});

ipcMain.on('openImportDialog', (event, arg) => {
  dialog.showOpenDialog({
    filters: [
      {name: 'Images', extensions: ['jpg', 'jpeg']},
      {extensions : ['ARW'], name : 'Sony ARW'},
      {extensions : ['CR2'], name : 'Canon CR2'},
      {extensions : ['CRW'], name : 'Canon CRW'},
      {extensions : ['DCR'], name : 'Kodak DCR'},
      {extensions : ['DNG'], name : 'Digital Negative'},
      {extensions : ['ERF'], name : 'Epson ERF'},
      {extensions : ['K25'], name : 'Kodak K25'},
      {extensions : ['KDC'], name : 'Kodak KDC'},
      {extensions : ['MRW'], name : 'Minolta MRW'},
      {extensions : ['NEF'], name : 'Nikon NEF'},
      {extensions : ['ORF'], name : 'Olympus ORF'},
      {extensions : ['PEF'], name : 'Pentax PEF'},
      {extensions : ['RAF'], name : 'Fuji RAF'},
      {extensions : ['RAW'], name : 'RAW'},
      {extensions : ['SR2'], name : 'Sony SR2'},
      {extensions : ['SRF'], name : 'Sony SRF'},
      {extensions : ['X3F'], name : 'Sigma X3F'}
    ],
    properties: ['openFile', 'multiSelections']
  }, (filePaths) => {
    console.log(filePaths);
  })
});

const prepareAppHome = () => {
  createIfNotExist(path.join(getUserHome(), '.rawduck'))
}

const createIfNotExist = (path) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
}

const getUserHome = () => {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}