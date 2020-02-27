// let mvs = require("../MatchvsLib/Matchvs");
// let GLB = require("Glb");
// let msg = require("../MatchvsLib/MatvhvsMessage");
// let engine = require("../MatchvsLib/MatchvsDemoEngine");
var engine = require('../MatchvsLib/MatchvsEngine');
var response = require("../MatchvsLib/MatchvsResponse");
var msg = require("../MatchvsLib/MatvhsvsMessage");
var GameData = require('../MatchvsLib/ExamplesData');
// var Player = require()

cc.Class({
    extends: cc.Component,

    properties: {
        player_prefab: {
            type: cc.Prefab,
            default: null,
        },
        autoLoad: true,   //自动加载
        giveFood:cc.Node,
        players:[],
        useridLabel: {
            default: null,
            type: cc.Label
        },
        labelInfo: {
            default: null,
            type: cc.Label
        },
        score:0,
        userScores:[],
        myScore:"",
        sendPos:"",
    },


    onLoad: function () {
        //加载预制体
        if (this.autoLoad) {
            for(let i=0;i<2;i++){
                this.loadPrefab();
            }
            let Chlidren = this.node.children;
            for (let i=0;i<Chlidren.length;i++){
                if(Chlidren[i].name == 'Player'){
                    this.players.push(Chlidren[i])
                    // console.log(Chlidren[i]);
                }
            }

        }

        ///控制角色移动
        this.node.on('touchstart', function (event) {
            var pos = event.getLocation();
            pos = this.node.convertToNodeSpaceAR(pos);
            for (let i = 0; i < this.players.length; i++) {
                var lableId = this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
                console.log(lableId)
                 console.log(GameData.userID)
                if(lableId == "我"){
                    if(pos.y > -180 && pos.y < 140){
                        this.players[i].getComponent("Player").movePlayer(this.players[i],pos);
                    }

                }

            }
        }, this);

        console.log(GameData);
        this.initMatchvsEvent(this);

        this.useridLabel.string = "用户Id:" + GameData.userID;

        for (let i = 0; i < GameData.totolUser.length; i++) {
            if(GameData.totolUser[i].userID !=GameData.userID){
                this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string = GameData.totolUser[i].userID;
            }

        }

        var _that = this;
        this.myScore = {userID:GameData.userID,Score:this.score};

        // this.userScores.push(myScore);
        // this.scoreDisplays = [this.scoreDisplays0,this.scoreDisplays1];
        // console.log(this.userScore);
        //////////喂食
        this.giveFood.on(cc.Node.EventType.TOUCH_END,function(event){

            for (let i = 0; i < _that.players.length; i++) {
                var lableId = _that.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
                console.log(lableId)
                //  console.log(GameData.userID)
                if(lableId == "我"){
                    _that.myScore.Score ++ ;
                    _that.players[i].getChildByName("AnimNode").getChildByName("dogLevel").getComponent(cc.Label).string = _that.myScore.Score;
                    _that.sendEvent(_that.myScore);

                }

            }
        })




    },

    //实例化预制件，设置父节点
    loadPrefab() {
        let node = cc.instantiate(this.player_prefab);
        //当父节点不存在时，使用当前组件为父节点
        node.parent = this.parent || this.node;
        // console.log(node.parent);
    },

    initMatchvsEvent(self) {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.off(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
    },

    ///同步移动
    synMove:function(param){
        let getparam = JSON.parse(param);
        for(let i=0;i<this.players.length;i++){
            let lableId = this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
            if(lableId == getparam.userID){
                console.log("同步移动");
                // let moveTo1 = cc.moveTo(1,getparam.endPosition);
                // this.players[i].getChildByName("AnimNode").runAction(moveTo1);

                let index = getparam.index;
                let animCtrl = this.players[i].getChildByName("AnimNode").getComponent(cc.Animation)
                let clips = animCtrl.getClips();

                if(animCtrl.currentClip == null || animCtrl.currentClip.name != clips[index].name ){
                    animCtrl.play(clips[index].name);
                }
                if(getparam.endPosition.y > -180 && getparam.endPosition.y < 140){
                    this.players[i].getComponent("Player").moveToPoint(getparam.endPosition,animCtrl);
                }
                // this.moveToPoint(getparam.endPosition,animCtrl);
            }
        }
    },

    /**
     * 发送信息
     */
    sendEvent(info) {
        console.log(info);
        if(info !=undefined){
            if(info.endPosition){
                var result = engine.prototype.sendEvent(JSON.stringify(info));
                console.log("111111")
            }else{
                var result = engine.prototype.sendEvent(JSON.stringify(info.Score));
                console.log(result)
            }

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
        let getPosition = JSON.parse(eventInfo.cpProto);
        if(getPosition.endPosition){
            this.synMove(eventInfo.cpProto);
        }else{
            this.refreshScore(eventInfo)
        }

        console.log('sendEventNotify：用户' + eventInfo.srcUserID + '对你使出了一招' + eventInfo.cpProto);
    },
    //玩家得分
    refreshScore: function (event) {
        console.log(event)
        console.log(this.userScores)
        console.log(parseInt(event.cpProto))
        let selfLevel = parseInt(event.cpProto);
        if (event !== undefined) {
            if(typeof selfLevel == "number"){
                for (let i = 0; i < this.players.length; i++) {
                    var lableId = this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
                    console.log(lableId)
                    //  console.log(GameData.userID)
                    if(lableId == event.srcUserID){
                        this.players[i].getChildByName("AnimNode").getChildByName("dogLevel").getComponent(cc.Label).string = selfLevel;
                    }

                }
            }


        }
    },


});
