/**
 * 入口文件必需引用的库
 */

const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');
//动态更新
const { autoUpdater } = require('electron-updater');
//数据库
const Datastore = require('nedb');
//窗口配置信息
const Config = require('./config');

const _ = require(`lodash`);


/**
 * 数据库配置
 */
let data_db = new Datastore({
  filename: `${app.getPath('userData')}/nedb.db`,
  autoload: true
});

/**
 * 窗口变量
 */
let mainWindow;
let webSiteWindow;

/**
 * 主入口初始化选渲窗口
 * @method createWindow
 */
function createWindow() {


  //入口页面 -- 初始化窗口
  mainWindow = new BrowserWindow(Config.mwCfg());

  //打开站点 -- 初始化窗口
  webSiteWindow = new BrowserWindow(Config.wsCfg(mainWindow));

  //判断是打包前还是打包后 
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  webSiteWindow.loadURL(isDev ? 'http://localhost:3000/#/website' : `file://${path.join(__dirname, '../build/index.html#/website')}`);

  //调试
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    // mainWindow = null
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
  });

  //关闭打开浏览器的地址
  webSiteWindow.on('close', (e) => {
    e.preventDefault();
    webSiteWindow.hide();
  });

  //处理更新操作
  function handleUpdate() {
    const returnData = {
      error: { status: -1, msg: '检测更新查询异常' },
      checking: { status: 0, msg: '正在检查应用程序更新' },
      updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
      updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' },
    };

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

      setTimeout(function () {
        mainWindow.webContents.send('app-getNewVersion', true);
      }, 1000);
    });

    //当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      console.log(info, '没有发现新版本');
      setTimeout(function () {
        console.log('当前版本为最新版本');
        // sendUpdateMessage(returnData.updateNotAva)

        mainWindow.webContents.send('app-getVersionTime', info.version, info.releaseDate)
      }, 1000);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      console.log(progressObj, '进度');

      setTimeout(function () {
        mainWindow.webContents.send('app-downloadProgress', progressObj)
      }, 500)

    });


    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      ipcMain.on('isUpdateNow', (e, arg) => {
        //some code here to handle event
        autoUpdater.quitAndInstall();
      });



      // autoUpdater.quitAndInstall();



      // win.webContents.send('isUpdateNow')
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  }

  if (!isDev) {
    handleUpdate();
  }

}


// 启动渲染进程入口
app.on('ready', createWindow);


// 关闭app 触发这个事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// 这个事件不知道干什么用的 
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 打开web窗口
ipcMain.on('webSiteData', (event, webSiteData) => {
  webSiteWindow.show();
  webSiteWindow.webContents.send('website', webSiteData);
  webSiteWindow.maximize();
});


// 主窗口初始数据，触
ipcMain.on('app-getData', (event) => {
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
    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);
    });
  });
});


//添加地址
ipcMain.on('app-addAddress', (event, args) => {
  data_db.insert(args, function (err, new_doc) {
    "use strict";
    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);
    });
  });
})


//编辑地址
ipcMain.on('app-editAddress', (event, args) => {
  data_db.update({ id: args.id }, { $set: { title: args.title, address: args.address, color: args.color, sortTitle: args.sortTitle } }, { multi: true }, function (err, numReplaced) {
    data_db.find({}, function (err, docs) {
      mainWindow.webContents.send('app-sendData', docs);
    });
  });
})

//关掉窗口
ipcMain.on('close-main', (event, arg) => {
  mainWindow.close();
})

