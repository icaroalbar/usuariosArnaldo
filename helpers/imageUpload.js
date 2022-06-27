const multer = require('multer')
const path = require('path')

const imageStorange = multer.diskStorage({
    destination: function (req, file, cb) {

        req.baseUrl.includes('users')
        cb(null, 'public/img/users')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

const imageUpload = multer({
    storage: imageStorange,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) return cb(new Error("Apenas images JPEG ou PNG são aceitas"))
        cb(undefined, true)
    }
})

module.exports = { imageUpload }