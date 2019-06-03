import React, {
  Component
} from 'react';

import {
  Link,
  IndexLink
} from 'react-router';


import {
  connect
} from 'react-redux';


import {
  bindActionCreators
} from 'redux';


import * as actionCreators from '../../actions/userList/list';

import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Card
} from 'antd';

import './Contact.css';

const {
  Header,
  Content,
  Footer
} = Layout;


// import axios from 'axios';

class Contact extends Component {
  render() {

    // axios.get("https://www.easy-mock.com/mock/5a2dca93e9ee5f7c09d8c6d7/Aaa/tableNoChange?p=1")
    //   .then(response => {
    //     console.log('response');
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })

    console.log(this.props, 'this.props');

    return (
      <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['/contact']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="/">
          <IndexLink to="/" ><Icon type="team" />首页</IndexLink>
        </Menu.Item>
        <Menu.Item key="/contact">
          <IndexLink to="/contact"><Icon type="team" />联系我</IndexLink>
        </Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>

        <Menu.Item key="/contact/h1">
          <IndexLink to="/contact/h1" key="aa"><Icon type="team" />h1</IndexLink>
        </Menu.Item>
      </Menu>
       
    </Header>
    <Content>
      <Card>
      {this.props.children}
      </Card>
    </Content>
    
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact);