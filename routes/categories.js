var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
const slugify = require('slugify');

router.get('/', async function (req, res, next) {
  try {
    let categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    if (category) {
      res.status(200).send({
        success: true,
        data: category,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }), // Tạo slug từ tên danh mục
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Lỗi khi tạo danh mục: ' + error.message,
    });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let updateObj = {};
    let body = req.body;
    if (body.name) {
      updateObj.name = body.name;
      updateObj.slug = slugify(body.name, { lower: true }); // Cập nhật slug khi tên thay đổi
    }

    let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
    if (updatedCategory) {
      res.status(200).send({
        success: true,
        data: updatedCategory,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Lỗi khi cập nhật danh mục: ' + error.message,
    });
  }
});

module.exports = router;
