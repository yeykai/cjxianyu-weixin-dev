// pages/login/login.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    content: '',
    //已上传图片数量
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  input: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  chooseimage: function () {
    var that = this;
    var count = 9 - that.data.img_url.length;
    wx.chooseImage({
      count: count, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
          
          //图如果满了9张，不显示加图
          if (that.data.img_url.length >= 8) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
        }
      }
    })
  },

  previewImg:function(e){
    var me = this;
    var img_url = me.data.img_url;
    var index = e.target.dataset.index;
    wx.previewImage({
      urls: img_url,
      current : img_url[index],
      success:function(res){
          console.log(res);
      }
    })
  },

  deleteImg: function (e){
    var me = this;
    var img_url = me.data.img_url;
    var index = e.target.dataset.index;
    img_url.splice(index, 1); 
    me.setData({
      img_url: img_url,
      hideAdd: me.data.img_url.length <9 ? 0 : 1
    })
  },

  send:function(){
    var me = this;
    var imgFilePaths = me.data.img_url;
    var count = me.data.count;
    wx.showLoading({
      title: '上传中--',
    })
    var serverUrl = app.serverUrl;
    // var userInfo = app.getGlobalUserInfo();
    wx.uploadFile({
      url: serverUrl + '/user/uploadFace', //仅为示例，非真实的接口地址
      filePath: imgFilePaths[count],
      name: 'file',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

      },
      complete:function(res){
        count++;
        me.setData({
          count:count
        })
        if (count >= imgFilePaths.length){
          var data = JSON.parse(res.data);
          console.log(data);
          wx.hideLoading();
          if (data.status == 200) {
            wx.showToast({
              title: '上传成功!~~',
              icon: 'success'
            });
          } else if (data.status == 500) {
            wx.showToast({
              title: data.msg,
            });
          }
        }else{
          me.send();
        }       
      }
    })
  }
})