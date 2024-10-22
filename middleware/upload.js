const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/profile_images");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // const userId = req.body.userId;
    const fileName = `${req.body.name}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
