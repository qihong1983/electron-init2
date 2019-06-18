import React, {
  Component
} from 'react';
import './App.css';
// import axios from 'axios';
import io from 'socket.io-client';
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
  notification,
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

const shell = window.electron.shell;

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


    let socket = io('http://localhost:3001');
    socket.on('client/1234', function (obj) {
      // notification['success']({
      //   message: obj.msg.note,
      //   description: obj.msg.gender,
      // });

      //发送数据 
      ipcRenderer.send('app-outputWSData', obj);

    })


    //接收数据
    ipcRenderer.on('app-sendData', (event, arg, arg2) => {

      if (arg2 == 'add') {
        notification["success"]({
          message: '添加成功'
        });
      } else if (arg2 == 'edit') {
        notification["success"]({
          message: '修改成功'
        });
      }

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
        title: '已更新到最新版本，是否重新启动？',
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
  }


  clickHandle = (img) => {
    ipcRenderer.send('toggle-image', img);
  }

  initMenu = () => {
    EMenu.setApplicationMenu(null);
    // EMenu.setApplicationMenu(menu);

  }

  closeApp() {
    // alert(33);

    ipcRenderer.send('close-main');

  }

  openWebSite(img) {


    // shell.openExternal(img);
    ipcRenderer.send('webSiteData', img);
  }

  addAddress(e) {

    this.props.App_actions.setFormViewInfo({
      title: "添加应用",
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

        var data = {
          id: uuidv1(),
          title: values.title,
          address: values.address,
          sortTitle: values.title.substr(0, 2),
          color: this.props.App_reduces.background,
          isEdit: true
        }

        if (this.props.App_reduces.formViewInfo.flag === 'add') {

          data.id = uuidv1();
          ipcRenderer.send('app-addAddress', data);

        } else {

          data.id = this.props.App_reduces.editObj.id;
          ipcRenderer.send('app-editAddress', data);

        }


        this.props.form.resetFields();

        this.props.App_actions.setBackGround('#d8d8d8');

      }


    });
  };

  removeAllAddress(e) {

    confirm({
      title: '是否确定清空应用？',
      onOk() {
        ipcRenderer.send('app-removeAddress');
      },
      onCancel() { },
      cancelText: '取消',
      okText: '确定'
    });

  }

  removeCard(e) {


    let id = e.currentTarget.dataset.id;

    confirm({
      title: '是否确定删除此条应用？',
      onOk() {
        // console.log(event);

        ipcRenderer.send('app-removeCard', id);
      },
      onCancel() { },
      cancelText: '取消',
      okText: '确定'
    });

  }

  editAddress(e) {

    var oneData = _.find(this.props.App_reduces.items, (o) => {
      return o.id === e.currentTarget.dataset.id;
    });

    this.props.App_actions.setFormViewInfo({
      title: "修改应用",
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


  /**
   * 手动检测更新
   */
  checkForUpdate() {
    ipcRenderer.send('checkForUpdate');
  }

  render() {

    const { getFieldDecorator } = this.props.form;


    console.log(this.props, 'this.props');

    return (
      <Layout className="App" height={window.document.body.offsetHeight + 'px'}>
        <Header className="layout_header">
          <div className="banner" />
          <span className="checkUpdate" onClick={this.checkForUpdate.bind(this)}>检查更新{this.props.App_reduces.newVersion ? (<i className="checkTxing"></i>) : null}</span>
        </Header>
        <Content className="layout_content">

          <Card className="region-card" title="应用列表" extra={<div><Button type="primary" className="addressBtn" onClick={this.addAddress.bind(this)} icon="plus" size={'large'} >
            添加应用
          </Button>
            <Divider type="vertical" style={{ height: '39px' }} />
            <Button className="removeAllAddress" onClick={this.removeAllAddress.bind(this)} size={'large'} >
              清空应用
            </Button>
          </div>}>
            <List
              grid={{
                gutter: 112,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 6,
                xxl: 3,
              }}
              className="App-list"
              locale={{ "emptyText": "您尚未添加应用，点击【添加应用】去添加吧～" }}
              dataSource={this.props.App_reduces.items}
              renderItem={item => (
                <List.Item >
                  <Card className="itemCard" cover={<Avatar className="ava" onClick={() => this.openWebSite(item.address)} style={{ backgroundColor: item.color, marginRight: '16px', verticalAlign: 'middle' }} size={64}>
                    {item.sortTitle}
                  </Avatar>} extra={
                    item.isEdit ? (<div>
                      <Icon type="edit" style={{ marginRight: '8px' }} className="smallCardEdit" data-id={item.id} onClick={this.editAddress.bind(this)} />
                      <Icon type="close" data-id={item.id} className="smallCardClose" onClick={this.removeCard.bind(this)} />
                    </div>) : (<div style={{ visibility: "hidden" }}>占位</div>)
                  }>
                    <Meta title={item.title} description={item.address} />
                  </Card>
                </List.Item>
              )}
            />

          </Card>

          <Modal
            className="App-addressModal"
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


              <Form.Item label="应用地址">
                {getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    type: 'string',
                    message: '应用地址不能为空'
                  }, {
                    pattern: new RegExp('^(https?|http|file):\/\/(.+)(aleqipei.io|aleqipei.com|heqiauto.com|heqiauto.io|heqi.com|heqi.io).*$', 'g'),
                    message: '请正确输入应用地址(https://|http://)xxx.heqiauto.com'
                  }]
                })(
                  <Input
                    placeholder="http://erp.heiqiauto.com"
                  />,
                )}
              </Form.Item>
              <Form.Item label="颜色">

                <Button className="select-color-button" onClick={this.changeBC.bind(this)} style={{ marginRight: "16px" }}>选择颜色</Button>
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
        <Footer className="layout_footer">

          {/* {this.props.App_reduces.newVersion ? (
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
            } */}

          {/* <span className="footerInfo">版本 V1.0.0 www.阿乐汽配.com 2016-2019© All Rights Reserved</span>          */}
          <span className="footerInfo">版本 V{this.props.App_reduces.version} www.阿乐汽配.com 2016-2019© All Rights Reserved</span>
          <iframe
            style={{ width: '100%', overflow: 'visible' }}

            ref="iframe"
            src={"http://client.aleqipei.com"}
            // height={window.document.body.offsetHeight + 'px'}
            height={"0px"}
            scrolling="yes"
            frameBorder="0"
          />

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
