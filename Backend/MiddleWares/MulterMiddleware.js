import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './Uploads');
    },
    filename: (req, file, callback) => {
        const aadhaar_number = req.body.aadhaar_number;

        if (!aadhaar_number) {
            return callback(new Error("Aadhaar number is required"), null);
        }

        const filename = `image-${aadhaar_number}-${file.originalname}`;
        callback(null, filename);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp") {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error("Please upload the following file extensions (jpg/png/jpeg/webp)"));
    }
};

const multerConfig = multer({
    storage,
    fileFilter
});

export default multerConfig;
