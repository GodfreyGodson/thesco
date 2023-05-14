const Course = require('../models/course');
const Enrollment = require("../models/enrollment");
const User = require('../models/user');
const fs = require('fs');

exports.create = async (req, res) => {
  const files = req.files;
  let notesFile;
  let imageFile;

  if (files) {
    files.forEach(file => {
      const fileType = file.mimetype.split('/')[1];
      if (fileType === 'pdf' || fileType === 'doc' || fileType === 'ppt' || fileType === 'xls') {
        notesFile = file;
      } else if (fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png') {
        imageFile = file;
      }
    });
  }

  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    notes: notesFile ? `./uploads/${notesFile.fieldname}-${Date.now()}.${notesFile.mimetype.split('/')[1]}` : undefined,
    image: imageFile ? `./uploads/${imageFile.fieldname}-${Date.now()}.${imageFile.mimetype.split('/')[1]}` : undefined
  });

  try {
    await course.save();

    if (notesFile) {
      await fs.promises.rename(notesFile.path, course.notes);
    }

    if (imageFile) {
      await fs.promises.rename(imageFile.path, course.image);
    }

    res.send({ message: 'Course created successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error creating the course: ' + error });
  }
};


exports.delete = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).send({ message: 'Course not found.' });
    }

    if (course.notes) {
      await fs.promises.unlink(course.notes);
    }

    if (course.image) {
      await fs.promises.unlink(course.image);
    }

    await course.remove();

    res.send({ message: 'Course deleted successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting the course: ' + error });
  }
};



// // Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send(courses);
  } catch (err) {
    res.status(500).send(err);
  }
};



// exports.getCourse = (req, res) => {
//     Course.find({}, 'title description price image', (err, courses) => {
//     if (err) {
//     return res.status(500).send(err);
//     }
    
//     return res.status(200).send(courses);
//     });
//     };

exports.getCourse = async (req, res) => {
  const perPage = 8;
  const page = req.query.page || 1;

  try {
    const courses = await Course.find({})
      .select('title description price image')
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

    const count = await Course.countDocuments();

    return res.status(200).send({
      courses: courses,
      current: page,
      pages: Math.ceil(count / perPage),
      total: count
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};


//edit or updates the course 
exports.update = async (req, res) => {
  const courseId = req.params.id;
  const files = req.files;
  let notesFile;
  let imageFile;

  if (files) {
    files.forEach(file => {
      const fileType = file.mimetype.split('/')[1];
      if (fileType === 'pdf' || fileType === 'doc' || fileType === 'ppt' || fileType === 'xls') {
        notesFile = file;
      } else if (fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png') {
        imageFile = file;
      }
    });
  }

  try {
    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).send({ message: 'Course not found.' });
    }

    course.title = req.body.title;
    course.description = req.body.description;
    course.price = req.body.price;

    if (notesFile) {
      course.notes = `./uploads/${notesFile.fieldname}-${Date.now()}.${notesFile.mimetype.split('/')[1]}`;
    }

    if (imageFile) {
      course.image = `./uploads/${imageFile.fieldname}-${Date.now()}.${imageFile.mimetype.split('/')[1]}`;
    }

    await course.save();

    if (notesFile) {
      await fs.promises.rename(notesFile.path, course.notes);
    }

    if (imageFile) {
      await fs.promises.rename(imageFile.path, course.image);
    }

    res.send({ message: 'Course updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating the course: ' + error });
  }
};



// exports.getNotes = async (req, res, next) => {
//   try {
//     const { courseId } = req.params;
//     const { _id: studentId } = req.user;

//     const enrollment = await Enrollment.findOne({
//       student: studentId,
//       course: courseId,
//       isPaid: true,
//     });

//     if (!enrollment) {
//       return res.status(401).json({ message: 'Please pay for this course' });
//     }

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     const notes = course.notes;

//     if (!notes) {
//       return res.status(404).json({ message: 'Notes not found' });
//     }

//     const notesData = Buffer.from(notes, 'base64');
//     res.set('Content-Type', 'application/pdf');
//     res.set('Content-Disposition', `attachment; filename=${course.title} Notes.pdf`);
//     res.send(notesData);
//   } catch (error) {
//     next(error);
//   }
// };



  //   exports.getNotes = (req, res) => {
  //     Course.findById(req.params.id, (error, course) => {
  //     if (error) {
  //     return res.status(500).send({ message: 'Error retrieving the notes' });
  //     }
  //     if (!course) {
  //       return res.status(404).send({ message: 'Course not found' });
  //     }
      
  //     let fileType = course.notes.split('.').pop();
  //     let contentType = '';
  //     if (fileType === 'pdf') {
  //       contentType = 'application/pdf';
  //     } else if (fileType === 'doc' || fileType === 'docx') {
  //       contentType = 'application/msword';
  //     } else {
  //       return res.status(400).send({ message: 'File format not supported' });
  //     }
      
  //     res.contentType(contentType);
  //     res.send(course.notes);
  //   });
  // };
  /*****old */


  exports.getNotes = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { _id: studentId } = req.user;
  
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
        isPaid: true,
      });
  
      if (!enrollment) {
        return res.status(401).json({ message: 'Please pay for this course' });
      }
  
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const notes = course.notes;
  
      if (!notes) {
        return res.status(404).json({ message: 'Notes not found' });
      }
  
      res.download(notes);
    } catch (error) {
      next(error);
    }
  };
  /******New fleva */
  
  // exports.getCourseById = async (req, res) => {
  //   try {
  //     const course = await Course.findById(req.params.id)
  //       .populate({
  //         path: 'subscribers',
  //         select: 'name email isPaid -_id'
  //       })
  //       .populate({
  //         path: 'subscribers.enrollment',
  //         select: 'isPaid -_id'
  //       })
  //       .exec();
  
  //     if (!course) {
  //       return res.status(404).json({ message: 'Course not found' });
  //     }
  
  //     res.json(course);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // };
