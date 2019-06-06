import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
// import axios from 'axios';
import {
  Link,
  IndexLink
} from 'react-router';


import moment from 'moment';


import {
  connect
} from 'react-redux';


import {
  bindActionCreators
} from 'redux';

import { SketchPicker } from 'react-color';


import * as actionCreators from './actions/userList/list';

import _ from 'lodash';

import QrcodeDecoder from 'qrcode-decoder';
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Card,
  Avatar,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Row,
  Col,
  List,
  Progress
} from 'antd';

const {
  Header,
  Content,
  Footer
} = Layout;


//确认弹出

const confirm = Modal.confirm;

const { Meta } = Card;

const electron = window.electron;

const ipcRenderer = window.electron.ipcRenderer;

const remote = window.electron.remote;

const EMenu = window.electron.remote.Menu;

const EMenuItem = window.electron.remote.MenuItem;

const path = require('path');

var fs = require("fs")

const app = window.electron.app;

const os = require('os');

var desktopCapturer = window.electron.desktopCapturer;

const electronScreen = window.electron.screen;




function determineScreenShotSize () {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  }

const thumbSize = determineScreenShotSize();
desktopCapturer.getSources({ types: ['window', 'screen'],thumbnailSize: thumbSize }).then(async sources => {
  for (const source of sources) {

    console.log(sources, 'sources');

    if (source.name === 'Screen 1') {

      console.log(os);
      const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
      console.log(os.tmpdir(), 'os.tmpdir()');
      console.log(fs);

      console.log(source.thumbnail, '*****####***');
      console.log(source.thumbnail.toPNG(), '*****####***');

      ipcRenderer.send('qrcodeImg',source.thumbnail.toPNG());
      


      // try {
      //   const stream = await navigator.mediaDevices.getUserMedia({
      //     audio: false,
      //     video: {
      //       mandatory: {
      //         chromeMediaSource: 'desktop',
      //         chromeMediaSourceId: source.id,
      //         minWidth: 1280,
      //         maxWidth: 1280,
      //         minHeight: 720,
      //         maxHeight: 720
      //       }
      //     }
      //   })
      //   handleStream(stream)
      // } catch (e) {
      //   handleError(e)
      // }
      return
    }
  }
});


//接收图片
ipcRenderer.on('app-getImg', (event, arg) => {

  console.log(arg, 'argarg');
  // var qr = new QrcodeDecoder();
  // qr.decodeFromImage("http://i6.hexunimg.cn/2014-01-15/161426168.jpg").then((res) => {
  //   console.log(res, '为什么');
  // });

  var qr = new QrcodeDecoder();
  qr.decodeFromImage(arg).then((res) => {
    console.log(res);
  });
});

function handleStream(stream) {
  console.log(stream, 'stream');
  const video = document.querySelector('video');
  video.srcObject = stream;

  console.log(video.srcObject);

  video.onloadedmetadata = (e) => video.play();


}

function handleError(e) {
  console.log(e)
}





//uuid
const uuidv1 = require('uuid/v1');





