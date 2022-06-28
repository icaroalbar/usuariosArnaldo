const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {

    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) return cb(new Error("Por favor, envie apenas png, jpg ou jpeg!"))
    
    cb(undefined, true);
  },
});

module.exports = { imageUpload };