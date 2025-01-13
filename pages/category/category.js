const {
  post
} = require('../../api/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeCategoryIdx: 0,
    products: [],
    scrolltop: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.initCategories()
    this.setData({
      activeCategoryIdx : 0
    })
    await this.getProductListByCategory()
  },
  async initCategories() {
    const res = await post("/category/list")
    this.setData({
      categories: res
    })
  },
  async getProductListByCategory() {
    try {
      const ID = this.data.categories[this.data.activeCategoryIdx].ID
      const products = await post("/product/listByCategoryId", {
        ID,
        ID
      })
      this.setData({
        products: products
      })
    } catch (err) {
      console.log(err)
    }
  },

  async onCategoryClick(e) { 
    console.log(e)
    const idx = e.target.dataset.idx
    if (idx == this.data.activeCategoryIdx) {
      this.setData({
        scrolltop: 0,
      })
    } else {
      this.setData({
        activeCategoryIdx: idx
      })
      await this.getProductListByCategory();
    }
  },

  bindconfirm(e) {
    this.setData({
      inputVal: e.detail
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },

  async onShow() {
    wx.showLoading({
      title: '加载中',
      mask : true 
    })
    const categoryId = wx.getStorageSync('categoryId')
    wx.removeStorageSync('categoryId')
    const categories = this.data.categories
    if (categoryId) {
      console.log(categoryId)
      console.log(categories)
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].ID == categoryId) {
          console.log('aaa')
          this.setData({
            activeCategoryIdx: i
          })
          break
        }
      }
      await this.getProductListByCategory()
    }
    wx.hideLoading()
  },
  toProductDetail(e ) {
    const id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `/pages/goods-details/index?ID=${id}`,
  })
  } ,
  goodsGoBottom() {},

})