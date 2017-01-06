var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var newFileName = now + filename;
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
        !function () {
            return __awaiter(this, void 0, void 0, function () {
                var AccessKeyId, AccessKeySecret, Expiration, SecurityToken;
                return __generator(this, function (_a) {
                    AccessKeyId = stsConfig.AccessKeyId, AccessKeySecret = stsConfig.AccessKeySecret, Expiration = stsConfig.Expiration, SecurityToken = stsConfig.SecurityToken;
                    uploader.init(AccessKeyId, AccessKeySecret, SecurityToken, Expiration);
                    uploader.addFile(file, region, bucket, newFileName, {});
                    log('上传文件列表', uploader.listFiles());
                    uploader.startUpload();
                    return [2 /*return*/];
                });
            });
        }();
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
