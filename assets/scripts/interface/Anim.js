import Game1 from './Game'
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},

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
    console.log("on collision enter");
    if(other.node.group == 'food'){
      cc.find('Canvas').getComponent(Game1).point()
    }
  },
  /**
   * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionStay: function(other, self) {
    console.log("on collision stay");
  },
  /**
   * 当碰撞结束后调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionExit: function(other, self) {
    console.log("on collision exit");
  }
    // update (dt) {},
});
