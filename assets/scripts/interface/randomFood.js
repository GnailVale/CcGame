// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var randomFood = cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    food_target: {
      default: null,
      type: cc.Prefab
    },
    foodCount: 8,
    gap: 100,
    foodSize: 56,
    foodPos:[]
  },
  // newFood: function(pos) {
  //   console.log(pos);
  //   this.foodPos.push(pos);
  //   var scene = cc.director.getScene();
  //   var node = cc.instantiate(this.food_target);
  //
  //   node.parent = scene;
  //   node.setPosition(pos);
  // },
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
  ///食物消失执行的函数
  lostFood:function(totol,lost){
    // this.onLoad();
    // console.log(totol)
    // console.log(lost)
    // for( let i=0;i<this.foodPos.length;i++){
    //   if(this.foodPos[i].x == lost.x && this.foodPos[i].y == lost.y){
    //     this.foodPos.splice(i,1)
    //     // console.log(this.foodPos[i])
    //   }
    // }
    // var randomItem = totol[Math.floor(Math.random() * totol.length)];
    // console.log(randomItem)
    // this.foodPos.push(randomItem)
    // console.log(this.foodPos)
    // for (var i = 0; i < 3; i++) {
    //   this.newFood(this.foodPos[i]);
    // }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    // var posArr = this.foodPosition();
    // for (var i = 0; i < 3; i++) {
    //   this.newFood(posArr[i]);
    // }
  },

  start() {}
  // update (dt) {},
});

module.export  = randomFood;
