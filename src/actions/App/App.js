
/**
 * 修改地址
 * @method editAddAddressVisible
 * @param {Boolean} data 
 */
const editAddAddressVisible = (data) => {

    return function (dispatch) {


        dispatch({
            type: "APP_EDITADDADDRESSVISIBLE",
            payload: data
        });

    }
}

/**
 * 填加地址
 * @method addAddressVisible
 * @param {Boolean} data 
 */

const addAddressVisible = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_ADDADDRESSVISIBLE",
            payload: data
        });
    }
}

/**
 * 选择表单颜色组件
 * @method setBackGround
 * @param {String} color
 */

const setBackGround = (data) => {
    return function (dispatch) {

        dispatch({
            type: "APP_BACKGROUND",
            payload: data
        })
    }
}

/**
 * 不知道这个是什么，不用代码里用到了
 * @method buttonChangeColorLogo
 * @param {Boolean} data
 */
const setButtonChangeColorLogo = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_BUTTONCHANGCOLORLOGO",
            payload: data
        })
    }
}

/**
 * 设置列表
 * @method setItems
 * @param {Array} items
 */

const setItems = (items) => {
    return function (dispatch) {

        items.forEach((v, k) => {
            if (v.isEdit != false) {
                v.isEdit = true;
            }
        });

        console.log(items, 'items');
        dispatch({
            type: "APP_ITEMS",
            payload: items
        })
    }
}


/**
 * 设置一个数据 
 * @method editObj
 * @param {Object} data
 */

const setEditObj = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_EDITOBJ",
            payload: data
        })
    }
}

/**
 * 设置版本
 * @method setVersion
 * @param {String} data
 */

const setVersion = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_VERSION",
            payload: data
        })
    }
}

/**
 * 设置发布时间
 * @method setSendVersionTime
 * @param {String} data
 */

const sendVersionTime = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_SENDVERSIONTIME",
            payload: data
        })
    }
}


/**
 * 是否发现新版本
 * @method setNewVersion
 * @param {Boolean} data
 */

const setNewVersion = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_NEWVERSION",
            payload: data
        })
    }
}


/**
 * 更新进度条的值
 * @method setPercent
 * @param {Number} data
 */
const setPercent = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_PERCENT",
            payload: data
        })
    }
}


/**
 * 是否显示按扭重启
 * @method setResetUpdate
 * @param {Boolean} data
 */

const setResetUpdate = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_RESETUPDATE",
            payload: data
        })
    }
}


/**
 * 表单信息
 * 
 * @method setFormViewInfo
 * @param {Object} data
 */
const setFormViewInfo = (data) => {
    return function (dispatch) {
        dispatch({
            type: "APP_FORMVIEWINFO",
            payload: data
        })
    }
}


export {
    //编辑地址
    editAddAddressVisible,
    //填加地址
    addAddressVisible,
    //选择表单颜色
    setBackGround,
    //不知道这个是干啥的了
    setButtonChangeColorLogo,
    //设置地址列表
    setItems,
    // 设置一个数据
    setEditObj,
    //置设版本
    setVersion,
    //设置发布时间
    sendVersionTime,
    //是否检测到新版本
    setNewVersion,
    //更新进度条的值
    setPercent,
    //是否显示按扭重启
    setResetUpdate,
    //设置表单信息
    setFormViewInfo
}