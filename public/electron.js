/**
 * 入口文件必需引用的库
 */

const electron = require('electron');
const ipcMain = electron.ipcMain;
const shell = electron.shell;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;
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

const Menu = electron.Menu;

const Notification = electron.Notification;


/*隐藏electron创听的菜单栏*/
Menu.setApplicationMenu(null);
const os = require('os');

var Jimp = require("jimp");

var QrCode = require('qrcode-reader');

/**
 * 页面列表数据库配置
 */
let data_db = new Datastore({
  filename: `${app.getPath('userData')}/nedb.db`,
  autoload: true
});



/**
 * 版本数据库配置
 */
let version_db = new Datastore({
  filename: `${app.getPath('userData')}/version.db`,
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
let tray = null
function createWindow() {





  //入口页面 -- 初始化窗口
  mainWindow = new BrowserWindow(Config.mwCfg());

  //打开站点 -- 初始化窗口
  webSiteWindow = new BrowserWindow(Config.wsCfg(mainWindow));

  //判断是打包前还是打包后 
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  webSiteWindow.loadURL(isDev ? 'http://localhost:3000/#/website' : `file://${path.join(__dirname, '../build/index.html#website')}`);

  //调试
  if (isDev) {
    mainWindow.webContents.openDevTools();
    // webSiteWindow.webContents.openDevTools();
  }
  // console.log(Notification.isSupported(), '是否支持桌面');

  mainWindow.flashFrame(true);
  mainWindow.setSkipTaskbar(false);

  // var notification = new Notification({
  //   title: "标题",
  //   body: "描述"
  // })

  // notification.show();




  webSiteWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // 设置保存路径,使Electron不提示保存对话框。
    // item.setSavePath('/tmp/save.pdf')

    console.log(item, 'item');
    console.log(webContents, 'webContents');



    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log(item.getSavePath(), '####')

        // .webContents.executeJavaScript("window.print()");

        shell.openItem(item.getSavePath());
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  });


  mainWindow.on('minimize', () => {
    console.log(11111);
    mainWindow.setSkipTaskbar(true);
    console.log(222222);

  })

  mainWindow.on('close', (event) => {

    console.log('closeed test');
    // mainWindow.setSkipTaskbar(false);
    // mainWindow = null;

    // event.preventDefault();
    // app.quit();

    // if (mainWindow.isMinimized()) {
    //   mainWindow = null;
    // } else {
    //   event.preventDefault();
    //   mainWindow.minimize();
    // }
    // event.preventDefault();
    // mainWindow.hide();

    // mainWindow = null


    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  //关闭打开浏览器的地址
  webSiteWindow.on('close', (e) => {
    e.preventDefault();
    webSiteWindow.hide();
  });

  //处理更新操作
  function handleUpdate() {


    //更新错误
    autoUpdater.on('error', function (error) {
      console.log('error');
      // sendUpdateMessage(returnData.error)
    });

    //检查中
    autoUpdater.on('checking-for-update', function () {
      // console.log('检查中');
      // sendUpdateMessage(returnData.checking)

      setTimeout(function () {
        version_db.find({}, function (err, updateInfo) {

          if (updateInfo != false) {
            mainWindow.webContents.send('app-getVersionTime', updateInfo[0].version, updateInfo[0].releaseDate)
          }

        });
      }, 1000);
    });

    //发现新版本
    autoUpdater.on('update-available', function (info) {
      // console.log('发现新版本');
      // sendUpdateMessage(returnData.updateAva)

      setTimeout(function () {
        mainWindow.webContents.send('app-getNewVersion', true);
      }, 1000);
    });

    //当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      setTimeout(function () {
        mainWindow.webContents.send('app-getNewVersion', false);
        version_db.find({}, function (err, versionInfo) {

          if (versionInfo == false) {

            var data = {
              version: info.version,
              releaseDate: info.releaseDate
            }
            version_db.insert(data, function (err, new_doc) {

              version_db.find({}, function (err, updateInfo) {

                mainWindow.webContents.send('app-getVersionTime', updateInfo[0].version, updateInfo[0].releaseDate)
              });
            });
          } else {

            version_db.update({}, { $set: { version: info.version, releaseDate: info.releaseDate } }, { multi: true }, function (err, numReplaced) {

              version_db.find({}, function (err, updateInfo) {

                mainWindow.webContents.send('app-getVersionTime', updateInfo[0].version, updateInfo[0].releaseDate)
              });
            });
          }

        });
      }, 1000);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      // console.log(progressObj, '进度');

      console.log(progressObj, '******');
      // setTimeout(function () {
      mainWindow.webContents.send('app-downloadProgress', progressObj)
      // }, 500)

    });


    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

      console.log('##############');


      setTimeout(function () {
        mainWindow.webContents.send('app-updateDownload', true);


        ipcMain.on('isUpdateNow', (e, arg) => {
          //some code here to handle event
          autoUpdater.quitAndInstall();
        });
      }, 1000)

    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
  }

  if (!isDev) {
    handleUpdate();


    ipcMain.on("checkForUpdate", (event, data) => {
      // console.log('执行自动更新检查!!!');
      // event.sender.send('reply', 'hi lee my name is yuan, age is 17');
      autoUpdater.checkForUpdates();
    });
  }



  tray = new Tray(path.join(__dirname, '32x32.png'));

  console.log(tray, 'traytraytraytray');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开', click: function () {
        // app.quit();
        // mainWindow.destroy();
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
      },
    }, {

      label: '退出',
      click: function (e) {
        // e.preventDefault();
        app.quit();
        // mainWindow.destroy();
      },
      selector: "terminate:"
    }
  ]);
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })
  tray.setToolTip('阿乐汽配客户端');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', (event) => {

    event.preventDefault();
    console.log('testtest');
    //主窗口显示隐藏切换


    mainWindow.show();
    // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    // mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  })
}




