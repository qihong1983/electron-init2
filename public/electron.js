const electron = require('electron');

const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');

const { autoUpdater } = require('electron-updater');


console.log(isDev, 'isDev');


const remote = electron.remote;



// // Setup logger
// autoUpdater.logger = require('electron-log');
// autoUpdater.logger.transports.file.level = 'info';

// // console.log(autoUpdater, 'autoUpdate');

// autoUpdater.on('checking-for-update', () => {
//   // log.info('Checking for update...');

//   console.log('Checking for updates...');
// });






const Datastore = require('nedb');
let data_db = new Datastore({
  filename: `${app.getPath('userData')}/nedb.db`,
  autoload: true
});


// console.log(__dirname);

const _ = require(`lodash`);



let mainWindow;
let imageWindow;
let settingsWindow;


let webSiteWindow;



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: 'demo',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });

  //调试
  // mainWindow.webContents.openDevTools()

  //打开站点

  webSiteWindow = new BrowserWindow({
    width: 1024,
    height: 681,
    parent: mainWindow,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });


  // webSiteWindow.webContents.openDevTools()

  imageWindow = new BrowserWindow({
    width: 1024,
    height: 681,
    parent: mainWindow,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });

  // imageWindow.webContents.openDevTools()

  settingsWindow = new BrowserWindow({
    width: 200,
    height: 600,
    parent: mainWindow,
    show: false
  });


  // console.log(path.join(__dirname, '../build/index.html'));

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  imageWindow.loadURL(isDev ? 'http://localhost:3000/#/image' : `file://${path.join(__dirname, '../build/index.html#image')}`);
  settingsWindow.loadURL(isDev ? 'http://localhost:3000/#/settings' : `file://${path.join(__dirname, '../build/index.html#/settings')}`);
  webSiteWindow.loadURL(isDev ? 'http://localhost:3000/#/website' : `file://${path.join(__dirname, '../build/index.html#/website')}`);



  mainWindow.on('closed', () => mainWindow = null);

  imageWindow.on('close', (e) => {
    e.preventDefault();
    imageWindow.hide();
  });


  webSiteWindow.on('close', (e) => {
    e.preventDefault();
    webSiteWindow.hide();
  });

  settingsWindow.on('close', (e) => {
    e.preventDefault();
    settingsWindow.hide();
  });

  //处理更新操作
  function handleUpdate() {
    const returnData = {
      error: { status: -1, msg: '检测更新查询异常' },
      checking: { status: 0, msg: '正在检查应用程序更新' },
      updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
      updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' },
    };

    //和之前package.json配置的一样
    // autoUpdater.setFeedURL('http://127.0.0.1:8888');

    //更新错误
    autoUpdater.on('error', function (error) {
      console.log('更新出错');
      // sendUpdateMessage(returnData.error)
    });

    //检查中
    autoUpdater.on('checking-for-update', function (info) {
      console.log(info, '#################');
      console.log('检查中');
      // sendUpdateMessage(returnData.checking)
    });

    //发现新版本
    autoUpdater.on('update-available', function (info) {
      console.log('发现新版本');
      // sendUpdateMessage(returnData.updateAva)
    });

    //当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      console.log(info, '没有发现新版本');
      setTimeout(function () {
        console.log('当前版本为最新版本');
        // sendUpdateMessage(returnData.updateNotAva)
      }, 1000);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {

      console.log(progressObj, '进度');
      // mainWindow.webContents.send('downloadProgress', progressObj)
    });


    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      // ipcMain.on('isUpdateNow', (e, arg) => {
      //   //some code here to handle event
      //   autoUpdater.quitAndInstall();
      // });

      autoUpdater.quitAndInstall();
      // win.webContents.send('isUpdateNow')
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  }


  if (!isDev) {
    handleUpdate();
  }



}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


// ipcMain.on("checkForUpdate", () => {    //执行自动更新检查    
//   console.log("执行自动更新检查checked~~~")
//   autoUpdater.checkForUpdates()
// })


ipcMain.on('toggle-image', (event, arg) => {

  // mainWindow.destroy();
  // mainWindow.setContentSize(100, 100, true);

  // var width = mainWindow.getContentSize();

  mainWindow.setTitle('demo1');

  imageWindow.show();
  imageWindow.webContents.send('image', arg);

});

ipcMain.on('webSiteData', (event, webSiteData) => {

  // mainWindow.destroy();
  // mainWindow.setContentSize(100, 100, true);

  // var width = mainWindow.getContentSize();

  // webSiteWindow.setTitle('website');

  // webSiteWindow.loadURL(webSiteData);
  webSiteWindow.show();
  webSiteWindow.webContents.send('website', webSiteData);
  webSiteWindow.maximize();


});


//发过来的数据
ipcMain.on('app-getData', (event) => {

  //xxxxxx

  data_db.find({}, function (err, docs) {
    mainWindow.webContents.send('app-sendData', docs, `${process.cwd()}/nedb.db`);

  });



})

//清空所有数据

ipcMain.on('app-removeAddress', (event) => {

  data_db.remove({}, { multi: true }, function (err, numRemoved) {

    mainWindow.webContents.send('app-sendData', []);
  });


});

// 删除单条数据
// app-removeCard

ipcMain.on('app-removeCard', (event, args) => {




  data_db.remove({ id: args }, {}, function (err, numRemoved) {
    // numRemoved = 1


    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);

    });
  });


});

ipcMain.on('app-addAddress', (event, args) => {


  data_db.insert(args, function (err, new_doc) {
    "use strict";
    console.log(err, new_doc);

    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);

    });

    // mainWindow.webContents.send('app-sendData', new_doc);

  });

})

ipcMain.on('app-editAddress', (event, args) => {


  data_db.update({ id: args.id }, { $set: { title: args.title, address: args.address, color: args.color, sortTitle: args.sortTitle } }, { multi: true }, function (err, numReplaced) {
    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);

    });


  });


})
//app-editAddress

ipcMain.on('toggle-settings', () => {
  settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
})


ipcMain.on('close-main', (event, arg) => {

  // app.quit();
  mainWindow.close();

})

/**
 * windows上用
 */
//if (require('electron-squirrel-startup')) return;