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
/**
 * input 为需要监听上传的input元素
 * mesFn 提示消息回调，默认window.alert
 * mode  图片格式，默认上传image格式图片
 * bucket oss 的bucket
 * region oss 的region
 * progressFn 上传进度回调
 * uploadSuccess 上传成功回调
 * stsConfig oss 临时授权服务器返回数据
 * prefix 图片名称前缀，默认''
 *
 *
 * @param {configType} {
 *     input,
 *     mesFn = window.alert,
 *     mode = 'image',
 *     bucket,
 *     region,
 *     progressFn,
 *     uploadSuccess,
 *     stsConfig,
 *     prefix
 * }
 */
module.exports = function ({ input, mesFn = window.alert, mode = 'image', bucket, region, progressFn, uploadSuccess, stsConfig, prefix = '' }) {
    let moment = require('moment');
    if (!input) {
        throw new Error('请配置input元素');
    }
    input.addEventListener('change', () => {
        let name = input.name || 'file';
        let formData = new FormData();
        //vuex 保存的文件名称
        let file = input.files[0];
        if (!file)
            return;
        let { type, size } = file;
        let bucket;
        size = size / 1024 / 1024;
        if (mode === 'image') {
            type = type.split('/')[1];
            bucket = 'naertuires';
            let validType = ['jpg', 'png', 'jpeg'];
            if (size > 5) {
                return mesFn('请上传5M以内的图片');
            }
            if (validType.indexOf(type) === -1) {
                return mesFn('请选择jpg,png,jpeg格式的图片上传');
            }
        }
        else if (mode === 'video') {
            bucket = 'nrtvideoin';
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
    });
    /**
     * file 为input里选择的文件
     * mesFn 为回调消息提示函数
     * @param {any} file
     * @param {any} mesFn
     */
    function uploadFile(file, mesFn) {
        let { name: filename } = file;
        let now = moment().format('YYYY-MM-DD-HH-mm-ss-');
        let newFileName = now + filename;
        var uploader = new window.VODUpload({
            // 文件上传失败
            'onUploadFailed': function (fileName, code, message) {
                console.log("onUploadFailed: " + fileName + code + "," + message);
                mesFn('上传失败，请重试！');
            },
            // 文件上传完成
            'onUploadSucceed': function (fileName) {
                let data = {
                    name,
                    fileName: prefix + newFileName
                };
                console.log(newFileName);
                uploadSuccess(data);
                mesFn('上传成功');
            },
            // 文件上传进度，单位：字节
            'onUploadProgress': function (fileName, totalSize, uploadedSize) {
                let progress = (uploadedSize * 100 / totalSize).toFixed(2) + '%';
                progressFn(progress);
                // console.log(progress);
            },
            // token超时
            'onUploadTokenExpired': function (callback) {
                console.log("onUploadTokenExpired");
                mesFn('上传请求超时');
            }
        });
        !function () {
            return __awaiter(this, void 0, void 0, function* () {
                let { AccessKeyId, AccessKeySecret, Expiration, SecurityToken } = stsConfig;
                uploader.init(AccessKeyId, AccessKeySecret, SecurityToken, Expiration);
                uploader.addFile(file, region, bucket, newFileName, {});
                // console.log(uploader.listFiles());
                uploader.startUpload();
            });
        }();
    }
};
