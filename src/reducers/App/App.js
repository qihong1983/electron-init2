/**
 * table数据状态
 * @method Table 
 * @param state {Object} 状态
 * @param action {Object} 动作
 */

const App = (state, action) => {

    //初始化
    if (typeof state === "undefined") {
        //初始化
        return {
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
        };
    }



    switch (action.type) {

        case "APP_ADDADDRESSVISIBLE":
            //填加菜单弹出层
            return Object.assign({}, state, {
                addAddressVisible: action.payload
            });

        case "APP_EDITADDADDRESSVISIBLE":

            //编辑弹出层
            return Object.assign({}, state, {
                editAddAddressVisible: action.payload
            });

        case "APP_BACKGROUND":
            return Object.assign({}, state, {
                background: action.payload
            });
        case "APP_BUTTONCHANGCOLORLOGO":
            return Object.assign({}, state, {
                buttonChangeColorLogo: action.payload
            });
        case "APP_ITEMS":
            return Object.assign({}, state, {
                items: action.payload
            });

        case "APP_EDITOBJ":
            return Object.assign({}, state, {
                editObj: action.payload
            });
        case "APP_URL":
            return Object.assign({}, state, {
                url: action.payload
            });
        case "APP_VERSION":
            return Object.assign({}, state, {
                version: action.payload
            });

        case "APP_SENDVERSIONTIME":
            return Object.assign({}, state, {
                sendVersionTime: action.payload
            });

        case "APP_NEWVERSION":
            return Object.assign({}, state, {
                newVersion: action.payload
            });
        case "APP_PERCENT":
            return Object.assign({}, state, {
                percent: action.payload
            });
        case "APP_RESETUPDATE":
            return Object.assign({}, state, {
                resetUpdate: action.payload
            });

        default:
            //返回初始化
            return state;
    }
}

export {
    App
}