const express = require('express');
const ExamCategory = require('../models/exam');
const Question = require('../models/questiontext');
const Level = require('../models/level');



exports.createExams = async (req, res, next) => {
    try {
      const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
      const newExamCategory = new  ExamCategory({
        examCategory: req.body.examCategory,
        examTime:req.body. examTime,
        price:req.body. price,
        image: path != "" ? "/" + path : "", // Corrected the reference to req.file.path
        isPaid:req.body.isPaid,
        level:req.body.level
      });
      const result = await newExamCategory.save();

         // get the level that you want to add the exam category to
    const levelDoc = await Level.findOne({ levelName: req.body.level });

    
    // add the exam category to the level
    levelDoc.examCategories.push(newExamCategory._id);
    await levelDoc.save();

      res.status(201).json({
        message: "Exam category added successfully",
        createdExamCategory: {
            examCategory: result.examCategory,
            image: result.image,
          _id: result._id
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
  };


   // Get all exam categories


   exports.getExamCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const examCategories = await ExamCategory.find().skip(startIndex).limit(limit);
        const totalCategories = await ExamCategory.countDocuments();

        const response = {
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
            categories: examCategories
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

  // exports.getExamCategories = async (req, res) => {
  //   try {
  //   const examCategories = await ExamCategory.find();

  //   res.status(200).json({ examCategories });
  //   } catch (error) {
  //   res.status(400).json({ error: error.message });
  //   }
  //   };


    exports.getExamCategoriesf = async (req, res, next) => {
      const { level, examCategory, isPaid } = req.query;
    
      try {
        const query = {
          level: level,
          examCategory: examCategory,
          isPaid: isPaid
        };
    
        // Build the query object based on the provided filters
        Object.keys(query).forEach(key => {
          if (!query[key]) {
            delete query[key];
          }
        });
    
        const examCategories = await ExamCategory.find(query);
    
        res.status(200).json({
          examCategories: examCategories
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'An error occurred while fetching exam categories'
        });
      }
    };
    

    exports.getExamCategories = async (req, res, next) => {
      const { level, examCategory, isPaid } = req.query;
    
      try {
        const query = {
          level: level,
          examCategory: examCategory,
          isPaid: isPaid
        };
    
        // Build the query object based on the provided filters
        Object.keys(query).forEach(key => {
          if (!query[key]) {
            delete query[key];
          }
        });
    
        const examCategories = await ExamCategory.find(query);
    
        const uniqueCategories = [...new Set(examCategories.map(item => item.examCategory))];
    
        const result = uniqueCategories.map(category => {
          return {
            examCategory: category,
            data: examCategories.filter(item => item.examCategory === category)
          };
        });
    
        res.status(200).json({
          examCategories: result
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'An error occurred while fetching exam categories'
        });
      }
    };










    ////////////////end
    
    // exports.getExamFilterCategories = async (req, res, next) => {
    //   const { level, isPaid, examCategories } = req.query;
    
    //   try {
    //     // convert the examCategories parameter to an array
    //     const examCategoriesArr = examCategories ? examCategories.split(',') : [];
    
    //     // get the level document for the specified level name
    //     const levelDoc = await Level.findOne({ levelName: level })
    //       .populate({
    //         path: 'examCategories',
    //         match: { isPaid: isPaid, name: { $in: examCategoriesArr } }
    //       })
    //       .exec();
    
    //     // extract the exam categories from the level document and send them in the response
    //     const filteredCategories = levelDoc.examCategories;
    //     res.status(200).json({
    //       examCategories: filteredCategories
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({
    //       message: 'An error occurred while fetching exam categories'
    //     });
    //   }
    // };
    

    // exports.getExamFilterCategories = async (req, res, next) => {
    //   const { level, isPaid, examCategories } = req.query;
    
    //   try {
    //     // get the level document for the specified level name
    //     const levelDoc = await Level.findOne({ levelName: level })
    //       .populate({
    //         path: 'examCategories',
    //         match: { isPaid: isPaid, name: { $in: examCategories } }
    //       })
    //       .exec();
    
    //     // extract the exam categories from the level document and send them in the response
    //     const filteredCategories = levelDoc.examCategories;
    //     res.status(200).json({
    //       examCategories: filteredCategories
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({
    //       message: 'An error occurred while fetching exam categories'
    //     });
    //   }
    // };
    

//     // get all exam categories for a specific level, filtered by paid or unpaid categories
// exports.getExamFilterCategories = async (req, res, next) => {
//   const { level, isPaid } = req.query;

//   try {
//     // get the level document for the specified level name
//     const levelDoc = await Level.findOne({ name: level })
//       .populate({
//         path: 'examCategories',
//         match: { isPaid: isPaid }
//       })
//       .exec();

//     // extract the exam categories from the level document and send them in the response
//     const examCategories = levelDoc.examCategories;
//     res.status(200).json({
//       examCategories
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'An error occurred while fetching exam categories'
//     });
//   }
// };

    // Get exam category by id
  exports.getExamCategoryById = async (req, res) => {
    try {
    const examCategory = await ExamCategory.findById(req.params.id);
    if (!examCategory) {
        return res.status(404).json({ message: 'Exam category not found' });
      }
      
      res.status(200).json({ examCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
        }
        };      



         //updates 
        exports.updateExamCategory = async (req, res, next) => {
            try {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            const updatedExamCategory = {
            examCategory: req.body.examCategory,
            examTime: req.body.examTime,
            image: path != "" ? "/" + path : "", // Corrected the reference to req.file.path
            };
            const result = await ExamCategory.findByIdAndUpdate(req.params.id, {$set: updatedExamCategory}, {new: true});
            res.status(200).json({
            message: "Exam category updated successfully",
            updatedExamCategory: {
            examCategory: result.examCategory,
            examTime: result.examTime,
            image: result.image,
            _id: result._id
            }
            });
            } catch (err) {
            console.log(err);
            res.status(500).json({
            error: err
            });
            }
            };


exports.startExam = async (req, res) => {
try {
 const examCategory = await ExamCategory.findOne({ examCategory: req.params.examCategory });
 if (!examCategory) return res.status(400).json({ msg: 'Exam category not found' });
 const questions = await Question.find({ examCategory: examCategory._id });
if (!questions) return res.status(400).json({ msg: 'Questions not found' });

const startTime = Date.now();
const endTime = startTime + examCategory.examTime * 60 * 1000;
let currentTime = startTime;

setInterval(() => {
  currentTime = Date.now();
  if (currentTime >= endTime) {
    clearInterval();
  }
  console.log(Math.floor((endTime - currentTime) / 1000));
}, 1000);

return res.json({ examTime: examCategory.examTime, questions });
} catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
    }
    };


    exports.submitAnswer = async (req, res) => {
        try {
          const question = await Question.findById(req.params.questionId);
          if (!question) return res.status(400).json({ msg: 'Question not found' });
      
          // Save student's answer to the database
          // ...
      
          return res.json({ msg: 'Answer submitted successfully' });
        } catch (error) {
          console.error(error.message);
          return res.status(500).json({ msg: 'Server error' });
        }
      };




  