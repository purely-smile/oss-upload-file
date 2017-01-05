## oss-upload-file

> 基于阿里云oss 浏览器端上传图片借口的封装

1. 页面中添加阿里云插件库,[下载地址](https://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/cn/vod/0.0.4/assets/sdk/js-sdk.zip?spm=5176.doc48501.2.1.EUh9xZ&file=js-sdk.zip)

2. npm i oss-upload-file

3. 引用插件

```js
var ossUploadFile = require('oss-upload-file');

ossUploadFile(config)
```

4. config 配置参数

 * input 为需要监听上传的input元素
 * mesFn 提示消息回调，默认window.alert
 * mode  图片格式，默认上传image格式图片
 * bucket oss 的bucket
 * region oss 的region,默认'http://oss-cn-beijing.aliyuncs.com'
 * progressFn 上传进度回调
 * uploadSuccess 上传成功回调
 * stsConfig oss 临时授权服务器返回数据
 * prefix 图片名称前缀，默认''
 * watch 是否绑定input change事件，默认true，不绑定为手动触发
 * debug 是否显示日志，默认false