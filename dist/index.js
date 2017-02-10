module.exports = function ossFileUpload(_a) {
    var input = _a.input, _b = _a.mesFn, mesFn = _b === void 0 ? window.alert : _b, _c = _a.mode, mode = _c === void 0 ? 'image' : _c, bucket = _a.bucket, _d = _a.region, region = _d === void 0 ? 'http://oss-cn-beijing.aliyuncs.com' : _d, progressFn = _a.progressFn, uploadSuccess = _a.uploadSuccess, stsConfig = _a.stsConfig, _e = _a.prefix, prefix = _e === void 0 ? '' : _e, _f = _a.watch, watch = _f === void 0 ? true : _f, _g = _a.debug, debug = _g === void 0 ? false : _g;
    if (!input) {
        throw new Error('请配置input元素');
    }
    if (watch) {
        input.addEventListener('change', checkType);
    }
    else {
        checkType();
    }
    if (!window.VODUpload) {
        console.log('https://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/cn/vod/0.0.4/assets/sdk/js-sdk.zip?spm=5176.doc48501.2.1.EUh9xZ&file=js-sdk.zip');
        throw new Error('请添加oss依赖文件');
    }
    function checkType() {
        var name = input.name || 'file';
        var formData = new FormData();
        var file = input.files[0];
        if (!file)
            return;
        var type = file.type, size = file.size;
        size = size / 1024 / 1024;
        if (mode === 'image') {
            type = type.split('/')[1];
            var validType = ['jpg', 'png', 'jpeg'];
            if (size > 5) {
                return mesFn('请上传5M以内的图片');
            }
            if (validType.indexOf(type) === -1) {
                return mesFn('请选择jpg,png,jpeg格式的图片上传');
            }
        }
        else if (mode === 'video') {
            if (size > 500) {
                return mesFn('不能选择大于500M的视频');
            }
            if (!type.match('video')) {
                return mesFn('请上传视频格式的素材');
            }
        }
        else {
            throw new Error('未知上传格式');
        }
        uploadFile(file, mesFn);
    }
    function uploadFile(file, mesFn) {
        var filename = file.name;
        var date = new Date();
        var now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getMinutes();
        var dot = filename.split('.').pop();
        var newFileName = now + Math.floor(Math.random() * 1000) + '.' + dot;
        var uploader = new window.VODUpload({
            'onUploadFailed': function (fileName, code, message) {
                log("上传失败: " + fileName + code + "," + message);
                mesFn('上传失败，请重试！');
            },
            'onUploadSucceed': function (fileName) {
                var data = {
                    name: name,
                    fileName: prefix + newFileName
                };
                log('上传成功，文件名：', newFileName);
                uploadSuccess(data);
                mesFn('上传成功');
            },
            'onUploadProgress': function (fileName, totalSize, uploadedSize) {
                var progress = (uploadedSize * 100 / totalSize).toFixed(2) + '%';
                progressFn(progress);
                log('上传进度：', progress);
            },
            'onUploadTokenExpired': function (callback) {
                log('上传超时', "onUploadTokenExpired");
                mesFn('上传请求超时');
            }
        });
        var AccessKeyId = stsConfig.AccessKeyId, AccessKeySecret = stsConfig.AccessKeySecret, Expiration = stsConfig.Expiration, SecurityToken = stsConfig.SecurityToken;
        uploader.init(AccessKeyId, AccessKeySecret, SecurityToken, Expiration);
        uploader.addFile(file, region, bucket, newFileName, {});
        log('上传文件列表', uploader.listFiles());
        uploader.startUpload();
    }
    function log() {
        var mes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mes[_i] = arguments[_i];
        }
        if (debug) {
            console.log(mes.slice());
        }
    }
};
