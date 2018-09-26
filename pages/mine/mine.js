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
            code: code
          },
          method: "GET",
          success: function (result) {
            console.log(result);
            // 保存用户信息到本地缓存
            app.setGlobalUserInfo(e.detail.userInfo);
            wx.setStorageSync("thirdsession", result.data.data)
            //从本地缓存中取出thirdsession
            var thirdsession = wx.getStorageSync('thirdsession')
            wx.request({
              url: serverUrl + "wxuser/wxRegister", //后端请求地址
              method: "GET",
              data: {
                thirdSession: thirdsession,
                encryptedData: encryptedData,
                rawData: rawData,
                signature: signature,
                iv: iv
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                //成功后跳转至用户信息页面
                wx.redirectTo({
                  url: '../mine/mine',
                })
              }
            })
            wx.showToast({
              title: '登录成功',
              icon: 'success',
            })
          }
        })
      }
    })
  }
})

