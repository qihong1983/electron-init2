import React, {
  Component
} from 'react';
import './App.css';
// import axios from 'axios';

import moment from 'moment';

import {
  connect
} from 'react-redux';

import {
  bindActionCreators
} from 'redux';

import { SketchPicker } from 'react-color';


import * as actionCreators from './actions/App/App';

import _ from 'lodash';



import {
  Layout,
  Icon,
  Card,
  Avatar,
  Button,
  Divider,
  Modal,
  Form,
  Input,
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


const ipcRenderer = window.electron.ipcRenderer;


const EMenu = window.electron.remote.Menu;

const EMenuItem = window.electron.remote.MenuItem;

//uuid
const uuidv1 = require('uuid/v1');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: null
    }
  }

  componentDidMount() {


    //检测更新 

    ipcRenderer.send('checkForUpdate');

    //发送数据 
    ipcRenderer.send('app-getData');

    //接收版本和时间
    ipcRenderer.on('app-getVersionTime', (event, arg, arg2) => {



      this.props.App_actions.setVersion(arg);
      this.props.App_actions.sendVersionTime(arg2);

    });



    //接收数据
    ipcRenderer.on('app-sendData', (event, arg, arg2) => {

      this.props.App_actions.setItems(arg);
    });


    //发现新版本
    ipcRenderer.on('app-getNewVersion', (event, arg) => {

      this.props.App_actions.setNewVersion(arg);


    });


    //下载进度条
    ipcRenderer.on('app-downloadProgress', (event, arg) => {

      if (arg.percent >= 100) {

        this.props.App_actions.setNewVersion(false);

        this.props.App_actions.setPercent(parseInt(arg.percent, 10));

        this.props.App_actions.setResetUpdate(true);

      } else {

        this.props.App_actions.setPercent(parseInt(arg.percent, 10));

      }


    });

    //下载完成


    ipcRenderer.on('app-updateDownload', (event, arg) => {



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



      this.props.App_actions.setNewVersion(false);


      this.props.App_actions.setPercent(100);
      this.props.App_actions.setResetUpdate(true);




    });


    this.initMenu();
    this.contextmenuInit();
  }




  clickHandle = (img) => {
    ipcRenderer.send('toggle-image', img);
  }


  initMenu = () => {
    EMenu.setApplicationMenu(null);
    // EMenu.setApplicationMenu(menu);

  }

  contextmenuInit = () => {


    const menu = new EMenu();
    menu.append(new EMenuItem({
      label: '右键菜单一',
      click() {
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

    this.props.App_actions.setFormViewInfo({
      title: "添加地址",
      canelAddress: "取消添加",
      okAddress: "确认添加",
      flag: "add"
    });

    this.props.App_actions.addAddressVisible(true);
  }

  addAddressOk(e) {

    this.refs.addAddress.props.onSubmit();


  }

  addAddressCancel(e) {

    this.props.form.resetFields();

    this.props.App_actions.addAddressVisible(false);
  }

  handleChangeComplete = (color) => {

    this.props.App_actions.setBackGround(color.hex);
  };

  changeBC() {


    if (this.props.App_reduces.buttonChangeColorLogo) {

      this.props.App_actions.setButtonChangeColorLogo(false);
    } else {
      this.props.App_actions.setButtonChangeColorLogo(true);

    }
  }


  handleSubmit = e => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        this.props.App_actions.addAddressVisible(false);

        if (this.props.App_reduces.formViewInfo.flag == 'add') {

          var data = {
            id: uuidv1(),
            title: values.title,
            address: values.address,
            sortTitle: values.title.substr(0, 1),
            color: this.props.App_reduces.background
          }
          ipcRenderer.send('app-addAddress', data);
        } else {
          var data = {
            id: this.props.App_reduces.editObj.id,
            title: values.title,
            address: values.address,
            sortTitle: values.title.substr(0, 1),
            color: this.props.App_reduces.background
          }
          ipcRenderer.send('app-editAddress', data);
        }


        this.props.form.resetFields();

        this.props.App_actions.setBackGround('#e56045');

      }


    });
  };

  removeAllAddress(e) {


    ipcRenderer.send('app-removeAddress');

  }

  removeCard(e) {

    ipcRenderer.send('app-removeCard', e.currentTarget.dataset.id);
  }

  editAddress(e) {


    var oneData = _.find(this.props.App_reduces.items, (o) => {
      return o.id == e.currentTarget.dataset.id;
    });



    this.props.App_actions.setFormViewInfo({
      title: "修改地址",
      canelAddress: "取消修改",
      okAddress: "确认修改",
      flag: "edit"
    });

    this.props.form.setFieldsValue({
      address: oneData.address,
      title: oneData.title
    });

    this.props.App_actions.addAddressVisible(true);


    this.props.App_actions.setEditObj(oneData);

    this.props.App_actions.setBackGround(oneData.color);

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
              dataSource={this.props.App_reduces.items}
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
            className="addressModal"
            title={this.props.App_reduces.formViewInfo ? this.props.App_reduces.formViewInfo.title : ''}
            visible={this.props.App_reduces.addAddressVisible}
            onOk={this.addAddressOk.bind(this)}
            onCancel={this.addAddressCancel.bind(this)}
            okText={this.props.App_reduces.formViewInfo ? this.props.App_reduces.formViewInfo.okAddress : ''}
            cancelText={this.props.App_reduces.formViewInfo ? this.props.App_reduces.formViewInfo.canelAddress : ''}
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
                <Avatar style={{ backgroundColor: this.props.App_reduces.background, marginRight: '16px', verticalAlign: 'middle' }} size={39}>
                  例
          </Avatar>

                {
                  this.props.App_reduces.buttonChangeColorLogo ? (<SketchPicker style={{ marginTop: '16px' }}
                    color={this.props.App_reduces.background}
                    onChangeComplete={this.handleChangeComplete}
                  />) : null
                }

              </Form.Item>

            </Form>
          </Modal>
        </Content>
        <Footer>
          <div>
            {this.props.App_reduces.newVersion ? (
              <div className="clearfix">
                <div className="left">检测到新版本，正在下载,请稍后:</div>
                <div className="left" style={{ width: "100px" }}>
                  <Progress percent={this.props.App_reduces.percent ? this.props.App_reduces.percent : 0} strokeColor={'#e56045'} status="active" />
                </div>
              </div>
            ) : this.props.App_reduces.resetUpdate ? (
              <button type="primary" onClick={this.resetUpdateBtn.bind(this)}>重启</button>
            ) : (
                  <span>
                    当前版本:{this.props.App_reduces.version}
                    (发布时间:{this.props.App_reduces.sendVersionTime ? moment(this.props.App_reduces.sendVersionTime).format('YYYY-MM-DD HH:mm:ss') : ''})
                  </span>
                )
            }

          </div>
        </Footer>
      </Layout>
    );
  }
}


//将state绑定到props
const mapStateToProps = (state) => {
  return {
    App_reduces: state.Reducers.App
  }
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch, ownProps) => {

  //全量
  return {
    App_actions: bindActionCreators(actionCreators, dispatch)
  };

};

App = Form.create({ name: 'normal_login' })(App);

export default connect(mapStateToProps, mapDispatchToProps)(App);
