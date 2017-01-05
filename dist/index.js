var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class configType {
}
module.exports = function ({ input, mesFn = window.alert, mode = 'image', bucket, region = 'http://oss-cn-beijing.aliyuncs.com', progressFn, uploadSuccess, stsConfig, prefix = '', watch = true, debug = false }) {
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
    /**
     * 检查上传类型
     *
     * @returns
     */
    function checkType() {
        let name = input.name || 'file';
        let formData = new FormData();
        //vuex 保存的文件名称
        let file = input.files[0];
        if (!file)
            return;
        let { type, size } = file;
        size = size / 1024 / 1024;
        if (mode === 'image') {
            type = type.split('/')[1];
            let validType = ['jpg', 'png', 'jpeg'];
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
    /**
     * file 为input里选择的文件
     * mesFn 为回调消息提示函数
     * @param {any} file
     * @param {any} mesFn
     */
    function uploadFile(file, mesFn) {
        let { name: filename } = file;
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getMinutes()}`;
        let newFileName = now + filename;
        var uploader = new window.VODUpload({
            // 文件上传失败
            'onUploadFailed': function (fileName, code, message) {
                log("上传失败: " + fileName + code + "," + message);
                mesFn('上传失败，请重试！');
            },
            // 文件上传完成
            'onUploadSucceed': function (fileName) {
                let data = {
                    name,
                    fileName: prefix + newFileName
                };
                log('上传成功，文件名：', newFileName);
                uploadSuccess(data);
                mesFn('上传成功');
            },
            // 文件上传进度，单位：字节
            'onUploadProgress': function (fileName, totalSize, uploadedSize) {
                let progress = (uploadedSize * 100 / totalSize).toFixed(2) + '%';
                progressFn(progress);
                log('上传进度：', progress);
            },
            // token超时
            'onUploadTokenExpired': function (callback) {
                log('上传超时', "onUploadTokenExpired");
                mesFn('上传请求超时');
            }
        });
        !function () {
            return __awaiter(this, void 0, void 0, function* () {
                let { AccessKeyId, AccessKeySecret, Expiration, SecurityToken } = stsConfig;
                uploader.init(AccessKeyId, AccessKeySecret, SecurityToken, Expiration);
                uploader.addFile(file, region, bucket, newFileName, {});
                log('上传文件列表', uploader.listFiles());
                uploader.startUpload();
            });
        }();
    }
    /**
     * 打印日志
     *
     * @param {any} mes
     */
    function log(...mes) {
        if (debug) {
            console.log([...mes]);
        }
    }
};
