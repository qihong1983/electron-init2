import React from 'react';

// const electron = window.require('electron');



export default class Image extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			imageUrl: ''
		}
	}

	componentDidMount() {
		const electron = window.electron;

		console.log(window.electron, '***');

		const ipcRenderer = window.electron.ipcRenderer;

		ipcRenderer.on('image', (event, arg) => {
			console.log(event, arg);
			this.setState({
				imageUrl: arg
			});
		})
	}



	render() {
		return (
			<div>
				<img src={this.state.imageUrl} style={{ maxWidth: "1024px" }} />
			</div>
		);
	}
}