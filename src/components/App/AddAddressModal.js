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

import * as actionCreators from '../actions/App/App';

import _ from 'lodash';


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


class AddAddressModal extends Component {

  constructor(props) {
    super(props);

  }


  render() {

    const { getFieldDecorator } = this.props.form;
    return (


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
    )
  }

}


//将state绑定到props
const mapStateToProps = (state) => {
  console.log(state, 'state');
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

App = Form.create({ name: 'normal_login' })(AddAddressModal);

export default connect(mapStateToProps, mapDispatchToProps)(AddAddressModal);
