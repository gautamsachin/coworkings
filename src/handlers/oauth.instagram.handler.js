var route = require('../utils').route;
var Jimp = require("jimp");
var config  = require('../config');

function _process() {
    return route.createRoute(function (req, res, callback) {

    });
}

function previewV2(previewType) {

    return function (req, res) {
        let filePath = '';
        if (previewType === 'create')
            filePath = `./${config.space_asset.img_temp}/${req.params.id}/${req.params.image_name}`
        else
            filePath = `./${config.space_asset.img_destination}/${req.params.space_id}/${req.params.image_name}`;

        Jimp.read(filePath)
            .then(function (image) {
                var clone = image.clone();

                var ext = clone.getExtension();
                var mime = clone.getMIME();

                if (clone.bitmap.height > clone.bitmap.width) {
                    clone.resize(70, Jimp.AUTO)
                        .quality(60)
                } else {
                    clone.resize(Jimp.AUTO, 124)
                        .quality(60)
                }

                //.greyscale();

                var bytes = clone.getBuffer(mime, function (err, data) {
                    res.set('Content-Type', mime);
                    res.end(data);
                })

            }).catch(function (err) {
                console.error(err);
                res.end('');
            });
    }
}

// function originalPreview(req, res) {
//     var filePath = ;

//     Jimp.read(filePath)
//         .then(function (image) {
//             var clone = image.clone();

//             var ext = clone.getExtension();
//             var mime = clone.getMIME();
//             //.greyscale();
//             var bytes = clone.getBuffer(mime, function (err, data) {
//                 res.set('Content-Type', mime);
//                 res.end(data);
//             })

//         }).catch(function (err) {
//             console.error(err);
//             res.end('');
//         });


// }

module.exports = {
    process: _process,
    previewV2
}