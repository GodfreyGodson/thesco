const Category = require('../models/categoryexam');

exports.createCategory = async (req, res) => {
    try {
      const category = new Category({
        categoryName: req.body.categoryName
      });
  
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };