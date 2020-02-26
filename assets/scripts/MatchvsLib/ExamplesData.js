/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, userName: string, mxaNumer: number, userID: string, token: string, host: string}}
 */

var GameData = {
    gameID: 218201,
    channel: 'Matchvs',
    platform: 'alpha',
    gameVersion: 1,
    appKey: '24adf75bdb4b4e23a7b58e47051fc61d#C',
    userName: '',
    mxaNumer: 3,
    userID: "",
    token: "",
    name: "",
    roomID: 0,
    userInfo:"",
    totolUser:[],
    avatar: "",
    host: "",
    isPAAS: false,
    reset: function () {
        GameData.gameID = "";
        GameData.appKey = "";
        GameData.userID = "";
        GameData.token = "";
    },
}


module.exports = GameData;