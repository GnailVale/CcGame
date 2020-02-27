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
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
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

    startGame: function () {
        cc.director.loadScene('Game');
    },
});
