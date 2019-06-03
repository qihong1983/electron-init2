/**
 * 汇总和明细
 * @method getTableData
 * @param data {Object} 参数
 * @param dispatch {Function} 触发改变状态
 */
const getTableData = (data) => {

	console.log('###getTable参数###', data);

	return function(dispatch) {

		dispatch({
			type: "USER_LIST_OFFSET",
			payload: 2
		});

		dispatch({
			type: "USER_LIST_LIST",
			payload: 20
		});

	}
}

export {
	getTableData
}