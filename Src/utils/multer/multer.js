import multer from "multer";

// Rasm turini va hajmini tekshirish
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Faylni saqlash joyi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Fayl nomini o'zgartirish
  },
});

const fileFilter = (req, file, cb) => {
  // Rasm turini tekshirish (PNG, JPG, JPEG)
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Rasmni qabul qilish
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false); // Rasm turi mos kelmasa xatolik
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

export { upload };
