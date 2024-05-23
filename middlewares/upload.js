import multer from "multer";
import path from "node:path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination(req, file, cd) {
        cd(null, path.resolve("tmp"));
    },
    filename(req, file, cd) {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const id = crypto.randomUUID();

        cd(null, `${basename}-${id}${extname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF files are allowed."));
  };
  
  const limits = {
    fileSize: 1024 * 1024 * 5 // Обмеження розміру файлу до 5MB
  };

  export default multer({ storage, fileFilter, limits });