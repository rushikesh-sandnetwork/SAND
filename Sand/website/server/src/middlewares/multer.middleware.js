import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { 
        fieldSize: 10 * 1024 * 1024, // 10MB
        fileSize: 10 * 1024 * 1024   // 10MB
    } 
});

// Export the fields middleware
export const fields = (fieldArray) => upload.fields(fieldArray);

// Export the single file upload middleware
export const single = (fieldName) => upload.single(fieldName);

export default upload;
