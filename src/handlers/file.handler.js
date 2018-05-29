const fs = require('fs'),
    route = require('../utils').route,
    config = require('../config'),
    _difference = require('lodash').difference;

function saveSpaceImages(userId, spaceId, files, action, next) {
    var rootDestinationDir = `./${config.space_asset.img_destination}`;
    var destSpaceDir = `./${config.space_asset.img_destination}/${spaceId}`;

    if (!fs.existsSync(rootDestinationDir)) {
        fs.mkdirSync(rootDestinationDir);
    }

    if (!fs.existsSync(destSpaceDir)) {
        fs.mkdirSync(destSpaceDir);
    }

    if (action == 'update') {
        let oldImages = getFiles(destSpaceDir);
        let deletedFiles = _difference(oldImages, files);
        try {
            deletedFiles.forEach(function (file, idx) {
                fs.unlinkSync(`${destSpaceDir}/${file}`);
            });
        } catch (err) {
            console.log('Error deleting old file but, it is ignored');
        }
    }


    files.map(file => {
        try {
            var tempFilePath = `./${config.space_asset.img_temp}/${userId}/${file}`;

            if (action == 'create') {
                if (!fs.existsSync(tempFilePath))
                    throw 'Something went wrong when uploading image';

                fs.renameSync(tempFilePath, `${destSpaceDir}/${file}`);
            } else {
                var spaceFilePath = `${destSpaceDir}/${file}`;

                if (fs.existsSync(tempFilePath)) {
                    fs.renameSync(tempFilePath, `${destSpaceDir}/${file}`);
                }
                else if (!fs.existsSync(spaceFilePath)) {
                    throw `Something went wrong with file ${file}.`;
                }



            }
        }
        catch (err) {
            deleteFolderRecursive(destSpaceDir);
            let error = new Error('Failed to moved, removing orphan images');
            next(error);
        }
    });
    next();
};

function getFiles(dirPath) {
    if (fs.existsSync(dirPath)) {
        return fs.readdirSync(dirPath);
    }

    return [];
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function deleteFolder(dirPath) {
    deleteFolderRecursive(dirPath);
}

function deleteSpaceFolder(spaceId) {
    let path = `./${config.space_asset.img_destination}/${spaceId}`;
    deleteFolderRecursive(path);
}

module.exports = {
    saveImages: saveSpaceImages,
    deleteSpaceFolder,
    deleteFolder
}