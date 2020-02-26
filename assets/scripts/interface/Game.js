// let mvs = require("../MatchvsLib/Matchvs");
// let GLB = require("Glb");
// let msg = require("../MatchvsLib/MatvhvsMessage");
// let engine = require("../MatchvsLib/MatchvsDemoEngine");
var engine = require('../MatchvsLib/MatchvsEngine');
var response = require("../MatchvsLib/MatchvsResponse");
var msg = require("../MatchvsLib/MatvhsvsMessage");
var GameData = require('../MatchvsLib/ExamplesData');

cc.Class({
    extends: cc.Component,

    properties: {
        giveFood:cc.Node,
        players: [cc.Node],

        scoreDisplays0: {
            default: null,
            type: cc.Label
        },
        scoreDisplays1: {
            default: null,
            type: cc.Label
        },

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
        sendPos:"",
    },


    onLoad: function () {
        console.log(GameData.totolUser);
        this.initMatchvsEvent(this);

        this.useridLabel.string = "用户Id:" + GameData.userID;
        console.log(this.players[1].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string)
        // console.log(this.players[1].getChildByName("playerLabel").getComponent(cc.Label).string)
        for (let i = 0; i < GameData.totolUser.length; i++) {
            if(GameData.totolUser[i].userID !=GameData.userID){
                this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string = GameData.totolUser[i].userID;
            }

        }

        var _that = this;
        let myScorce = {userID:GameData.userID,Score:this.score};

        this.userScores.push(myScorce);
        this.scoreDisplays = [this.scoreDisplays0,this.scoreDisplays1];
        // console.log(this.userScore);
        this.giveFood.on(cc.Node.EventType.TOUCH_END,function(event){

            for (let i = 0; i < _that.players.length; i++) {
                // (!_that.players[i]) && (_that.players[i] = _that.node.getChildByName("Player" + (i + 1)).node);
                var lableId = _that.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
                console.log(lableId)
                //  console.log(GameData.userID)
                if(lableId == "我"){
                    // console.log('店家')
                    // console.log(_that.scoreDisplays0.string)
                    _that.userScores[i].Score++;
                    _that.scoreDisplays[i].string = _that.userScores[i].Score ;
                }

                _that.sendEvent(_that.userScores[i]);

            }
        })

        // this.moveObj(this.players[1])
        for (let i = 0; i < this.players.length; i++) {
            var lableId = this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
            console.log(lableId)
            //  console.log(GameData.userID)
            if(lableId == "我"){
                // console.log(this.players[i])
                this.moveObj(this.players[i])
            }

        }



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

    //触摸物体移动
    moveObj:function(nameStr){
        console.log(nameStr)
        let nameAni = nameStr.getChildByName("AnimNode")

        this.node.on('touchstart', function (event) {
            var pos = event.getLocation();
            pos = this.node.convertToNodeSpaceAR(pos);
            var start = nameAni.getPosition();
            var end = pos;
            cc.log(start);
            cc.log(pos);
            // dogLevel.setPosition(pos);
            // var ros = this.getAngle(start,end);
            // nameAni.rotation = ros;
            // cc.log(nameAni.rotation);
            var index = this.getDirection(start,end);
            console.log(index);
            // var animCtrl = nameStr.getComponent(cc.Animation);
            var animCtrl = nameStr.getChildByName("AnimNode").getComponent(cc.Animation)

            var clips = animCtrl.getClips();
            this.sendPos = {
                "endPosition":end,
                "index":index,
                "userID":GameData.userID,
            }
            this.sendEvent(this.sendPos);

            if(animCtrl.currentClip == null || animCtrl.currentClip.name != clips[index].name ){
                animCtrl.play(clips[index].name);
            }
            ////y 轴超过某个区域后不移动
            if(end.y > -180 && end.y < 140){
                this.moveToPoint(end,animCtrl);
            }

            // for(let i=0;i<scatterFood.length;i++){
            //     let scX = scatterFood[i].x;
            //     let scY = scatterFood[i].y;
            //     if(pos.x>scX -20 && pos.x <scX +20 && pos.y > scY -20 && pos.y < scY+20){
            //         var _that = this;
            //         var dis = this.getDistance(start , pos);
            //         var t = dis / 100 +1;
            //         setTimeout(()=>{
            //             cc.log('碰撞')
            //             _that.giveFood();
            //             effect1.active = true;
            //             this.m_effect.play('effect1');
            //             this.m_effect.node.setPosition(cc.v2(pos));
            //         },t*1000)
            //     }
            // }

        }, this);
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
                this.moveToPoint(getparam.endPosition,animCtrl);
            }
        }
        console.log(getparam)
    },
    moveToPoint:function(point,nameStr){
        console.log(point);
        console.log(nameStr);
        var start = nameStr.node.getPosition();
        if(this.m_moveToAction != null){
            nameStr.node.stopAction(this.m_moveToAction)
        }
        //匀速 v=s/t,t=s/v
        var dis = this.getDistance(start , point);
        var t = dis / 100;
        this.m_moveToAction = cc.moveTo(t, point);
        // 执行动作
        nameStr.node.runAction(this.m_moveToAction);
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

        // this.labelLog('你准备使出一招：' + 0);
        // this.engineCode(result, 'sendEvent');
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
            console.log("000000")
            this.synMove(eventInfo.cpProto);
        }else{
            this.refreshScore(eventInfo)
        }
        console.log(eventInfo);

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
                this.scoreDisplays = [this.scoreDisplays0,this.scoreDisplays1];
                for (let i = 0; i < this.players.length; i++) {
                    // (!_that.players[i]) && (_that.players[i] = _that.node.getChildByName("Player" + (i + 1)).node);
                    var lableId = this.players[i].getChildByName("AnimNode").getChildByName("playerLabel").getComponent(cc.Label).string;
                    console.log(lableId)
                    //  console.log(GameData.userID)
                    if(lableId == event.srcUserID){
                        console.log('店家')
                        console.log(this.scoreDisplays0.string)
                        this.scoreDisplays[i].string = selfLevel;
                    }


                }
            }


        }
    },

    getDistance:function(start,end){
        var pos = cc.v2(start.x - end.x , start.y - end.y);
        var dis = Math.sqrt(pos.x*pos.x + pos.y * pos.y);
        return dis;
    },
    getDirection:function(start,end){
        var rot = this.getAngle(start,end);
        console.log(rot);
        if(rot > -45 && rot < 45){
            return 0;
        }else if( rot > 45 && rot < 135){
            return 1;
        }else if( rot > 135 && rot < 225){
            return 2;
        }else {
            return 3;
        }
    },
    getAngle:function(start,end){
        //两点的x,y值
        var x = end.x - start.x;
        var y = end.y - start.y;
        var hypotenuse = Math.sqrt(x * x + y * y);
        //斜边长度
        var cos = x / hypotenuse;
        var radian = Math.acos(cos);
        //求出弧度
        var angle = 180 /(Math.PI / radian);
        //用弧度计算角度
        if( y < 0){
            angle = 0-angle;
        }else if( y == 0 && x < 0){
            angle = 180;
        }
        return 90 - angle;
    },

});
