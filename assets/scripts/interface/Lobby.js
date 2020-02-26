// /**
//  * 大厅页面
//  */
var mvs = require("../MatchvsLib/Matchvs");
var GameData = require('../MatchvsLib/ExamplesData');
cc.Class({
    extends: cc.Component,

    properties: {
        randomMatch: cc.Node,
        returnLogin: cc.Node,
        nickName: {
            default:null,
            type:cc.Label
        },
        avatar111: {
            default:null,
            type:cc.Sprite
        },
    },

    onLoad:function () {
        // this.randomMatch.on('click', this.joinRoom, this);
        // this.sendEventButton.node.on('click', this.sendMessage, this);
        let self = this;
        this.nickName.string = "用户ID："+ GameData.name;
        console.log('avatar url', GameData.avatar);
        if (typeof(wx) !== 'undefined') {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    self.avatar111.spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    console.log('wx onload image error');
                }
            };
            image.src = GameData.avatar;
        } else {
            cc.loader.load(GameData.avatar, function (err, res) {
                if (err) {
                    console.error('load avatar image error', err);
                    return;
                }
                self.avatar111.spriteFrame  = new cc.SpriteFrame(res);
            }) ;
        }
        // 返回登录
        this.returnLogin.on(cc.Node.EventType.TOUCH_END, function(){
            let result = mvs.engine.logout("退出游戏");
            console.log('退出游戏result'+result);
            cc.director.loadScene('Login');
        });

        // 随机匹配
        this.randomMatch.on(cc.Node.EventType.TOUCH_END, function(){
        //     GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
        //     GLB.syncFrame = false;
        //    // self.labelLog('开始随机匹配');
            cc.director.loadScene('Match');
        });

        

    },

    // joinRoom(){
    //     mvs.response.joinRoomResponse = (status, roomUserInfoList, roomInfo)=>{
    //         console.log(status);
            
    //         console.log(roomUserInfoList);
    //         console.log(roomInfo);
    //         if(status == 200){
    //             GameData.roomID = roomInfo.roomID;
    //             cc.director.loadScene('Match');
    //             // console.log(roomUserInfoList.length);
    //             // if(roomUserInfoList.length !=0){
                   
    //             // }
                
    //             //成功
    //         }else{
    //             //失败
    //         }
    //     }
    //     mvs.response.joinRoomNotify = (roomUserInfo)=>{
    //         console.log(roomUserInfo)
    //         console.log('roomUserInfo.userID 加入房间')
    //         //roomUserInfo.userID 加入房间
    //     }
    //     var result = mvs.engine.joinRandomRoom(2, GameData.name + "加入房间");
    //     // if(result == 0 ){
    //     //     cc.director.loadScene('Match');
    //     // }
    //     console.log("随机匹配result"+result);
    // },

});
