const app = getApp()

Page({
  data: {
    isMe : false,
    nickname: ""
    

  },

  onLoad:function(params){
    var me = this;
    wx.hideToast();
    var userInfo = app.getGlobalUserInfo();
    if (userInfo != null && userInfo != "" && userInfo != undefined){
        wx.checkSession({
          success: function (res) {
            console.log(res);
            me.setData({
              userInfo: userInfo,
              nickname: userInfo.nickName,
              isMe: true
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '登陆态已失效，请重新登陆',
            })
          }
        })
    }else{
          me.setData({
            isMe: false
          })
    }
  },


  // 登录  
  doLogin: function (e) {
    var me = this;
    //获取开放数据
    var encryptedData = e.detail.encryptedData
    var signature = e.detail.signature
    var iv = e.detail.iv
    var rawData = e.detail.rawData
    console.log(e)
    var serverUrl = app.serverUrl;
    wx.login({
      success: function (res) {
        console.log(res)
        // 获取登录的临时凭证
        var code = res.code;
        // 调用后端，获取微信的session_key, secret
        wx.request({
          url: serverUrl + "/wxuser/wxLogin",
          data: {
            code: code,
            encryptedData: encryptedData,
            rawData: rawData,
            signature: signature,
            iv: iv
          },
          method: "GET",
          success: function (result) {
            console.log("wxLogin");
            // 保存用户信息到本地缓存
            app.setGlobalUserInfo(e.detail.userInfo);
            wx.setStorageSync("thirdsession", result.data.data)
            wx.showToast({
              title: '登录成功',
              icon: 'success',
            });
            me.setData({
              userInfo: e.detail.userInfo,
              nickname: e.detail.userInfo.nickName,
              isMe: true
            })
          }
        })
      }
    })
  }
})

