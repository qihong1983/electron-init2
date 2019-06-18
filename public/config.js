/**
 * 主窗口的配置
 */

const mwCfg = () => {

  return {
    width: 1024,
    height: 768,
    title: 'Ale Client',
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  };
};

/**
 * web站点窗口配置
 */

const wsCfg = (mainWindow) => {

  return {
    width: 1024,
    height: 681,
    title: 'Ale Client',
    parent: mainWindow,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  }
}

const Config = {
  'mwCfg': mwCfg,
  'wsCfg': wsCfg
}




module.exports = Config;