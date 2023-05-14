

const Level = require('../models/level');

// create a new level


exports.createLevel = async (req, res, next) => {
  try {
    const level = new Level({
      levelName: req.body.levelName,
      examCategories: [] // Initialize examCategories as an empty array
    });
    const result = await level.save();

    res.status(201).json({
      message: "Level created successfully",
      createdLevel: {
        levelName: result.levelName,
        examCategories: result.examCategories,
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

// exports.createLevel = async (req, res, next) => {
//   const { levelName } = req.body;

//   const level = new Level({
//     levelName
//   });

//   try {
//     const savedLevel = await level.save();
//     res.status(201).json(savedLevel);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while saving the level' });
//   }
// };

// get all levels
exports.getAllLevels = async (req, res, next) => {
  try {
    const levels = await Level.find();
    res.status(200).json(levels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while getting the levels' });
  }
};

// delete a level
exports.deleteLevel = async (req, res, next) => {
  const { levelId } = req.params;

  try {
    const deletedLevel = await Level.findByIdAndDelete(levelId);
    if (!deletedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }
    res.status(200).json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the level' });
  }
};

// update a level
exports.updateLevel = async (req, res, next) => {
  const { levelId } = req.params;
  const { levelName } = req.body;

  try {
    const updatedLevel = await Level.findByIdAndUpdate(levelId, { levelName }, { new: true });
    if (!updatedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }
    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the level' });
  }
};















// const Level = require('../models/level');

// // create a new level
// // exports.createLevel = async (req, res, next) => {
// //   const { levelName, examCategories } = req.body;

// //   const examCategoryIds = examCategories.map(id => mongoose.Types.ObjectId(id));

// //   const level = new Level({
// //     levelName,
// //     examCategories: examCategoryIds
// //   });

// //   try {
// //     const savedLevel = await level.save();
// //     res.status(201).json(savedLevel);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'An error occurred while saving the level' });
// //   }
// // };
// exports.createLevel = async (req, res, next) => {
 
//  const level = new Level({

//     levelName:req.body.levelName,

//  });

  
//     try{

//         const saveLevel = await level.save();
//         //{user: user._id}
//         res.send(saveLevel);
    
//      } catch(err){

//         res.status(400).send(err);
    
//      }

    
// };



// exports.getLevels = async (req, res, next) => {
//   try {
//     const levels = await Level.find().populate('examCategories');
//     console.log(levels);
//     res.status(200).json({
//       levels
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'An error occurred while fetching levels'
//     });
//   }
// };



// // update a level
// exports.updateLevel = async (req, res, next) => {
//   const { name, examCategories, paidExams } = req.body;
//   const levelId = req.params.id;

//   try {
//     const level = await Level.findByIdAndUpdate(levelId, {
//       name,
//       examCategories
//     });

//     if (!level) {
//       return res.status(404).json({
//         message: 'Level not found'
//       });
//     }

//     res.status(200).json({
//       message: 'Level updated successfully'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'An error occurred while updating the level'
//     });
//   }
// };

// // delete a level
// exports.deleteLevel = async (req, res, next) => {
//   const levelId = req.params.id;

//   try {
//     const level = await Level.findByIdAndDelete(levelId);

//     if (!level) {
//       return res.status(404).json({
//         message: 'Level not found'
//       });
//     }

//     res.status(200).json({
//       message: 'Level deleted successfully'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'An error occurred while deleting the level'
//     });
//   }
// };
