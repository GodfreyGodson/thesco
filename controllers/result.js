const Result = require('../models/result');
const ExamCategory = require('../models/exam');


exports.addResult = async (req, res, next) => {
    try {
    
      const  newResult = new Result({
        question: req.body.question,
        userAnswer:req.body.userAnswer,
        answer:req.body.answer,
        score: req.body.userAnswer === req.body.answer ? 1 : 0,
        exam:req.body.exam
      });
      const finalresult = await newResult.save();

         // get the exam category that you want to add the questions to
    const examCategoryDoc = await ExamCategory.findOne({examCategory: req.body.exam });

    
    // add the question to the exam category
    examCategoryDoc.results.push(newResult._id);
    await examCategoryDoc.save();

      res.status(201).json({
        message: "Question added successfully",
        createdResult: {
          question: finalresult.result,
          _id: finalresult._id,
          score: finalresult.score
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
  };





  exports.getResultsForExam = async (req, res) => {
    const { exam } = req.params;
    try {
      const results = await Result.find({ exam });
      const totalQuestions = results.length;
      const totalMarks = results.reduce((acc, result) => acc + result.score, 0);
      res.json({ totalQuestions, totalMarks, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
