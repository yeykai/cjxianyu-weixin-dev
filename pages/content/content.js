// pages/content.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    // indicatorDots: false, 
    // autoplay: false,
    interval: 5000,
    duration: 1000,
    imageURL: "/images/44.png",

    goodsName:"",
    goodsDesc:"",
    address:"",
    likeCounts:"",
    price:"",
    nickName: "",
    avatar_url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var me = this;

    // 获取上一个页面传入的参数
    var goodsInfo = JSON.parse(params.goodsInfo);
    var goodsName = goodsInfo.goodsName;
    var goodsDesc = goodsInfo.goodsDesc;
    var address = goodsInfo.address;
    var likeCounts = goodsInfo.likeCounts;
    var price = goodsInfo.price;
    var nickName = goodsInfo.nickName;
    var avatar_url = goodsInfo.avatar_url;

    me.setData({
      goodsName: goodsName,
      goodsDesc: goodsDesc,
      address: address,
      likeCounts: likeCounts,
      price: price,
      nickName: nickName,
      avatar_url: avatar_url
    })

    console.log(goodsInfo);
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/goods/queryImgList?goodsId=' + goodsInfo.id,
      method: 'POST',
      success: function (res) {
        console.log(res);
        me.setData({
          imgUrls : res.data.data,
          serverUrl: serverUrl,
        })
      }
    })
  },

  previewImg: function (e) {
    var me = this;
    var imgUrls = me.data.imgUrls;
    var serverUrl = app.serverUrl;

    //存放每张图片的最终路径
    var finalUrl = ""
    //存放最终的图片路径列表
    var finalImgUrl = [];

    //从后端获取的路径为相对路径，需用serverUrl与它拼接，组成最终的图片路径列表
    for (var i = 0; i < imgUrls.length ; i++){
      finalUrl = serverUrl+imgUrls[i];
      finalImgUrl[i] = finalUrl;
    }
    console.log(finalImgUrl);
    var index = e.target.dataset.index;

    //图片预览
    wx.previewImage({
      urls: finalImgUrl,
      current: finalImgUrl[index],
      success: function (res) {
        console.log("success");
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})