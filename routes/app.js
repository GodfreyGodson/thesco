const express = require('express');
const { auth, isStudent, isAdmin } = require('../middlewares/auth');

const userController = require("../controllers/user");
const courseController = require("../controllers/course");
const ExamCategoryController = require('../controllers/exam');
const  uploadImages = require("../middlewares/course-upload");
const questionsController = require('../controllers/questiontext');
const resultsController = require('../controllers/result');
const levelController = require('../controllers/level');
const categoryController = require('../controllers/categoryexam');
const enrollController = require('../controllers/enrollment');
const subscriptionController = require('../controllers/subscription');

const examController = require('../controllers/questiontext');

const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ['application/pdf', 'application/msword', 'application/vnd.ms-powerpoint', 'application/vnd.ms-excel', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ dest: 'uploads/', fileFilter });







// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
//     }
//   });
//   const upload = multer({ storage });
// const multer = require('multer');
// const storage = multer.diskStorage({
// destination: function(req, file, cb) {
// cb(null, './uploads/');
// },
// filename: function(req, file, cb) {
// cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
// }
// });
// const multer = require('multer');

// const upload = multer({ dest: 'uploads/' });
// const multer = require('multer');
// const uploads = multer({ dest: '/uploads/coursenotes' });

 //const uploadImages = require("../middlewares/course-upload.js");

//const uploadImages = require("../middlewares/course-upload.js");
const router = express.Router();
//Authentication routes
router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);

router.put('/users/:userId/paidStatus', userController.updateUserPaidStatus);


router.post("/student", enrollController.addSubscriber);
router.put("/enrollments/:enrollmentId", enrollController.updateEnrollmentStatus);


router.put('/status/:email', subscriptionController.updatePaymentStatus);

router.post('/courses', upload.array('files', 2),  courseController.create);
//router.patch('/:courseId/users/:userId', courseController.updateUserPaidStatus);
router.put("/:courseTitle/users/:userEmail/paid-status", courseController.updateUserPaidStatus);
router.get("/courses", courseController.getCourses);
router.get("/course", courseController.getCourse);
router.get("/course/:courseId", courseController.getCourseById);
router.put('/courses/:id', courseController.update);
router.delete('/courses/:id', courseController.delete);
//router.get('/courses/:id/notes', courseController.getNotes);

router.get('/courses/:courseId/notes', auth, courseController.getNotes);



router.post('/exam',  uploadImages.single('image'), ExamCategoryController.createExams);
router.get('/exam', ExamCategoryController.getExamCategories);
router.get('/exam/filter-categories', ExamCategoryController.getExamCategories);
// router.get('/:id', ExamCategoryController.getExamCategoryById);
// router.put('/:id', uploadImages.single('image'), ExamCategoryController.updateExamCategory);

router.post('/level', levelController.createLevel);
router.get('/levels', levelController.getAllLevels);



// Route for creating a new category
router.post('/ecategory', categoryController.createCategory);

// Route for getting all categories
router.get('/ecategories', categoryController.getAllCategories);


router.post('/addqns', questionsController.addQuestion);
router.get('/qns', questionsController.getQuestions);
router.put('/:id', questionsController.editQuestion);
router.delete('/:id', questionsController.deleteQuestion);


router.post('/results', resultsController.addResult);
router.get('/results/:exam', resultsController.getResultsForExam);


//temporary cancell next time you uncomment

router.get('/questions/:examCategory', questionsController.getQuestions);

router.get('/:examCategory', examController.getQuestions);
router.post('/:examCategory', examController.postQuestion);

router.patch('/:examCategory/:questionId', examController.editQuestion);
router.delete('/:examCategory/:questionId', examController.deleteQuestion);

router.get('/:quizeCategory', ExamCategoryController.startExam);
router.post('/:questionId',ExamCategoryController.submitAnswer);


//router.post('/course', upload.array('files', 2), courseController.create);

//router.post("/course",  uploadImages.single('image'),  uploads.single('notes'), courseController.createCourse);
//Courses Routes
//router.post("/course",  uploadNotes.uploadNotes.single('notes'), uploadImage.uploadImages.single('image'), courseController.createCourse);
// Courses Routes
//router.post("/course", upload.fields([{ name: "notes", maxCount: 1 }, { name: "image", maxCount: 1 }]), courseController.createCourse);

//router.post("/course", upload.fields([{ name: "notes", maxCount: 1 }, { name: "image", maxCount: 1 }]), courseController.createCourse);
//router.get("/course/:id", courseController.getCoursebyId);
//router.post("/course",  courseController.createCourse);
//router.get("/download-course/:courseId", courseController.downloadNotes);


// router.post("/enrollment", enrollmentController.addSubscriber);
// router.get("/enrollments", enrollmentController.getEnrollments);





module.exports = router;
