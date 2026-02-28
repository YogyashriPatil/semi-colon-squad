import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (only pdf, image, dxf)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png|dxf/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Image, DXF allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
  });
});
export default router;