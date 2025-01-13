const {
  post
} = require('./api.js')

function checkHasLogined() {
  try {
    const token = wx.getStorageSync('token')
    if (!token) {
      return false
    }
    const user = wx.getStorageSync('user')
    if (!user) {
      return false;
    }
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

async function login() {
  try {
    const res = await wx.login()
    const token = await post("/wxLogin", {
      Code: res.code
    })
    const user = await post("/user/getInfo")
    wx.setStorageSync('token', token)
    wx.setStorageSync('user', user)
  } catch (err) {
    wx.removeStorageSync('token')
    wx.removeStorageSync('user')
    throw err
  }
}

async function getUser() {
  const res = checkHasLogined()
  if (!res) {
    await login()
  }
  const user = wx.getStorageSync('user')
  return user
}

function loginOut() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('user')
}

module.exports = {
  checkHasLogined: checkHasLogined,
  login: login,
  loginOut: loginOut,
  getUser: getUser
}