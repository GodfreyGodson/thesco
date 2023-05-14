const express = require("express");
const Enrollment = require("../models/enrollment");
const Course = require('../models/course.js');
const User = require('../models/user');



//Admin get enrollment courses and students

exports.getEnrollments = async(req, res)=>{
    try {
        const enrollments = await Enrollment.find().populate('student course');
        return res.json(enrollments);
      } catch (err) {
        return res.status(404).json({ message: 'No enrollments found' + err });
      }
    };

//Admin add student as subscriber

// exports.addSubscriber = async(req, res)=>{
//     try {
//     // Check if the student exists in the User model
//     const student = await User.findOne({ email: req.body.email });
//                 if (!student) return res.status(400).send({ error: 'Student not found' });
//         //Check if the course exists in the Course model
// const course = await Course.findOne({ title: req.body.course });
// if (!course) return res.status(400).send({ error: 'Course not found' });

// // Check if the student is already enrolled in the course
// const enrollment = await Enrollment.findOne({ student: student._id, course: course._id });
// if (enrollment) return res.status(400).send({ error: 'Student already enrolled in this course' });

// // Add the student to the course as a subscriber
// course.subscribers.push(student._id);
// await course.save();

// // Create a new enrollment record
// const newEnrollment = new Enrollment({ student: student._id, course: course._id });
// await newEnrollment.save();

// res.send({ success: 'Student added to course as subscriber' });

//     }catch (error) {
//         res.status(500).send({ error: 'Error adding student to course' });
//         }

// }



/**********old */




exports.addSubscriber = async (req, res) => {
  try {
    const { email, course } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the course by title
    const foundCourse = await Course.findOne({ title: course });
    console.log(foundCourse);
    if (!foundCourse) {
      return res.status(404).send('Course not found');
    }
     
    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ course: foundCourse._id, student: user._id });
    if (existingEnrollment) {
      return res.status(400).send('User is already enrolled in this course');
    }

    // Create a new enrollment record
    const newEnrollment = new Enrollment({ student: user._id, course: foundCourse._id });
    // Create a new enrollment record
//const newEnrollment = new Enrollment({ student: user._id, course: foundCourse._id, isPaid: true });

    await newEnrollment.save();

    // Add the new enrollment to the course
    foundCourse.enrollments.push(newEnrollment._id);
    await foundCourse.save();

    res.send(newEnrollment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


exports.updateEnrollmentStatus = async (req, res) => {
  const { enrollmentId } = req.params;
  const { isPaid } = req.body;

  try {
    const enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, { isPaid }, { new: true });

    if (!enrollment) {
      return res.status(404).send('Enrollment not found');
    }

    return res.status(200).json(enrollment);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
};



