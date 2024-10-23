import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // console.log("Multer is running", cb);
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      // console.log("Processing file:", file);
      cb(null, file.originalname);
    }
  })
  // 
export const upload = multer({ 
    storage, 
})