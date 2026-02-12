import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {// req res cd call back
      cb(null, "./public/temp")// first perameter null second id path where file store
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname);
    }
  })
  
export const upload = multer({ 
    storage, 
});