export interface Config {
    input?: HTMLInputElement,
    files?,
    mesFn: Function,
    mode?: string,
    videoBucket?: string,
    imgBucket?: string,
    region: string,
    progressFn: Function,
    uploadSuccess: Function,
    startUploadFn: Function,
    stsConfig: any,
    prefix?: string,
    watch?: boolean,
    debug?: boolean
}