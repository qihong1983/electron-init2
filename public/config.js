/**
 * 主窗口的配置
 */

const  mwCfg = () => {

    return {
        width: 900,
        height: 680,
        title: 'ale client',
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

    return  {
        width: 1024,
        height: 681,
        title: 'ale client',
        parent: mainWindow,
        show: false,
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true
        }
      }
}

const  Config = {
    'mwCfg': mwCfg,
    'wsCfg': wsCfg
}




module.exports = Config;