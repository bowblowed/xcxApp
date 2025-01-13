const {
  post
} = require("./api");

async function getProduct(id) {}

async function caculatePrice(productID, userID, prop, count) {
  try {
    const res = await post("/product/caculatePrice", {
      ProductID: productID ,
      UserID: userID ,
      Propm: prop ,
      Count: count ,
    })
    return res 
  } catch ( err ) {
    throw err
  }
}

async function caculateDefaultPrice(productID, userID) {
  try {
    const res = await post("/product/caculateDefaultPrice", {
      ProductID: productID ,
      UserID: userID ,
    })
    return res 
  } catch ( err ) {
    throw err
  }
}

module.exports = {
  caculatePrice : caculatePrice ,
  caculateDefaultPrice : caculateDefaultPrice
}