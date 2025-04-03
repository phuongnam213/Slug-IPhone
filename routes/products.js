var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');
const slugify = require('slugify');

// Tạo query để tìm kiếm sản phẩm theo các điều kiện
function buildQuery(obj) {
  let result = {};
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  result.price = {};
  if (obj.price) {
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    } else {
      result.price.$lte = 10000;
    }
  } else {
    result.price.$gte = 0;
    result.price.$lte = 10000;
  }
  return result;
}

// Lấy tất cả sản phẩm
router.get('/', async function (req, res, next) {
  let products = await productModel.find(buildQuery(req.query)).populate('category');
  res.status(200).send({
    success: true,
    data: products,
  });
});

// Lấy sản phẩm theo ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: 'Không có ID phù hợp',
    });
  }
});

// Tạo mới sản phẩm
router.post('/', async function (req, res, next) {
  try {
    let cate = await CategoryModel.findOne({ name: req.body.category });
    if (cate) {
      let newProduct = new productModel({
        name: req.body.name,
        slug: slugify(req.body.name, { lower: true }), // Tạo slug từ tên sản phẩm
        price: req.body.price,
        quantity: req.body.quantity,
        category: cate._id,
      });
      await newProduct.save();
      res.status(200).send({
        success: true,
        data: newProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// Cập nhật sản phẩm
router.put('/:id', async function (req, res, next) {
  try {
    let updateObj = {};
    let body = req.body;
    if (body.name) {
      updateObj.name = body.name;
      updateObj.slug = slugify(body.name, { lower: true }); // Cập nhật slug khi tên thay đổi
    }
    if (body.price) {
      updateObj.price = body.price;
    }
    if (body.quantity) {
      updateObj.quantity = body.quantity;
    }
    if (body.category) {
      let cate = await CategoryModel.findOne({ name: req.body.category });
      if (!cate) {
        res.status(404).send({
          success: false,
          message: 'Danh mục không tồn tại',
        });
      }
    }
    let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
    res.status(200).send({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// Xóa sản phẩm (đánh dấu là đã xóa)
router.delete('/:id', async function (req, res, next) {
  try {
    let product = await productModel.findById(req.params.id);
    if (product) {
      let deletedProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      res.status(200).send({
        success: true,
        data: deletedProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'ID không tồn tại',
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// Lấy sản phẩm theo slug và category slug
router.get('/slug/:category/:product', async function (req, res, next) {
  try {
    let categorySlug = req.params.category;
    let productSlug = req.params.product;

    let category = await CategoryModel.findOne({ slug: categorySlug });

    if (category) {
      let product = await productModel.findOne({
        slug: productSlug,
        category: category._id,
      });

      if (product) {
        res.status(200).send({
          success: true,
          data: product,
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'Sản phẩm không tồn tại',
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

// Lấy tất cả sản phẩm trong category
router.get('/slug/:category', async function (req, res, next) {
  try {
    let categorySlug = req.params.category;
    let category = await CategoryModel.findOne({ slug: categorySlug });

    if (category) {
      let products = await productModel.find({ category: category._id });
      res.status(200).send({
        success: true,
        data: products,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
