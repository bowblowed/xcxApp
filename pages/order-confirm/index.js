// pages/order-confirm/index.js
const { post } = require('../../api/api')
Page({
  data: {
    paymentShow : false , 
    User : {

    } ,
    Address : {

    } ,
    Phone : "" , 
    Order : {

    } , 
    Products : [] ,
    ProductPics : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      User : wx.getStorageSync('user')
    })
    this.setData({
      Order : JSON.parse(decodeURIComponent(options.order))
    })
    var productId = []
    var productPicId = []
    var orderItems = this.data.Order.OrderItems
    for(let i = 0 ; i < orderItems.length ; i++) {
       productId.push(orderItems[i].ProductId)
    }
    post("/product/listById",{
      IDs : productId
    }).then(res=> {
      this.setData({
      Products : res
    })
    for(let i = 0 ; i < res.length ; i++) {
      productPicId.push(res[i].PicId)
    }
    return getPicSrcs(productPicId)
  }).then(res=>{
    console.log(res)
    this.setData({
      ProductPics : res
    })
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
  ,
  onSubmit() {
    this.setData({
      paymentShow : true
    })
    post("/order/create").then(res=>{
      
    })
  } ,
  paymentCancel() {
    this.setData({
      paymentShow : false 
    })
  }
})