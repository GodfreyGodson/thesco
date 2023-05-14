
const express = require('express');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/courseimages")
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" +file.originalname);
    }
});

const fileFilter = (req, file, callback)=>{
    const acceptableExt = [".png",".jpg", ".jpeg"];
    if(!acceptableExt.includes(path.extname(file.originalname))){
        return callback(new Error("Only .png, .jpg and .jpeg format allowed"));
    }
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 1048576){
        return callback(new Error("File size Big"));
    }
    callback(null, true);
};
const uploadImages = multer({ storage: storage, fileFilter: fileFilter, fileSize: 1048576, });


module.exports = uploadImages;


// const storage = multer.diskStorage({
// destination: function(req, file, cb) {
// cb(null, path.join(__dirname, '..', 'uploads', 'coursenotes'));
// },
// filename: function(req, file, cb) {
// cb(null, new Date().toISOString() + file.originalname);
// }
// });

// const fileFilter = (req, file, cb) => {
// if (
// file.mimetype === "image/jpeg" ||
// file.mimetype === "image/png" ||
// file.mimetype === "application/pdf"
// ) {
// cb(null, true);
// } else {
// cb(null, false);
// }
// };

// const upload = multer({
// storage: storage,
// limits: {
// fileSize: 1024 * 1024 * 5
// },
// fileFilter: fileFilter
// });

// module.exports = upload;

// const notesStorage = multer.diskStorage({
// destination: function(req, file, cb){
// cb(null, "./uploads/coursenotes")
// },
// filename: function(req, file, cb){
// cb(null, Date.now() + "-" +file.originalname);
// }
// });

// const imageStorage = multer.diskStorage({
// destination: function(req, file, cb){
// cb(null, "./uploads/courseimages")
// },
// filename: function(req, file, cb){
// cb(null, Date.now() + "-" +file.originalname);
// }
// });

// const notesFilter = (req, file, callback)=>{
// const acceptableExt = [".txt",".pdf", ".docx"];
// if(!acceptableExt.includes(path.extname(file.originalname))){
// return callback(new Error("Only .txt, .pdf and .docx format allowed for notes"));
// }
// const fileSize = parseInt(req.headers["content-length"]);
// if (fileSize >  25 * 1048576){
// return callback(new Error("File size too big for notes, max 25MB allowed"));
// }
// callback(null, true);
// };

// const imageFilter = (req, file, callback)=>{
// const acceptableExt = [".png",".jpg", ".jpeg"];
// if(!acceptableExt.includes(path.extname(file.originalname))){
// return callback(new Error("Only .png, .jpg and .jpeg format allowed for images"));
// }
// const fileSize = parseInt(req.headers["content-length"]);
// if (fileSize > 1048576){
// return callback(new Error("File size too big for images"));
// }
// callback(null, true);
// };

// const uploadNotes = multer({ storage: notesStorage, fileFilter: notesFilter, fileSize: 1048576, });
// const uploadImages = multer({ storage: imageStorage, fileFilter: imageFilter, fileSize: 1048576, });

// module.exports = {uploadNotes, uploadImages};