//app.js
App({
  serverUrl: "http://192.168.31.177:8080",
 
  onLaunch: function () {


  },
  globalData: {
    userInfo: null
  },

  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },
})