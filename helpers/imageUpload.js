const multer = require('multer')
const path = require('path')

const imageStorange = multer.diskStorage({
    destination: function (req,file,cb) {

        req.baseUrl.includes('users')
        cb(null, 'public/img/users')
    }

})