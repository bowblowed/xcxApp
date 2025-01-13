const { post } = require('../../api/api.js');
const { login , checkHasLogined } = require('../../api/auth.js');
const { getShopCart } = require('../../api/shopcart.js')

const app = getApp()

Page({
  data: {
    shopCart : {} ,
    totalPrice : 0 
  },
  CaculateTotalPrice() {
    const items = this.data.shopCart.OrderItems
    var tmp = 0 
    for(let i = 0  ; i < items.length ; i++) {
      tmp += items[i].Count * items[i].Price
    }
    this.setData({
      TotalPrice : tmp
    })
  } ,
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getWindowInfo().windowWidth
      var scale = (750 / 2) / (w / 2)
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: async function () {
    this.initEleWidth();
  },
  onShow: async function () {
    await this.initShopCart()
  },
  async initShopCart() {
    const res = await getShopCart()
    this.setData({
      shopCart : res
    })
    this.CaculateTotalPrice()
} ,
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  async delItem(e) {
      const idx = e.currentTarget.dataset.idx
      console.log(e)
      if(!checkHasLogined()) {
        login()
      }
      try {
        await post("/user/shopCart/deleteItem" , idx) 
        wx.showLoading({
          title: '',
        })
        await this.initShopCart()
        wx.hideLoading()
      } catch(err) {
        wx.showToast({
          title: '删除失败' + err,
          icon: 'fail', 
          duration: 1000 
        });
      }
  },
  async changeItemCount(idx , count) {
    const item = this.data.shopCart.OrderItems[idx]
    if(count <= 0 ) {
      wx.showToast({
        title: '数量最小为1',
        icon : 'fail' , 
        duration : 1000
      })
      return 
    }
    try {
      await post("/user/shopCart/changeCount" , {
        Idx   : idx ,
        Count : count
      })
      this.initShopCart()
    } catch(err) {
      wx.showToast({
        title: '修改数量失败:' ,
        icon : 'fail' , 
        duration : 1000
      })
    }
  } ,
  async jiaBtnTap(e) {
    const idx = e.currentTarget.dataset.idx;
    const item = this.data.shopCart.OrderItems[idx]
    await this.changeItemCount(idx , item.Count + 1)
  },
  async jianBtnTap(e) {
    const idx = e.currentTarget.dataset.idx;
    const item = this.data.shopCart.OrderItems[idx]
    await this.changeItemCount(idx , item.Count - 1)
  },
  async changeCarNumber(e) {
    const idx = e.currentTarget.dataset.idx
    const num = parseInt(e.detail.value)
    console.log(num)
    console.log(idx)
    await this.changeItemCount(idx , num)
  },
  onChange(event) {
    this.setData({
      shopCarType: event.detail.name
    })
    this.shippingCarInfo()
  },
  goDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + item.goodsId,
    })
  },
})