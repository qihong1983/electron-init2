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
    Card,
    Switch,
    List
} from 'antd';

// const WebView = require('react-electron-webview');


// const WebView = require('react-electron-web-view');



const {
    Header,
    Content,
    Footer
} = Layout;


// import axios from 'axios';

class Website extends Component {

    constructor(props) {
        super(props);
        this.state = {
            websiteUrl: '',
            iFrameHeight: '0px'
        }
    }

    componentDidMount() {
        const electron = window.electron;

        const ipcRenderer = window.electron.ipcRenderer;

        ipcRenderer.on('website', (event, arg) => {


            this.setState({
                websiteUrl: arg,
                iFrameHeight: window.innerHeight + 'px'
            });
        })
    }
    render() {

        // axios.get("https://www.easy-mock.com/mock/5a2dca93e9ee5f7c09d8c6d7/Aaa/tableNoChange?p=1")
        //   .then(response => {
        //     console.log('response');
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   })

        console.log(this.props, 'this.props');

        const data = [
            (<div>设置1 -- <Switch defaultChecked /></div>),
            (<div>设置2 -- <Switch defaultChecked /></div>),
            (<div>设置3 -- <Switch defaultChecked /></div>),
            (<div>设置4 -- <Switch defaultChecked /></div>),
            (<div>设置5 -- <Switch defaultChecked /></div>),
        ];

        return (
            <Layout className="layout">

                {/* <Card>
                    <List
                        header={<div>{this.state.websiteUrl}</div>}
                        footer={<div>页尾</div>}
                        bordered
                        dataSource={data}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                    />
                </Card> */}
                {/* <WebView src={this.state.websiteUrl} /> */}

                {/* <webview src={this.state.websiteUrl}></webview> */}
                {/* <WebView src="http://demo1.heqi.io" ></WebView> */}

                {/* <WebView src="http://demo1.heqi.io" style={{ width: "1000px", height: "1000px" }} /> */}

                {/* <iframe
                    style={{ width: '100%', height: '1000px', overflow: 'visible' }}
                    onLoad={() => {
                        const obj = ReactDOM.findDOMNode(this);
                        this.setState({
                            "iFrameHeight": obj.contentWindow.document.body.scrollHeight + 'px'
                        });
                    }}
                    ref="iframe"
                    src="http://demo1.heqi.io"
                    width="100%"
                    height={'1000px'}
                    scrolling="no"
                    frameBorder="0"
                /> */}


                <iframe
                    style={{ width: '100%', overflow: 'visible' }}
                    onLoad={() => {
                        const obj = this.refs.iframe;

                        console.log(this);
                        console.log(obj, 'obj');

                        console.log(obj.contentWindow.window, '******');
                        console.log(window.outerHeight, '####');
                        // debugger;
                        // this.setState({
                        //     "iFrameHeight": obj.contentWindow.document.body.scrollHeight + 'px'
                        // });

                        this.setState({
                            "iFrameHeight": window.innerHeight + 'px'
                        });

                        // width={window.document.body.offsetWidth - 500 + 'px'}
                    }}
                    ref="iframe"
                    src={this.state.websiteUrl}
                    // height={window.document.body.offsetHeight + 'px'}
                    height={this.state.iFrameHeight}
                    scrolling="yes"
                    frameBorder="0"
                />

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

export default connect(mapStateToProps, mapDispatchToProps)(Website);