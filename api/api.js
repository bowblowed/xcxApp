var baseUrl = "https://lipeiheng.fun"
async function lrequest(url, method, data = {}, headers = {}) {
  try {
    var header = {
      'Content-Type': 'application/json',
      ...headers
    }
    var token = wx.getStorageSync('token')
    if (token) {
      header.Authorization = token
    }
    const res = await new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        header: header,
        method: method,
        data: data,
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode != 200 || res.data.code != 0) {
      throw new Error(res.data.msg)
    }
    return res.data.data
  } catch (err) {
    throw err
  }
}

module.exports = {
  get: (url, data, header) => lrequest(url, 'GET', data, header),
  post: (url, data, header) => lrequest(url, 'POST', data, header),
};