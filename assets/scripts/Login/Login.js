/**
 * 登录
 */
var mvs = require("../MatchvsLib/Matchvs");
// var mvs = require("../matchvs/matchvs.all.js");
var GameData = require('../MatchvsLib/ExamplesData');
cc.Class({
    extends: cc.Component,

    properties: {
        gameIdInput: cc.Node,
        appKeyInput: cc.Node,
        confirm: cc.Node,
        clear: cc.Node,
        gameID:'',
        appKey:'',
        userID:'',
        token:''
    },


    /**
     * load 显示页面
     */
    onLoad: function () {
        let self = this;
        this.confirm.on(cc.Node.EventType.TOUCH_END, function () {
            // 获取用户输入的参数
            if (Number(self.gameIdInput.getComponent(cc.EditBox).string) !== 0) {
                console.log(self.gameIdInput.getComponent(cc.EditBox).string)
                GameData.gameID = Number(self.gameIdInput.getComponent(cc.EditBox).string);
            }
            if (self.appKeyInput.getComponent(cc.EditBox).string !== ""){
                GameData.appKey = self.appKeyInput.getComponent(cc.EditBox).string;
            }
            console.log(GameData);
            self.init();
        });
        this.clear.on(cc.Node.EventType.TOUCH_END, function () {
            if (LocalStore_Clear) {
                LocalStore_Clear()
            }
            console.log("clear user info cache");
        });

    },

    // 初始化
    init(){
        mvs.response.initResponse = (status)=>{
            console.log(status);
            if(status == 200){
                this.register();
                //成功
            }else{
                //失败
            }
        }
        var result = mvs.engine.init(mvs.response,GameData.channel,GameData.platform,GameData.gameID,GameData.appKey,1);
        mvs.response
        console.log("初始化result"+result);
        console.log(GameData.gameID)
        console.log(GameData.appKey)
    },
    /**
     * 注册
     */
    register() {
        mvs.response.registerUserResponse = (userInfo)=>{
            console.log(userInfo);
            if(userInfo.status == 0){
                GameData.userID = userInfo.userID;
                GameData.token = userInfo.token;
                GameData.name = userInfo.name;
                GameData.avatar = userInfo.avatar;
                GameData.userInfo = userInfo;
                this.login();
            // 用户ID
            console.log("userID: ", userInfo.userID);
            // token
            console.log("token: ", userInfo.token);
            }else{
                //失败
            }
        }
        mvs.engine.registerUser();
    },
    /**
     * 登录
     */
    login() {
        mvs.response.loginResponse = (loginInfo)=>{
            if(loginInfo.status == 200){
                cc.director.loadScene("Lobby");
                console.log(loginInfo)
            }else{
                console.log('登录失败')
            }
            
        }
        var result = mvs.engine.login(GameData.userID, GameData.token, "matchvs");
        console.log(result);
    },




});
