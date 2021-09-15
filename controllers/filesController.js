const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Link = require('../models/Link');

exports.uploadFile = async (req, res, next) => {
    const configurationMulter = {
        limits: { fileSize: (req.user) ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }
    const upload = multer(configurationMulter).single('file');

    upload(req, res, async (error) => {
        if(!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.downloadFile = async (req, res, next) => {
    const { file } = req.params;
    const link = await Link.findOne({ name: file });

    const fileURL  = __dirname + '/../uploads/' + file;
    res.download(fileURL);

    // If the number of downloads is same to 1 - Delete the link and the file
    const { downloads, name } = link;

    if(downloads === 1) {

        // Delete the file
        req.file = name;

        // Delete on db
        await Link.findOneAndRemove(link._id);
        next(); // Follow the next middleware c:
    } else {
        // If the number of downloads > 1 - subtract -1
        link.downloads--;
        await link.save();
    }
}

exports.deleteFile = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
    } catch (error) {
        return res.status(500).json({ msg: 'Oops! Something break' });
    }
}