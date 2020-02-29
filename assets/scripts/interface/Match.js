// var mvs = require("../MatchvsLib/Matchvs");
// var GameData = require('../MatchvsLib/ExamplesData');
var engine = require('../MatchvsLib/MatchvsEngine');
var response = require("../MatchvsLib/MatchvsResponse");
var msg = require("../MatchvsLib/MatvhsvsMessage");
var GameData = require('../MatchvsLib/ExamplesData');

cc.Class({
    extends: cc.Component,

    properties: {
        playerNameOne: {
            default: null,
            type: cc.Label
        },
        playerNameTwo: {
            default: null,
            type: cc.Label
        },
        playerTwoLayout: cc.Layout,
        playerTwoLabel : cc.Label,
        // playerNameThree: {
        //     default: null,
        //     type: cc.Label
        // },
        // playerThreeLayout:cc.Layout,
        // playerThreeLabel : cc.Label,
        labelRoomID: {
            default: null,
            type: cc.Label
        },
        matchingWay: {
            default: null,
            type: cc.Label
        },
        labelUserID2:cc.Label,
        // labelUserID3:cc.Label,
        back: cc.Node,
        joinopen: cc.Node,
        nickName:cc.Label,
        userList :[],
        nameViewList:[],
        userIDfontSize:26,
        userInfo:[],
        totolUser:[],
        foodCount: 8,
        gap: 100,
        foodSize: 56,
        // sendEventButton:cc.Button
    },


    onLoad: function () {

        this.initMatchvsEvent(this);
        // this.sendEventButton.node.on('click', this.sendEvent, this);
        this.totolUser.push(GameData.userInfo)
        console.log(GameData.userInfo);
        // // this.userInfo = GameData.userInfo;
        // // console.log(this.userInfo);
        // let self = this;
        this.nickName.string = '用户ID：'+ GameData.userID;
        var result = engine.prototype.joinRandomRoom(2,JSON.stringify(GameData.userInfo));
        console.log(result);
        this.playerNameOne.string = GameData.name;
        // // if(result == 0 ){
        // //     cc.director.loadScene('Match');
        // // }
        // console.log("随机匹配result"+result);
        // mvs.response.joinRoomResponse = (status, roomUserInfoList, roomInfo)=>{
        //     console.log(status);

        //     console.log(roomUserInfoList);
        //     console.log(roomInfo);
        //     this.userInfo.push(GameData.userInfo);
        //     console.log(GameData.userInfo);
        //     if(status == 200){
        //         this.labelRoomID.string = roomInfo.roomID;
        //         if(roomUserInfoList.length !=0){
        //            this.playerTwoLabel.string = roomUserInfoList[0].userID;
        //            this.userInfo.push(JSON.parse(roomUserInfoList[0].userProfile));
        //         }
        //         console.log(this.userInfo);
        //         if(this.userInfo.length == 2){
        //             this.joinOver();
        //             // this.sendMessage()
        //             // this.startGame()
        //             mvs.response.sendEventResponse = (sendEventRsp)=>{
        //                 console.log(sendEventRsp)
        //             }
        //             mvs.response.sendEventNotify = (eventInfo)=>{
        //                 console.log(eventInfo)
        //                 //eventInfo.srcUserID 发送数据 eventInfo.cpProto
        //             }
        //             mvs.response.gameServerNotify = (eventInfo)=>{
        //                 console.log(eventInfo)
        //                 //gameServer 推送了消息 eventInfo.cpProto
        //             }
        //             var result = mvs.engine.sendEvent('你使出一招:' + '19090909');
        //             console.log(result)

        //         }
        //         //成功
        //     }else{
        //         //失败
        //     }
        // }





    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self) {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
    },
    /**
     * 进入房间回调
     * @param status
     * @param userInfoList
     * @param roomInfo
     */
    joinRoomResponse(status, userInfoList, roomInfo) {
        console.log(status)
        console.log(userInfoList)
        console.log(roomInfo)
        if (status == 200) {
            let po = this.foodPosition()
            GameData.foodPosition = po;
            this.sendEvent(po);
            this.labelRoomID.string = "房间ID为:"+roomInfo.roomID;

            console.log('joinRoomResponse: 进入房间成功：房间ID为：' + roomInfo.roomID + '房主ID：' + roomInfo.ownerId + '房间属性为：' + roomInfo.roomProperty);
            for (var i = 0; i < userInfoList.length; i++) {
                console.log('joinRoomResponse：房间的玩家ID是' + userInfoList[i].userID);
            }
            if (userInfoList.length == 0) {
                console.log('joinRoomResponse：房间暂时无其他玩家');
            }
            if(userInfoList.length!=0){
                this.totolUser.push(JSON.parse(userInfoList[0].userProfile))
                this.playerNameTwo.string = JSON.parse(userInfoList[0].userProfile).name;
                GameData.totolUser = this.totolUser;

                console.log(po)
                this.startGame()
            }
        } else {
            console.log('joinRoomResponse：进入房间失败');
        }
    },
    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo) {
        this.playerNameTwo.string = JSON.parse(roomUserInfo.userProfile).name;
        this.totolUser.push(JSON.parse(roomUserInfo.userProfile))
        GameData.totolUser = this.totolUser;
        this.startGame();
        console.log('joinRoomNotify：加入房间的玩家ID是' + roomUserInfo.userID);
    },
    /**
     * 发送信息
     */
    sendEvent(info) {
        console.log(info);
        if(info !=undefined){
            var result = engine.prototype.sendEvent(JSON.stringify(info));
            console.log(result)

        }
    },
    /**
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp) {
        if (sendEventRsp.status == 200) {
            console.log('sendEventResponse：发送消息成功');
        } else {
            console.log('sendEventResponse：发送消息失败');
        }
    },

    /**
     * 接收到其他用户消息通知
     * @param eventInfo
     */
    sendEventNotify(eventInfo) {
        GameData.foodPosition = JSON.parse(eventInfo.cpProto);
        // let getPosition = JSON.parse(eventInfo.cpProto);
        // if(getPosition.endPosition){
        //     this.synMove(eventInfo.cpProto);
        // }else{
        //     this.refreshScore(eventInfo)
        // }

        console.log('sendEventNotify：用户' + eventInfo.srcUserID + '对你使出了一招' + eventInfo.cpProto);
    },
    foodPosition: function() {
        let gap = this.gap;
        var mosterSize = this.foodSize;
        var mosterheight = Math.floor(cc.winSize.height);
        var mosterWidth = Math.floor(cc.winSize.width);
        //
        let n = Math.floor(mosterheight / (mosterSize + gap));
        let m = Math.floor(mosterWidth / (mosterSize + gap));
        var arrpos = []; //创建一个数组
        let k = 0;
        let l = 0;
        let o = 0;
        //将坐标转化放置进数组内
        for (let i = 0; i < n; i++) {
            // k += mosterSize;
            for (let j = 0; j < m; j++) {
                l = (mosterSize+gap) * (j + 1);
                k = (mosterSize + gap) * (i+1);
                arrpos[o] = cc.v2(l, k);
                o++;
            }
        }
        arrpos.sort(() => Math.random() - 0.5);
        return arrpos;
    },
    startGame: function () {
        cc.director.loadScene('Game');
    },
});
