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

  uploadGoodsImg: function (goodsId){
    var me = this;
    var imgFilePaths = me.data.img_url;
    var count = me.data.count;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '上传图片中--',
    })
    wx.uploadFile({
      url: serverUrl + '/goods/uploadGoodsImg', 
      filePath: imgFilePaths[count],
      name: 'file',
      formData: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {},
      complete: function (res) {
        count++;
        me.setData({
          count: count
        })
        if (count >= imgFilePaths.length) {
          var data = JSON.parse(res.data);
          console.log(data);
          wx.hideLoading();
          if (data.status == 200) {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功!~~',
              icon: 'success'
            });
            me.setData({
              count: 0
            })
          } else if (data.status == 500) {
            wx.showToast({
              title: data.msg,
            });
          }
        } else {
          me.uploadGoodsImg(goodsId);
        }
      }
    })
  },

  send:function(e){
    var me = this;
    console.log(e);
    var goodsName = e.detail.value.goodsName;
    var goodsDesc = e.detail.value.goodsDesc;
    var goodsPrice = e.detail.value.goodsPrice;
    var goodsNum = e.detail.value.goodsNum;
    var goodsAddress = e.detail.value.goodsAddress;
    var goodsPhone = e.detail.value.goodsPhone;
    var thirdSession = wx.getStorageSync("thirdsession")
    wx.showLoading({
      title: '发布中--',
    })
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/goods/uploadGoods',
      data: {
        thirdSession: thirdSession,
        goodsName: goodsName,  
        goodsDesc: goodsDesc,
        goodsPrice: goodsPrice,
        goodsNum: goodsNum,
        goodsAddress: goodsAddress,
        goodsPhone: goodsPhone,
      },
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.data);
        //商品信息上传成功后，上传商品图片
        me.uploadGoodsImg(res.data.data);
        
      }
    })
  }
})