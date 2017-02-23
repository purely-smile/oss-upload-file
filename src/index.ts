import { Lib } from './lib';
import { Config } from './typing';
export function ossFileUpload({
    input,
    files,
    mesFn = window.alert,
    mode = 'image',
    videoBucket,
    imgBucket,
    region = 'http://oss-cn-beijing.aliyuncs.com',
    progressFn,
    uploadSuccess,
    stsConfig,
    prefix = '',
    watch = true,
    debug = false,
    startUploadFn
}: Config) {
    let config: Config = {
        input,
        mesFn,
        mode,
        videoBucket,
        imgBucket,
        region,
        progressFn,
        uploadSuccess,
        startUploadFn,
        stsConfig,
        prefix,
        watch,
        debug
    }
    let lib = new Lib(config);

    lib.checkIsLoadVodload();
    // 如果传入的是input，则获取文件列表。
    if (input) {
        files = input.files;
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        lib.uploadFile(file, i);
    }
}