class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      addAddressVisible: false,
      editAddAddressVisible: false,
      background: '#e56045',
      buttonChangeColorLogo: false,
      items: [],
      editObj: null,
      url: null,
      version: '',
      sendVersionTime: '',
      newVersion: false,
      percent: 0,
      resetUpdate: false
    }
  }

  componentDidMount() {




    //检测更新 

    ipcRenderer.send('checkForUpdate');

    //发送数据 
    ipcRenderer.send('app-getData');

    //接收版本和时间
    ipcRenderer.on('app-getVersionTime', (event, arg, arg2) => {
      console.log(arg, 'arg');

      console.log(arg2, 'arg2');

      this.setState({
        version: arg,
        sendVersionTime: arg2
      });
    });



    //接收数据
    ipcRenderer.on('app-sendData', (event, arg, arg2) => {
      this.setState({
        items: arg,
        url: arg2
      })
    });


    //发现新版本
    ipcRenderer.on('app-getNewVersion', (event, arg) => {

      console.log('检测到新版本了吗');
      console.log(arg, '****');



      this.setState({
        newVersion: arg
      });
    });


    //下载进度条
    ipcRenderer.on('app-downloadProgress', (event, arg) => {

      console.log(arg, 'argargarg');
      if (arg.percent >= 100) {
        // confirm({
        //   title: '已更新到最新版本，是否重启启动？',
        //   content: '如果重新启动，您将使用最新版本',
        //   okText: '是',
        //   cancelText: '否',
        //   onOk() {
        //     ipcRenderer.send('isUpdateNow');
        //   },
        //   onCancel() { },
        // });


        this.setState({
          percent: parseInt(arg.percent, 10),
          newVersion: false,
          resetUpdate: true
        })
      } else {
        this.setState({
          percent: parseInt(arg.percent, 10)
        })
      }


    });

    //下载完成


    ipcRenderer.on('app-updateDownload', (event, arg) => {


      console.log('下载完成了出现这个');

      confirm({
        title: '已更新到最新版本，是否重启启动？',
        content: '如果重新启动，您将使用最新版本',
        okText: '是',
        cancelText: '否',
        onOk() {
          ipcRenderer.send('isUpdateNow');
        },
        onCancel() { },
      });


      this.setState({
        percent: 100,
        newVersion: false,
        resetUpdate: true
      })



    });

    // app-updateDownload'

    this.initMenu();
    this.contextmenuInit();
  }




  clickHandle = (img) => {


    ipcRenderer.send('toggle-image', img);

  }

  initMenu = () => {


    // const menu = EMenu.buildFromTemplate([{
    //   label: "File",
    //   submenu: [{
    //     label: "New Window"
    //   }, {
    //     label: "Settings",
    //     accelerator: "CmdOrCtrl+,",
    //     click: () => {


    //       ipcRenderer.send("toggle-settings");
    //     }
    //   }, {
    //     type: "separator"
    //   }, {
    //     label: "Quit",
    //     accelerator: "CmdOrCtrl+Q"
    //   }]
    // }, {
    //   label: "Edit",
    //   submenu: [{
    //     label: "Menu Item 1"
    //   }, {
    //     label: "Menu Item 2"
    //   }, {
    //     label: "Menu Item 3"
    //   }]
    // }]);
    // console.log(EMenu);
    EMenu.setApplicationMenu(null);
    // EMenu.setApplicationMenu(menu);

  }

  contextmenuInit = () => {

    const electron = window.electron;


    const ipcRenderer = window.electron.ipcRenderer;


    const remote = window.electron.remote;
    const Menu = window.electron.remote.Menu;
    const MenuItem = window.electron.remote.MenuItem;


    const menu = new EMenu();
    menu.append(new EMenuItem({
      label: '右键菜单一',
      click() {
        console.log('item 1 clicked')
      }
    }))

    menu.append(new EMenuItem({
      label: '右键菜单二',
    }))
    menu.append(new EMenuItem({
      type: 'separator'
    }))


    menu.append(new EMenuItem({
      label: '右键复选菜单二',
      type: 'checkbox',
      checked: true
    }))

    menu.append(new EMenuItem({
      label: '右键复选菜单三',
      type: 'checkbox',
      checked: true
    }))

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      // menu.popup({
      //   window: remote.getCurrentWindow()
      // })
    }, false)
  }

  closeApp() {
    // alert(33);

    ipcRenderer.send('close-main');

  }

  openWebSite(img) {


    ipcRenderer.send('webSiteData', img);
  }

  addAddress(e) {
    this.setState({
      addAddressVisible: true
    });
  }

  addAddressOk(e) {

    console.log(this.refs.addAddress);


    this.refs.addAddress.props.onSubmit();


  }

  addAddressCancel(e) {

    this.props.form.resetFields();
    this.setState({
      addAddressVisible: false
    });
  }

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };

  changeBC() {
    if (this.state.buttonChangeColorLogo) {
      this.setState({
        buttonChangeColorLogo: false
      })
    } else {
      this.setState({
        buttonChangeColorLogo: true
      })
    }
  }


  handleSubmit = e => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {

      //添加地址
      if (values.title && values.address && !err.address) {


        this.setState({
          addAddressVisible: false
        });

        var data = {
          id: uuidv1(),
          title: values.title,
          address: values.address,
          sortTitle: values.title.substr(0, 1),
          color: this.state.background
        }

        ipcRenderer.send('app-addAddress', data);

        this.props.form.resetFields();
        this.setState({
          background: '#e56045'
        });
      }


      //修改地址
      if (values.titleEdit && values.addressEdit && !err.addressEdit) {

        this.setState({
          editAddAddressVisible: false
        });


        var data = {
          id: this.state.editObj.id,
          title: values.titleEdit,
          address: values.addressEdit,
          sortTitle: values.titleEdit.substr(0, 1),
          color: this.state.background
        }
        ipcRenderer.send('app-editAddress', data);
        this.props.form.resetFields();
        this.setState({
          background: '#e56045'
        });
      }



    });
  };

  removeAllAddress(e) {


    ipcRenderer.send('app-removeAddress');

  }

  removeCard(e) {
    console.log(e.currentTarget.dataset.id, '****');

    ipcRenderer.send('app-removeCard', e.currentTarget.dataset.id);
  }

  editAddress(e) {
    console.log(e.currentTarget.dataset.id, '**');



    var oneData = _.find(this.state.items, (o) => {
      return o.id == e.currentTarget.dataset.id;
    });


    console.log(oneData, 'oneData');

    this.props.form.setFieldsValue({
      addressEdit: oneData.address,
      titleEdit: oneData.title
    })

    this.setState({
      editAddAddressVisible: true,
      editObj: oneData,
      background: oneData.color
    });

    console.log(oneData, 'oneData');


  }



  /**
   * 确认修改 
   */

  editAddressOk(e) {
    // debugger;
    this.refs.editAddAddress.props.onSubmit();
  }

  /**
   * 取消修改
   */
  editAddressCancel() {
    this.setState({
      editAddAddressVisible: false
    });

    this.props.form.resetFields();
  }



  resetUpdateBtn() {
    ipcRenderer.send('isUpdateNow');
  }

  render() {

    const { getFieldDecorator } = this.props.form;


    return (
      <Layout className="layout" height={window.document.body.offsetHeight + 'px'}>
        <Header>
          <div className="logo" />
        </Header>
        <Content>


          <Card className="region-card" title="地址列表" extra={<div><Button type="primary" onClick={this.addAddress.bind(this)} icon="plus" size={'large'} >
            添加地址
          </Button>
            <Divider type="vertical" style={{ height: '39px' }} />
            <Button className="removeAllAddress" onClick={this.removeAllAddress.bind(this)} size={'large'} >
              清空地址
            </Button>
          </div>}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              locale={{ "emptyText": "还没有添加地址" }}
              dataSource={this.state.items}
              renderItem={item => (
                <List.Item >
                  <Card className="itemCard" cover={<Avatar className="ava" onClick={() => this.openWebSite(item.address)} style={{ backgroundColor: item.color, marginRight: '16px', verticalAlign: 'middle' }} size={64}>
                    {item.sortTitle}
                  </Avatar>} extra={<div><Icon type="edit" style={{ marginRight: '8px' }} className="smallCardClose" data-id={item.id} onClick={this.editAddress.bind(this)} /><Icon type="close" data-id={item.id} className="smallCardClose" onClick={this.removeCard.bind(this)} /></div>}>
                    <Meta title={item.title} description={item.address} />
                  </Card>
                </List.Item>
              )}
            />

          </Card>

          <Modal
            className="editAddressModal"
            title="修改地址"
            visible={this.state.editAddAddressVisible}
            onOk={this.editAddressOk.bind(this)}
            onCancel={this.editAddressCancel.bind(this)}
            okText="确认修改"
            cancelText="取消修改"
          >
            <Form onSubmit={this.handleSubmit} ref="editAddAddress" className="login-form" layout={"horizontal"}>
              <Form.Item label="标题">
                {getFieldDecorator('titleEdit', {
                  rules: [{ required: true, message: '标题不能为空' }]
                })(
                  <Input
                    placeholder="这里输入标题"
                  />,
                )}
              </Form.Item>


              <Form.Item label="地址">
                {getFieldDecorator('addressEdit', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    type: 'string',
                    message: '地址不能为空'
                  }, {

                    pattern: new RegExp('^(https?|http|file):\/\/(.+)(aleqipei.io|aleqipei.com|heqiauto.com|heqiauto.io|heqi.com|heqi.io).*$', 'g'),
                    message: '请正确输入地址,开头必需https|http'

                  }]

                })(
                  <Input
                    placeholder="http://demo1.heqiauto.com"
                  />,
                )}
              </Form.Item>
              <Form.Item label="颜色">

                <Button className="select-color-button" style={{}} onClick={this.changeBC.bind(this)} style={{ marginRight: "16px" }}>选择颜色</Button>
                <Avatar style={{ backgroundColor: this.state.background, marginRight: '16px', verticalAlign: 'middle' }} size={39}>
                  例
          </Avatar>

                {
                  this.state.buttonChangeColorLogo ? (<SketchPicker style={{ marginTop: '16px' }}
                    color={this.state.background}
                    onChangeComplete={this.handleChangeComplete}
                  />) : null
                }

              </Form.Item>

            </Form>
          </Modal>

          <Modal
            className="addressModal"
            title="添加地址"
            visible={this.state.addAddressVisible}
            onOk={this.addAddressOk.bind(this)}
            onCancel={this.addAddressCancel.bind(this)}
            okText="确认添加"
            cancelText="取消添加"
          >
            <Form onSubmit={this.handleSubmit} ref="addAddress" className="login-form" layout={"horizontal"}>
              <Form.Item label="标题">
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '标题不能为空' }],
                })(
                  <Input
                    placeholder="这里输入标题"
                  />,
                )}
              </Form.Item>


              <Form.Item label="地址">
                {getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    type: 'string',
                    message: '地址不能为空'
                  }, {

                    pattern: new RegExp('^(https?|http|file):\/\/(.+)(aleqipei.io|aleqipei.com|heqiauto.com|heqiauto.io|heqi.com|heqi.io).*$', 'g'),
                    message: '请正确输入地址,开头必需https://|http://'

                  }]
                })(
                  <Input
                    placeholder="http://demo1.heiqiauto.com"
                  />,
                )}
              </Form.Item>
              <Form.Item label="颜色">

                <Button className="select-color-button" style={{}} onClick={this.changeBC.bind(this)} style={{ marginRight: "16px" }}>选择颜色</Button>
                <Avatar style={{ backgroundColor: this.state.background, marginRight: '16px', verticalAlign: 'middle' }} size={39}>
                  例
          </Avatar>

                {
                  this.state.buttonChangeColorLogo ? (<SketchPicker style={{ marginTop: '16px' }}
                    color={this.state.background}
                    onChangeComplete={this.handleChangeComplete}
                  />) : null
                }

              </Form.Item>

            </Form>
          </Modal>
        </Content>
        <Footer>
          <div>

            {this.state.newVersion ? (
              <div className="clearfix">
                <div className="left">检测到新版本，正在下载,请稍后:</div>
                <div className="left" style={{ width: "100px" }}>
                  <Progress percent={this.state.percent ? this.state.percent : 0} strokeColor={'#e56045'} status="active" />
                </div>
              </div>
            ) : this.state.resetUpdate ? (
              <button type="primary" onClick={this.resetUpdateBtn.bind(this)}>重启</button>
            ) : (
                  <span>
                    当前版本:{this.state.version}
                    (发布时间:{this.state.sendVersionTime ? moment(this.state.sendVersionTime).format('YYYY-MM-DD HH:mm:ss') : ''})
                  </span>
                )
            }



          </div>
        </Footer>
      </Layout>
    );
  }
}


//将state.counter绑定到props的counter
const mapStateToProps = (state) => {
  console.log(state, 'state');
  return {
    userList: state.userList
  }
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch, ownProps) => {

  //全量
  return bindActionCreators(actionCreators, dispatch);

};

App = Form.create({ name: 'normal_login' })(App);

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;