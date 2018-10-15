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

    likeIcon:"/img/like.png",

    islikeGoods:false,
    
    goodsInfo:{},

    goodsName:"",
    goodsDesc:"",
    address:"",
    likeCounts:"",
    price:"",
    nickName: "",
    avatar_url: "",


    commentsPage: 1,
    commentsTotalPage: 1,
    commentsList: [],
    placeholder: "说点什么..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var me = this;
    var thirdSession = wx.getStorageSync("thirdsession")

    // 获取上一个页面传入的参数
    var goodsInfo = JSON.parse(params.goodsInfo);
    var goodsName = goodsInfo.goodsName;
    var goodsDesc = goodsInfo.goodsDesc;
    var address = goodsInfo.address;
    var likeCounts = goodsInfo.likeCounts;
    var price = goodsInfo.price;
    var nickName = goodsInfo.nickName;
    var avatar_url = goodsInfo.avatar_url;
    var goodsId = goodsInfo.id;
    var sellerId = goodsInfo.sellerId;

    me.setData({
      goodsInfo: goodsInfo,
      goodsId: goodsId,
      sellerId: sellerId,
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
          imgUrls: res.data.data,
          serverUrl: serverUrl,
        })
      }
    })

    wx.request({
      url: serverUrl + '/goods/queryUserLikeGoods?thirdSession=' + thirdSession + "&goodsId=" + goodsInfo.id,
      method: 'POST',
      success: function (res) {
        console.log(res);
        me.setData({
          islikeGoods: res.data.data
        })
      }
    })

    me.getCommentsList(1);
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


  likeGoods:function(e){
    var me = this;

    var goodsId = me.data.goodsId;
    var sellerId = me.data.sellerId;
    var likeIcon = me.data.likeIcon;
    var serverUrl = app.serverUrl;
    var thirdSession = wx.getStorageSync("thirdsession")

    var url = '/goods/userLike?thirdSession=' + thirdSession + '&goodsId=' + goodsId + '&sellerId=' + sellerId;
    
    if (thirdSession == null || thirdSession == undefined || thirdSession == '') {
      wx.navigateTo({
        url: '../wxLogin/login',
      })
    } else{
       
        var islikeGoods = me.data.islikeGoods
        var likeCounts = me.data.likeCounts

        if (islikeGoods) {
          me.setData({
            likeCounts: likeCounts-1
          });
          url = '/goods/userUnLike?thirdSession=' + thirdSession + '&goodsId=' + goodsId + '&sellerId=' + sellerId;
        } else{
          me.setData({
            likeCounts: likeCounts + 1
          });
        }
     
      wx.showLoading({
        title: '...',
      })

      wx.request({
        url: serverUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          // 'userId': user.id,
          // 'userToken': user.userToken
        },
        success: function (res) {
          wx.hideLoading();
          me.setData({
            islikeGoods: !islikeGoods,
          });
        }
      })

    }
    
  },



  saveComment: function (e) {
    var me = this;
    var content = e.detail.value.comments;
    console.log(content);
    // 获取评论回复的fatherCommentId和toUserId
    // var fatherCommentId = e.currentTarget.dataset.replyfathercommentid;
    // var toUserId = e.currentTarget.dataset.replytouserid;
    var fatherCommentId =  me.data.replyFatherCommentId;
    var toUserId = me.data.replyToUserId;
    console.log(fatherCommentId);
    console.log(toUserId);
    var thirdSession = wx.getStorageSync("thirdsession");
    var videoInfo = JSON.stringify(me.data.videoInfo);


      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({
        url: app.serverUrl + '/goods/saveComment?fatherCommentId=' + fatherCommentId + "&toUserId=" + toUserId+"&thirdSession=" + thirdSession,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        data: {
          goodsId: me.data.goodsInfo.id,
          comment: content
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading();

          me.setData({
            contentValue: "",
            commentsList: [],
            placeholder: "",
            replyFatherCommentId: "",
            replyToUserId: "",
            commentFocus: false
          });


          me.getCommentsList(1);
        }
      })

  },


  //分享商品
  shareGoods:function(){

  },



  //获取评论列表
  getCommentsList: function (page) {
    var me = this;

    var goodsId = me.data.goodsInfo.id;

    wx.request({
      url: app.serverUrl + '/goods/getGoodsComments?goodsId=' + goodsId + "&page=" + page + "&pageSize=5",
      method: "POST",
      success: function (res) {
        console.log(res.data);

        var commentsList = res.data.data.rows;
        var newCommentsList = me.data.commentsList;

        me.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: page,
          commentsTotalPage: res.data.data.total
        });
      }
    })
  },

  reply:function(e){
    var me = this
    console.log(e);
    var fatherCommentId = e.currentTarget.dataset.fathercommentid;
    var toUserId = e.currentTarget.dataset.touserid;
    var toNickname = e.currentTarget.dataset.tonickname;

    me.setData({
      placeholder: "回复  " + toNickname,
      replyFatherCommentId: fatherCommentId,
      replyToUserId: toUserId,
      commentFocus: true
    });

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