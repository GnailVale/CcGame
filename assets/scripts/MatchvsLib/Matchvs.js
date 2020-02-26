/**
 * Matchvs JSB加载与Js加载
 */
var engine;
var response;
var MsMatchInfo;
var MsCreateRoomInfo;
var MsRoomFilterEx;
var LocalStore_Clear;

try{
    engine = new window.MatchvsEngine(); //可以或得到Matchvs服务模块的实例。但是一次运行只能new一个实例出来，要不然会出问题。所以这里要将engine封装成全局变量，供多个脚本调用。
    response = new window.MatchvsResponse();
    MsMatchInfo = window.MsMatchInfo;
    MsCreateRoomInfo = window.MsCreateRoomInfo;
    MsRoomFilterEx  = window.MsRoomFilterEx ;
    LocalStore_Clear = window.LocalStore_Clear;

    console.log(this);
    if(typeof BK != "undefined" ||typeof FBInstant != "undefined"){
        MVS.SetWss&&MVS.SetWss(true);
        console.log("use wss");
    }

    console.log("load matchvs.all.js success");
} catch(error){
    console.error("try load matchvs JS fail,"+error.message);
}



module.exports = {
    engine: engine,
    response: response,
    MsMatchInfo: MsMatchInfo,
    MsCreateRoomInfo: MsCreateRoomInfo,
    MsRoomFilterEx :MsRoomFilterEx ,
    LocalStore_Clear:LocalStore_Clear,
};