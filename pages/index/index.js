var app = getApp();

Page({
  data: {
    imgUrls: [
      '/img/lunbo1.jpg',
      '/img/lunbo3.jpg',
      '/img/lunbo4.jpg'
    ],
    // indicatorDots: false, 
    // autoplay: false,
    interval: 5000,
    duration: 1000,
    imageURL:"/images/44.png",

    goodsList: [],
    totalPage: 1,
    page: 1,
  },
  
  // onSearch:function(e){
  //   console.log(e);
  // }

  onLoad:function(){
    var me = this;
    var page = me.data.page;
    me.getAllGoodsList(page);
  },

  getAllGoodsList:function(page){
    var me = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待，加载中...',
    })

    wx.request({
      url: serverUrl + '/goods/showAll?page=' + page ,
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();

        console.log(res.data);

        //判断当前页page是否是第一页如果是第一页，那么设置videoList为空
        if (page == 1) {
          me.setData({
            goodsList: []
          })
        }

        var goodsList = res.data.data.rows;
        var newGoodsList = me.data.goodsList;

        me.setData({
          goodsList: newGoodsList.concat(goodsList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl,
        });

      }
    })

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getAllGoodsList(1, 0);
  },


  onReachBottom: function () {
    var me = this;
    var currentPage = me.data.page;
    var totalPage = me.data.totalPage;

    //判断当前页数和总页数是否相等，如果相等则无需查询

    if (currentPage === totalPage) {
      wx.showToast({
        title: '已经没有商品啦',
        icon: "none"
      })
      return;
    }

    var page = currentPage + 1;

    me.getAllGoodsList(page, 0);
  },

  showGoodsInfo:function(e){
    var me = this;
    var goodsList = me.data.goodsList;
    var arrindex = e.target.dataset.arrindex;
    var goodsInfo = JSON.stringify(goodsList[arrindex]);

    console.log(goodsList);
    
    wx.navigateTo({
      url: '../content/content?goodsInfo=' + goodsInfo,
    })
  }
}); 