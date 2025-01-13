const WXAPI = require('apifm-wxapi')
const {
  post
} = require('./api')
const {
  checkHasLogined,
  getUser
} = require('./auth')
const { sleep } = require('./time')

async function getShopCart() {
  try {
    const res = await post("/user/shopCart/get")
    return res 
  } catch (err) {
    throw err
  }
}

async function showTabBarBadge() {
  const islogin = checkHasLogined()
  while( !islogin ) {
      await login()
      await sleep(2000)
  }
  const shopCart = await getShopCart()
  const orderCounts = shopCart.OrderItems.length
  if (orderCounts == 0) {
    wx.removeTabBarBadge({
      index: 2,
    })
  } else {
    wx.setTabBarBadge({
      index: 2,
      text: orderCounts.toString(),
    })
  }
}

async function shopCartInsertItems(items) {
  try {
    await post("/user/shopCart/insertItems", items)
  } catch (err) {
      console.log(err)                                                         
  }
}

async function shopCartDeleteItem(idx) {
  try {
    await post("/user/shopCart/deleteItem" , idx)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  showTabBarBadge: showTabBarBadge,
  getShopCart: getShopCart , 
  shopCartInsertItems : shopCartInsertItems ,
  shopCartDeleteItem : shopCartDeleteItem
}