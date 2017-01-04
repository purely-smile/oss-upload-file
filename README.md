## oss-upload-file

> 基于阿里云oss 浏览器端上传图片借口的封装


 * input 为需要监听上传的input元素
 * mesFn 提示消息回调，默认window.alert
 * mode  图片格式，默认上传image格式图片
 * bucket oss 的bucket
 * region oss 的region
 * progressFn 上传进度回调
 * uploadSuccess 上传成功回调
 * stsConfig oss 临时授权服务器返回数据
 * prefix 图片名称前缀，默认''