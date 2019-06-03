# PC桌面客户端脚手架 -- electron


## 环境

### 软件环境

| 程序 | 版本 |
| -- | -- |
| node | v11.0.0 |
| npm|  v6.4.1 |


### 第三库

| 库| 版本 |  说明 |
| --| -- |  -- |
|electron| v5.0.2 |  |
|electron-builder | 20.41.0 | 全局安装 |
|electron-updater| 4.0.0| 放到开发依赖里 dev -- dependencies |




## 运行
    
| 命令|   说明 | 
| -- | -- |
| npm start  | 运行前端脚本 |

### 本地开发 

| 命令|  |  说明 |
| -- | -- |  --  |
| npm start  | 运行前端脚本 |
| npm run electron-start | 运行客户端 | 

### 线上

| 命令 | 说明|
| -- |-- |
| npm run build | 代码压缩 |
| electron-builder | 打包 |
| 把dist里的内容全部copy 到 http服务器|  用来做软件更新 |

## osx

| 库|  说明|
| -- | -- |
|  electron-osx-sign| 全局安装 |

### 运行

> 生产环境需要注册apple开发者帐号

```shell
electron-osx-sign /Applications/xingsanhao.app --identity 'Mac Developer: 55377146@qq.com(8S22CQ8UK8)'
```



