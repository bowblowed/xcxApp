import { post } from '../../api/api.js'
import { shopCartInsertItems, showTabBarBadge } from '../../api/shopcart.js'
import { getUser } from '../../api/auth'
Page({
  data: {
    product: {},
    hideShopPopup: true,
    buyNumber: 1 ,
    createTabs:true , 
    priceCount : 0 , 
    propChosen : {}
  },
  bindscroll(e) {
    if (this.data.tabclicked) {
      return
    }
    this.getTopHeightFunction()
    var tabsHeight = this.data.tabsHeight 
    if (this.data.tabs[0].topHeight-tabsHeight<=0 && 0 < this.data.tabs[1].topHeight-tabsHeight) { 
      this.setData({
        active: this.data.tabs[0].tabs_name 
      })
    } else if (this.data.tabs.length == 2) {
      this.setData({
        active: this.data.tabs[1].tabs_name
      })
    } else if (this.data.tabs[1].topHeight-tabsHeight<=0 && 0 < this.data.tabs[2].topHeight-tabsHeight) {
      this.setData({
        active: this.data.tabs[1].tabs_name
      })
    } else if (this.data.tabs[2].topHeight-tabsHeight<=0) {
      this.setData({
        active: this.data.tabs[2].tabs_name
      })
    }
  },
  onLoad(e) {
    this.setData({
      tabs : [{
        tabs_name: '商品简介',
        view_id: 'swiper-container',
        topHeight: 0
      }, {
        tabs_name: '商品详情',
        view_id: 'goods-des-info',
        topHeight: 0,
      }]
    })
  },

  async onShow(e) {
    var query = wx.createSelectorQuery();
    query.select('#tabs').boundingClientRect((rect) => {
      var tabsHeight = rect.height
      this.setData({
        tabsHeight:tabsHeight
      })
    }).exec()
    console.log(this.options)
    await this.initProduct(parseInt(this.options.ID))
  },
  async initProduct(id) {
    const product = await post("/product/get" , {
        ID : id
    })
    this.setData({
      product : product
    })
  },
  getTopHeightFunction() {
    var that = this
    var tabs = that.data.tabs
    tabs.forEach((element, index) => {
      var viewId = "#" + element.view_id
      that.getTopHeight(viewId, index)
    });
  },
  getTopHeight(viewId, index) {
    var query = wx.createSelectorQuery();
    query.select(viewId).boundingClientRect((rect) => {
      if (!rect) {
        return
      }
      let top = rect.top
      var tabs = this.data.tabs
      tabs[index].topHeight = top
      this.setData({
        tabs: tabs
      })
    }).exec()
  },
  async CaculatePrice() {
    const user = await getUser()
    const res = await post("/product/caculatePrice" , {
      ProductID : this.data.product.ID ,
      UserID :    user.ID , 
      Propm     :  this.data.propChosen,
      Count     : this.data.buyNumber, 
    })
    this.setData({
      priceShow : res 
    })
  } ,
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },

  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
  },

  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false,
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  stepChange(event) {
    this.setData({
      buyNumber: event.detail
    })
    this.CaculatePrice()
  },
  /**
   * 选择商品规格
   */
  async labelItemTap(e) {
    const data = e.currentTarget.dataset
    const key = data.propkey 
    const value = data.propvalue
    const propChosen = this.data.propChosen 
    propChosen[key] = value
    this.setData({
      propChosen : propChosen
    })
    await this.CaculatePrice()
  },
  
  async addShopCar() {
    try {
      const product = this.data.product
      for(let key in product.Props)  {
          if(!this.data.propChosen[key]) {
            wx.showModal({
              title: '提示',
              content: '属性必须选择',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return 
          }
      }
      var OrderItem = {
        ProductId : product.ID , 
        Props : this.data.propChosen ,
        Count : this.data.buyNumber ,
        Price : this.data.priceShow / this.data.buyNumber
      }
      await shopCartInsertItems([OrderItem])
      await showTabBarBadge()
    } catch(err) {
      wx.showModal({
        title: '错误',
        content: err,
        complete: (res) => {
          if (res.cancel) {
            
          }
          if (res.confirm) {
            
          }
        }
      })
    } 
    wx.showToast({
      title: '操作成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      hideShopPopup : true 
    })
  },

  buyNow: function (e) {
    var user = wx.getStorageSync('user')
    if( !user ) {
        console.log("登录失败")
    }
    var props = this.data.props
    var propm = new Map()
    for(let i = 0 ; i < props.length ; i++) {
      for(let j = 0; j < props[i].value.length ; j++) {
        propm[props[i].key] = props[i].value[j]
      }
    }
    var order = {
      UserId : user.ID ,
      OrderItems : [
        {
          ProductId : this.data.product.ID ,
          Props : propm , 
          Count : this.data.buyNumber , 
          Price : this.data.priceShow / this.data.buyNumber
        }
      ] , 
      Address : user.Address ? user.Address : "" ,
      TotalPrice : this.data.priceShow ,
    }
    this.closePopupTap();
    wx.navigateTo({
      url: "/pages/order-confirm/index?order=" + encodeURIComponent(JSON.stringify(order))
    })
  },


  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  onTabsChange(e) {
    var index = e.detail.index
    this.setData({
      toView: this.data.tabs[index].view_id,
      tabclicked: true
    })
    setTimeout(() => {
      this.setData({
        tabclicked: false
      })
    }, 1000);
  },
})