const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) myWindow.restore()
      mainWindow.focus()
    }
  })


  // 启动渲染进程入口
  app.on('ready', createWindow);
}




// 关闭app 触发这个事件
app.on('window-all-closed', () => {


  console.log('close-app');

  console.log(app, 'appappapp');



  app.quit();
  if (process.platform !== 'darwin') {
    console.log('window close');
    app.quit();
  }
});


// 这个事件不知道干什么用的 
app.on('activate', () => {

  console.log('1111111111');
  if (mainWindow == null) {
    createWindow();
  }
});

//接收图片
console.log('123123123')
ipcMain.on('qrcodeImg', (event, args) => {
  console.log('***************')
  // fs.writeFileSync(path.join(os.tmpdir(), 'screenshot.png'),  args,function (error) {
  fs.writeFile(path.join(os.tmpdir(), 'screenshot.png'), args, function (error) {

    console.log(path.join(os.tmpdir(), 'screenshot.png'), '*****');
    if (error) return console.log(error)

    var buffer = fs.readFileSync(path.join(os.tmpdir(), 'screenshot.png'));
    Jimp.read(buffer, function (err, image) {
      if (err) {
        console.error(err);
        // TODO handle error
      }
      var qr = new QrCode();
      qr.callback = function (err, value) {
        if (err) {
          console.error(err);
          // TODO handle error
        }
        // console.log(value.result);
        console.log(value, '#######');
      };
      qr.decode(image.bitmap);
    });


    mainWindow.webContents.send('app-getImg', path.join(os.tmpdir(), 'screenshot.png'));

  })
});

// qrcodeImg

// 打开web窗口
ipcMain.on('webSiteData', (event, webSiteData) => {
  console.log(webSiteData, 'webSiteData');
  webSiteWindow.show();
  webSiteWindow.webContents.send('website', webSiteData);
  webSiteWindow.maximize();
});


// 主窗口初始数据，触
ipcMain.on('app-getData', (event) => {
  data_db.find({}, function (err, docs) {

    console.log(docs, 'docs****');

    console.log(docs == false);

    console.log(docs);
    if (docs == false) {

      docs.push({
        id: "00000000-0000-0000-0000-000000000000",
        title: "和汽ERP",
        address: "http://erp.heqiauto.com",
        sortTitle: "和汽ERP".substr(0, 2),
        color: "#d8d8d8",
        isEdit: false
      });
      data_db.insert(docs, function (err, new_doc) {
        "use strict";

        console.log(new_doc);
        mainWindow.webContents.send('app-sendData', new_doc, `${process.cwd()}/nedb.db`);

      });
    } else {
      mainWindow.webContents.send('app-sendData', docs, `${process.cwd()}/nedb.db`);
    }





    // mainWindow.webContents.send('app-sendData', docs, `${process.cwd()}/nedb.db`);
  });
})

//清空所有数据
ipcMain.on('app-removeAddress', (event) => {
  data_db.remove({}, { multi: true }, function (err, numRemoved) {

    var tempArr = [];
    tempArr.push({
      id: "00000000-0000-0000-0000-000000000000",
      title: "和汽ERP",
      address: "http://erp.heqiauto.com",
      sortTitle: "和汽ERP".substr(0, 2),
      color: "#d8d8d8",
      isEdit: false
    });
    data_db.insert(tempArr, function (err, new_doc) {


      data_db.find({}, function (err, docs) {

        console.log(docs);
        mainWindow.webContents.send('app-sendData', docs);
      });
    });



    // console.log(err, numRemoved, '#####');






  });
});

// 删除单条数据
// app-removeCard
ipcMain.on('app-removeCard', (event, args) => {


  data_db.remove({ id: args }, {}, function (err, numRemoved) {
    console.log(args, 'argsargs');
    console.log(err, numRemoved, '###****###');
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
      mainWindow.webContents.send('app-sendData', docs, 'add');
    });
  });
})


//编辑地址
ipcMain.on('app-editAddress', (event, args) => {

  console.log(args, '*****');
  data_db.update({ id: args.id }, { $set: { title: args.title, address: args.address, color: args.color, sortTitle: args.sortTitle } }, { multi: true }, function (err, numReplaced) {

    console.log(err, numReplaced, '&&&&&&&&&&&&&&&&');

    data_db.find({}, function (err, docs) {

      console.log(docs, 'docs*****');
      mainWindow.webContents.send('app-sendData', docs, 'edit');
    });
  });
})

//关掉窗口
ipcMain.on('close-main', (event, arg) => {
  mainWindow.close();
})

ipcMain.on('app-outputWSData', (event, args) => {

  var notification = new Notification({
    title: args.msg.note,
    body: args.msg.gender
  })

  notification.show();
});

