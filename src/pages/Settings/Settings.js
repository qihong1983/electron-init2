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


const {
	Header,
	Content,
	Footer
} = Layout;


// import axios from 'axios';

class Settings extends Component {
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
 		
	  			<Card>
	 				<List
				      header={<div>页头</div>}
				      footer={<div>页尾</div>}
				      bordered
				      dataSource={data}
				      renderItem={item => (<List.Item>{item}</List.Item>)}
				    />
	  			</Card>
    
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);