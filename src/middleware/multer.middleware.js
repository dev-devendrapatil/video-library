import multer from "multer";
var maxSize = 50 * 1000 * 1000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }, 
});
