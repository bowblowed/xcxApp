const {
  login
} = require("./api/auth");
const { showTabBarBadge } = require("api/shopcart");
App({
  onLaunch: function () {
    try {
      login()
      // ---------------检测navbar高度
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      this.globalData.menuButtonObject = menuButtonObject;
      const res = wx.getWindowInfo()
      let statusBarHeight = res.statusBarHeight,
        navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
        navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
      this.globalData.navHeight = navHeight;
      this.globalData.navTop = navTop;
      this.globalData.windowHeight = res.windowHeight;
    } catch (err) {
      wx.showToast({
        title: err,
        icon: 'error'
      })
    }
  },

  onShow(e) {
    showTabBarBadge()
  },

  globalData: {

  }
})