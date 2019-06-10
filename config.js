exports.tmproot='/data/zimage/temp'; //上传临时目录
exports.imgroot='/data/zimage/img'; //图片存储目录
exports.errorlog='/data/zimage/error.log'; //程序错误日志，记录

exports.port=9001;
exports.appname='Nimg';
exports.maxFileSize=1024*1024;//1024kb 1mb
exports.maxSide=1920; //最大截图边长
exports.minSide=10; //最小截图边长

exports.imgtypes={
        "gif": "image/gif",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png"
};
