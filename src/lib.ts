import { Config } from './typing';
export class Lib {
    private type: string;
    private prefix: string = '';
    constructor(
        private config: Config
    ) { }
    checkIsLoadVodload() {
        /**
         * 判断是否加载了oss依赖文件
         */
        if (!(<any>window).VODUpload) {
            console.log('https://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/cn/vod/0.0.4/assets/sdk/js-sdk.zip?spm=5176.doc48501.2.1.EUh9xZ&file=js-sdk.zip');
            throw new Error('请添加oss依赖文件');
        }
    }
    checkFileType(file) {
        /**
         * 检查文件类型,获取对应的bucket
         */
        let {imgBucket, videoBucket, mesFn} = this.config;
        if (!file) return;
        let { type, size, name} = file;
        size = Math.floor(size / 1024 / 1024);
        let typeArr = type.split('/');
        let [fileType, dot] = typeArr;
        let acceptType = ['video', 'image'];
        switch (fileType) {
            case 'image':
                let validType = ['jpg', 'png', 'jpeg'];
                if (size > 5) {
                    return mesFn(`文件：${name},请上传5M以内的图片`);
                }
                if (validType.indexOf(dot) === -1) {
                    return mesFn(`文件：${name},请选择jpg,png,jpeg格式的图片上传`);
                }
                this.prefix = 'oss://';
                this.type = 'image';
                return imgBucket;
            case 'video':
                if (size > 5000) {
                    return mesFn(`当前视频:${name},大小：${size}M,请选择大于500M的视频`);
                }
                this.prefix = '';
                this.type = 'video';
                return videoBucket;
            default:
                return mesFn(`该文件:${name}不是图片或视频文件`);
        }

    }
    uploadFile(file, index: number) {
        /**
         * 上传文件
         */
        let that = this;
        let {uploadSuccess, progressFn, region, stsConfig, mesFn, startUploadFn} = this.config;
        let {
            name: basename
        } = file;

        // 判断文件类型，获取对应的bucket
        let bucket = this.checkFileType(file);
        if (!bucket) return;
        let newFileName = this.getNewFileName(basename);

        // 开始上传图片的回调
        let [base, dot] = basename.split('.');
        let fnData = {
            basename: base,
            dot,
            filename: this.prefix + newFileName,
            type: this.type,
            progress: '0',
            index
        };
        startUploadFn && startUploadFn(fnData)

        var uploader = new (<any>window).VODUpload({
            // 文件上传失败
            onUploadFailed(fileName, code, message) {
                that.log("上传失败: " + fileName + code + "," + message);
                // mesFn('上传失败，请重试！');
            },
            // 文件上传完成
            onUploadSucceed(fileName) {
                that.log('上传成功，文件名：', newFileName);
                uploadSuccess && uploadSuccess(fnData);
                // mesFn('上传成功');
            },
            // 文件上传进度，单位：字节
            onUploadProgress(fileName, totalSize, uploadedSize) {
                let progress = (uploadedSize * 100 / totalSize).toFixed(2);
                fnData.progress = progress;
                progressFn && progressFn(fnData)
                that.log('上传进度：', progress);
            },
            // token超时
            onUploadTokenExpired(callback) {
                that.log('上传超时', "onUploadTokenExpired");
                // mesFn('上传请求超时');
            }
        });

        let {
            AccessKeyId,
            AccessKeySecret,
            Expiration,
            SecurityToken
        } = stsConfig;
        uploader.init(AccessKeyId, AccessKeySecret, SecurityToken, Expiration);

        uploader.addFile(file,
            region,
            bucket,
            newFileName,
            {}
        )
        this.log('上传文件列表', uploader.listFiles());
        uploader.startUpload();
    }
    getNewFileName(filename: string) {
        /**
         * 获取时间格式的新文件名称
         */
        let {prefix} = this.config;
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getMinutes()}`;
        let dot = filename.split('.').pop();
        return now + Math.floor(Math.random() * 1000) + '.' + dot
    }
    log(...mes) {
        /**
         * 打印日志
         */
        let {debug} = this.config;
        if (debug) {
            console.log([...mes])
        }
    }
}