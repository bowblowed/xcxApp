const WXAPI = require('apifm-wxapi')
const AUTH = require('../../api/auth')
const CONFIG = require('../../config')
const APP = getApp()
const {
  post
} = require('../../api/api')
Page({
  data: {
    inputVal: "", // 搜索框内容
    banners: [],
    loadingHidden: false, // loading
    selectCurrent: 0,
    categories: [],
    products: [],
  },
  tabClick(e) {
    // 商品分类点击
    const category = this.data.categories.find(ele => {
      return ele.ID == e.currentTarget.dataset.id
    })
    wx.setStorageSync("categoryId", category.ID)
    wx.switchTab({
      url: '/pages/category/category',
    })
  },
  toDetailsTap: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goods-details/index?ID=${id}`,
    })
  },

  onLoad: function (e) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    this.initBanners()
    this.initCategories()
    this.initGoodList()
  },

  initBanners() {
    post("/banner/list").then(res => {
      this.setData({
        banners: res
      })
    })
  },
  onShow: function (e) {
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject //小程序胶囊信息
    })
    const refreshIndex = wx.getStorageSync('refreshIndex')
    if (refreshIndex) {
      this.onPullDownRefresh()
      wx.removeStorageSync('refreshIndex')
    }
  },
  initCategories() {
    post("/category/list").then((res) => {
      this.setData({
        categories: res
      })
    })
  },
  async initGoodList() {
    const res = await post("/product/list")
    for( let i = 0 ; i < res.length ; i++ ) {

    }
    this.setData({
      products : res
    })
  },

  goSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
})