/****old */

exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: 'enrollments',
      populate: {
        path: 'student',
        select: 'name email isPaid'
      }
    });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    res.send(course);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


  // Update isPaid status of a user in a specific course
// exports.updateUserPaidStatus = async (req, res) => {
//   try {
//     const { courseId, userId } = req.params;
//     const { isPaid } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).send('Course not found');
//     }

//     const userIndex = course.subscribers.findIndex((subscriber) => {
//       return subscriber._id.toString() === userId;
//     });
//     console.log(userIndex);
//     if (userIndex === -1) {
//       return res.status(404).send('User not found in this course');
//     }

//     course.subscribers[userIndex].isPaid = isPaid;
//     await course.save();

//     res.send(course.subscribers[userIndex]);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };
/*****old */


exports.updateUserPaidStatus = async (req, res) => {
  try {
    const { courseTitle, userEmail } = req.params;
    const { isPaid } = req.body;

    const course = await Course.findOne({ title: courseTitle });
    if (!course) {
      return res.status(404).send('Course not found');
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const enrollment = await Enrollment.findOne({ course: course._id, user: user._id});
    console.log(enrollment)
    if (!enrollment) {
      return res.status(404).send('User is not enrolled in this course');
    }
    enrollment.isPaid = isPaid;
    await enrollment.save();
    
    // update the user's isPaid status
    if (isPaid) {
      user.isPaid = true;
    } else {
      user.isPaid = false;
    }
    await user.save();
    
    res.send(enrollment);
    
  } catch (error) {
    res.status(400).send(error.message);
  }
};




  


  // exports.getCourseById = async (req, res) => {
  //   try {
  //     const course = await Course.findById(req.params.id)
  //       .populate({
  //         path: 'subscribers',
  //         select: 'name email -_id'
  //       })
  //       .exec();
  
  //     if (!course) {
  //       return res.status(404).json({ message: 'Course not found' });
  //     }
  
  //     res.json(course);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // };
  


  // exports.getCourseById = async (req, res) => {
  //   try {
  //     const course = await Course.findById(req.params.id)
  //       .populate({
  //         path: 'subscribers',
  //         select: 'paymentStatus name email -_id'
  //       })
  //       .exec();
  
  //     if (!course) {
  //       return res.status(404).json({ message: 'Course not found' });
  //     }
  
  //     res.json(course);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // };
  
  
  
  
  
  



  // exports.getCourseById = async (req, res) => {
  //   try {
  //     const course = await Course.findById(req.params.id)
  //     .populate({ 
  //       path: 'subscribers', 
  //       select: 'name email paymentStatus -_id' 
  //     })
  //     .exec();
    
  
  //     if (!course) {
  //       return res.status(404).json({ message: 'Course not found' });
  //     }
  
  //     res.json(course);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // };
  
      
      






// exports.create = upload.array('notes', 2, (req, res) => {
//   const course = new Course({
//     title: req.body.title,
//     description: req.body.description,
//     price: req.body.price,
//     notes: req.files[0] ? req.files[0].path : undefined,
//     image: req.files[1]? req.files[1].path : undefined
//   });

//   course.save((error) => {
//     if (error) {
//       return res.status(500).send({ message: 'Error creating the course' });
//     }      res.send({ message: 'Course created successfully.' });
//   });
// });



// const mongoose = require('mongoose');
// const Course = require("../models/course");
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Create a course
// exports.createCourse = async (req, res) => {
//   try {
//     const course = new Course({
//       title: req.body.title,
//       description: req.body.description,
//       price: req.body.price,
//     });
//     if (req.files && req.files.notes) {
//       course.notes = req.files.notes[0].buffer.toString('utf-8');
//     }
//     if (req.files && req.files.image) {
//       course.image = req.files.image[0].buffer.toString('base64');
//     }
//     const savedCourse = await course.save();
//     res.status(201).send(savedCourse);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// // Get all courses
// exports.getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).send(courses);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// // Middleware to handle file upload
// exports.uploadFile = upload.array(['notes', 'image']);


// const Course = require('../models/course');
// 




// exports.getAllCourses = async (req, res) => {
//   try {
//   const courses = await Course.find({});
//   const coursesWithDetails = courses.map(course => ({
//     title: course.title,
//     price: course.price,
//     description: course.description,
//     image: course.image.toString('base64')
//   }));
  
//   res.send(coursesWithDetails);

// } catch (error) {
//   res.status(500).send({ message: 'Error retrieving the courses' });
//   }
//   };
  

// exports.getCourse = (req, res) => {
//   Course.find({}, 'title description price image', (err, courses) => {
//   if (err) {
//   return res.status(500).send(err);
//   }
//   res.contentType('image/jpg');
//   return res.status(200).send(courses);
//   });
//   };



// exports.getNotes = (req, res) => {
//   Course.findById(req.params.id, (error, course) => {
//     if (error) {
//       return res.status(500).send({ message: 'Error retrieving the notes' });
//     }

//     if (!course) {
//       return res.status(404).send({ message: 'Course not found' });
//     }

//     res.contentType('application/pdf');
//     res.send(course.notes);
//   });
// };

// exports.getImage = (req, res) => {
//   Course.findById(req.params.id, (error, course) => {
//     if (error) {
//       return res.status(500).send({ message: 'Error retrieving the image' });
//     }

//     if (!course) {
//       return res.status(404).send({ message: 'Course not found' });
//     }

//     res.contentType('image/jpg');
//     res.send(course.image);
//   });
// };





// const express = require("express");
// const User = require("../models/user");
// const Course = require("../models/course");

//  const fs = require('fs');

// // //create courses

// exports.createCourse =  async (req, res) => {
//   try {
//     const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
//     const course = new Course({
//       title: req.body.title,
//       description: req.body.description,
//       price: req.body.price,
//       notes:fs.readFileSync(req.file.path),
//       image: path != "" ? "/" + path : "",
//     });
//     const savedCourse = await course.save();
//     res.status(201).json({
//       message: "Course added successfully",
//       createdCourse: savedCourse
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error
//     });
//   }
// };

// exports.createCourse = async (req, res) => {
// try { 
// const imagePath = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
// const notesPath = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
// const course = new Course({
// title: req.body.title,
// description: req.body.description,
// price: req.body.price,
// notes: notesPath !== "" ? "/" + notesPath : "",
// image: imagePath !== "" ? "/" + imagePath : "",
// });
// const savedCourse = await course.save();
// res.status(201).json({
// message: "Course added successfully",
// createdCourse: savedCourse,
// });
// } catch (error) {
// res.status(500).json({
// error: error,
// });
// }
// };


// // exports.createCourse = async (req, res, next) => {
// //   try {
// //     const notesPath = req.files.notes != undefined ? req.files.notes[0].path.replace(/\\/g, "/") : "";
// //     const imagePath = req.files.image != undefined ? req.files.image[0].path.replace(/\\/g, "/") : "";
// //     const course = new Course({
// //       title: req.body.title,
// //       description: req.body.description,
// //       price: req.body.price,
// //       image: imagePath,
// //       notes: notesPath,
// //     });
// //     const result = await course.save();
// //     res.status(201).json({
// //       message: "Course added successfully",
// //       createdCourse: {
// //         title: result.title,
// //         description: result.description,
// //         _id: result._id
// //       }
// //     });
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({
// //       error: err
// //     });
// //   }
// // };


//   //Get Courses public

//   exports.getCoursesperpage = async(req, res)=>{
//     try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 9;
//     const skip = (page - 1) * limit;
//     const courses = await Course.find({}, {title: 1, description: 1, price: 1, image: 1}).skip(skip).limit(limit);
//     return res.json(courses);
//     } catch (err) {
//     return res.status(404).json({ message: 'No categories found' +err });
//     }
//     };


//     //get course by Id
// exports.getCoursebyId = async (req, res) => {
//      try {
//         const course = await Course.findById(req.params.id, {
//           title: 1,
//           description: 1,
//           price: 1,
//           image: 1
//         });
//         return res.json(course);
//       } catch (err) {
//         return res.status(404).json({ message: "Course not found" + err });
//       }
//     };


//     exports.downloadNotes = async  (req, res) => {
//         const courseId = req.params.courseId;
//         const userId = req.user._id;
//         try {
//         const course = await Course.findById(courseId);
//         if (!course) return res.status(404).send({ message: 'Course not found' });
//         if (!course.notes) return res.status(400).send({ message: 'Notes not available for this course' });
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).send({ message: 'User not found' });

//         const isSubscriber = course.subscribers.some(subscriber => subscriber.equals(userId));
//         if (!isSubscriber) return res.status(401).send({ message: 'Unauthorized access' });

//         res.set('Content-Type', 'application/octet-stream');
//         res.set('Content-Disposition', 'attachment; filename="notes.pdf"');
//         res.send(course.notes);
//     } catch (error) {
//         res.status(500).send({ message: 'Error while downloading the notes' });
//         }
//     }



// // exports.getCoursesperpage = async(req, res)=>{
// //     try {
// //       const page = parseInt(req.query.page) || 1;
// //       const limit = 9;
// //       const skip = (page - 1) * limit;
// //       const courses = await Course.find({}).skip(skip).limit(limit);
// //       return res.json(courses);
// //   } catch (err) {
// //       return res.status(404).json({ message: 'No categories found' +err });
// //   }
// //   };
  




// // const router = express.Router();

// // router.post("/addSubscriber", async (req, res) => {
// //   try {
// //     const { studentId, courseId } = req.body;

// //     // Find the student
// //     const student = await User.findById(studentId);
// //     if (!student) return res.status(400).send("Student not found");
// //     if (student.userType !== "Student")
// //       return res.status(400).send("Not a student user");

// //     // Find the course
// //     const course = await Course.findById(courseId);
// //     if (!course) return res.status(400).send("Course not found");

// //     // Add the student as a subscriber to the course
// //     course.subscribers.push(studentId);
// //     await course.save();

// //     res.send("Student added as subscriber to the course");
// //   } catch (error) {
// //     res.status(500).send(error.message);
// //   }
// // });

// // module.exports = router;
