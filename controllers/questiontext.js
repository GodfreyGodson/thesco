const Question = require('../models/questiontext');
const ExamCategory = require('../models/exam');

// exports.addQuestion = async (req, res) => {
//     const { examCategory, question, opt1, opt2, opt3, opt4, answer } = req.body;
  
//     try {
//       const newQuestion = new Question({
//         examCategory,
//         question,
//         opt1,
//         opt2,
//         opt3,
//         opt4,
//         answer
//       });
  
//       await newQuestion.save();
  
//       res.json({ message: 'Question added successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

  exports.addQuestion = async (req, res, next) => {
    try {
    
      const  newQuestion = new   Question({
        question: req.body.question,
        opt1:req.body.opt1,
        opt2:req.body.opt2,
        opt3:req.body.opt3,
        opt4:req.body.opt4,
        answer:req.body.answer,
        exam:req.body.exam
      });
      const result = await newQuestion.save();

         // get the exam category that you want to add the questions to
    const examCategoryDoc = await ExamCategory.findOne({examCategory: req.body.exam });

    
    // add the question to the exam category
    examCategoryDoc.questions.push(newQuestion._id);
    await examCategoryDoc.save();

      res.status(201).json({
        message: "Question added successfully",
        createdQuestion: {
          question: result.question,
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

  
  exports.editQuestion = async (req, res) => {
    const { examCategory, question, opt1, opt2, opt3, opt4, answer } = req.body;
    const { id } = req.params;
  
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        {
          examCategory,
          question,
          opt1,
          opt2,
          opt3,
          opt4,
          answer
        },
        { new: true }
      );
  
      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      res.json({ message: 'Question updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);
  
      if (!deletedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  exports.getQuestions = async (req, res) => {
    try {
      const category = await ExamCategory.findOne({ examCategory: req.params.examCategory }).populate('questions');
      if (!category) return res.status(400).json({ msg: 'Exam category not found' });
  
      const questions = category.questions;
      if (!questions) return res.status(400).json({ msg: 'Questions not found' });
  
      return res.json(questions);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  };
  
  
  



exports.postQuestion = async (req, res) => {
    try {
    const examCategory = await ExamCategory.findOne({ examCategory: req.params.examCategory });
    if (!examCategory) return res.status(400).json({ msg: 'Exam category not found' });
    const newQuestion = new Question({
        examCategory: examCategory._id,
        question: req.body.question,
        opt1: req.body.opt1,
        opt2: req.body.opt2,
        opt3: req.body.opt3,
        opt4: req.body.opt4,
        answer: req.body.answer,
      
      });
      
      const question = await newQuestion.save();
      return res.json(question);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Server error' });
        }
        };      



        exports.editQuestion = async (req, res) => {
            try {
            const examCategory = await ExamCategory.findOne({ examCategory: req.params.examCategory });
            if (!examCategory) return res.status(400).json({ msg: 'Exam category not found' });
            const question = await Question.findById(req.params.questionId);
           if (!question) return res.status(400).json({ msg: 'Question not found' });

           if (question.examCategory.toString() !== examCategory._id.toString())
           return res.status(400).json({ msg: 'Unauthorized' });

          question.question = req.body.question;
          question.opt1 = req.body.opt1;
          question.opt2 = req.body.opt2;
          question.opt3 = req.body.opt3;
          question.opt4 = req.body.opt4;
          question.answer = req.body.answer;
        

await question.save();
return res.json(question);
} catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
    }
    };


    exports.deleteQuestion = async (req, res) => {
        try {
        const examCategory = await ExamCategory.findOne({ examCategory: req.params.examCategory });
        if (!examCategory) return res.status(400).json({ msg: 'Exam category not found' });
        const question = await Question.findById(req.params.questionId);
if (!question) return res.status(400).json({ msg: 'Question not found' });

if (question.examCategory.toString() !== examCategory._id.toString())
  return res.status(400).json({ msg: 'Unauthorized' });

await question.remove();
return res.json({ msg: 'Question removed' });
} catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
    }
    };


  