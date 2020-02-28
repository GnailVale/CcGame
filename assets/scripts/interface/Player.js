var engine = require('../MatchvsLib/MatchvsEngine');
var response = require("../MatchvsLib/MatchvsResponse");
var GameData = require('../MatchvsLib/ExamplesData');
import randomFood from 'randomFood'
cc.Class({
    extends: cc.Component,

    properties: {
        sendPos:"",
        info:'',
    },

    onLoad: function () {
        console.log("loading")
        console.log(this.info);
        if(this.position != ""){
            console.log(this.position);
        }

    },
    start () {
      // 开启碰撞检测系统，未开启时无法检测
      cc.director.getCollisionManager().enabled = true;
      // cc.director.getCollisionManager().enabledDebugDraw = true;
      // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
      },
      /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function(other, self) {
        console.log(other)
        let playerLabel = self.node.getChildByName("playerLabel").getComponent(cc.Label).string;
        console.log(other.node.getPosition());
          self.node.getChildByName("dogLevel").getComponent(cc.Label).string ++;
        console.log(self.node.getChildByName("dogLevel").getComponent(cc.Label).string)
      console.log("on collision enter");
        console.log()
      if(other.node.group == 'food'){
          let lostPosition = other.node.getPosition()
          let totolfood = cc.find('Canvas').getComponent("randomFood").foodPosition();
          // cc.find('Canvas').getComponent("randomFood").lostFood(totolfood,lostPosition);
        // cc.find('Canvas').getComponent(Game1).point()
      }
    },
    //角色移动
    movePlayer:function(nameStr,pos){
        let nameAni = nameStr
        let start = nameAni.getPosition();
        let end = pos;
        console.log(start);
        console.log(end);
        let index = this.getDirection(start,end);
        console.log(index);
        // var animCtrl = nameStr.getComponent(cc.Animation);
        let animCtrl = nameStr.getComponent(cc.Animation)

        let clips = animCtrl.getClips();
        this.sendPos = {
            "endPosition":end,
            "index":index,
            "userID":GameData.userID,
        }
        console.log(this.sendPos);
        ///同步移动发送消息
        this.sendEvent(this.sendPos);

        if(animCtrl.currentClip == null || animCtrl.currentClip.name != clips[index].name ){
            animCtrl.play(clips[index].name);
        }
        ////y 轴超过某个区域后不移动
        this.moveToPoint(end,animCtrl);
        // if(end.y > -180 && end.y < 140){
        //
        // }

    },
    updateScore:function(nameStr){
        let nameAni = nameStr
        console.log((nameAni.g))
    },


    /**
     * 发送信息
     */
    sendEvent(info) {
        console.log(info);
        if(info !=undefined){
            if(info.endPosition){
                var result = engine.prototype.sendEvent(JSON.stringify(info));
                console.log(result)
            }else{
                var result = engine.prototype.sendEvent(JSON.stringify(info.Score));
                console.log(result)
            }

        }
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
    // update:function () {
    //     if(this.position != ""){
    //         console.log(this.position);
    //     }
    // }


});

