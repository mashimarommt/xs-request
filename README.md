# xs-request
## 简介
微信小程序wx.request API的Ajax实现  
API文档参考[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)
## 注意
+ wx.request返回值类型为DownloadTask，而xs.request返回值类型为XMLHttpRequest，并且无offHeadersReceived和onHeadersReceived方法
+ xs.request中object.success回调函数的参数中无header字段
+ 仅兼容现代浏览器
+ 网络请求超时时间可通过xs.config.networkTimeout字段配置，单位为毫秒，默认值为60000
