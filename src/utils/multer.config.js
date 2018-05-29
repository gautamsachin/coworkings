var multer = require('multer'),
    fs = require('fs'),
    config = require('../config'),
    path = require('path');


const storageSettings = multer.diskStorage({
    destination: function (req, file, cb) {

        let userId = req.user.identity._id;
        let uploadType=req.query.type;
 
        var tempFolder = `./${config.space_asset.img_temp}`;
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder);
        }

        var userFolder = `./${config.space_asset.img_temp}/${userId}`;
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder);
        }

        cb(null, `${userFolder}`);
    },
    filename: function (req, file, cb) {
        let now = new Date();
        let yr = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDay(),
            hr = now.getHours(),
            min = now.getMinutes(),
            sec = now.getSeconds(),
            msec = now.getMilliseconds();
        let name = `${yr}-${m}-${d}_${hr}_${min}_${sec}_${msec}`;
        let ext = path.extname(file.originalname);

        cb(null, `${name}${ext}`.toLowerCase());
        
    }
});

//	Multer Settings
const upload = multer({
    storage: storageSettings,
    limits: {
        files: 1,
        fileSize: 20 * 1024 * 1024
    }
});

module.exports = upload;