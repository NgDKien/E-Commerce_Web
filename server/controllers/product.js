const Product = require("../models/product")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
      success: newProduct ? true : false,
      mes: newProduct ? "Created" : "Failed.",
    }) 
})

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const product = await Product.findById(pid)
    // .populate({
    //   path: "ratings",
    //   populate: {
    //     path: "postedBy",
    //     select: "firstname lastname avatar",
    //   },
    // })
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  })
})

// const getProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find()
//     // .populate({
//     //   path: "ratings",
//     //   populate: {
//     //     path: "postedBy",
//     //     select: "firstname lastname avatar",
//     //   },
//     // })
//   return res.status(200).json({
//     success: products ? true : false,
//     productData: products ? products : "Cannot get products",
//   })
// })

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query }
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"]
  excludeFields.forEach((el) => delete queries[el])

  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  )
  const formatedQueries = JSON.parse(queryString)
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" }
  let queryCommand = Product.find(formatedQueries)
  // if (queries?.category)
  //   formatedQueries.category = { $regex: queries.category, $options: "i" }
  // if (queries?.brand)
  //   formatedQueries.brand = { $regex: queries.brand, $options: "i" }
  // if (queries?.color) {
  //   delete formatedQueries.color
  //   const colorArr = queries.color?.split(",")
  //   const colorQuery = colorArr.map((el) => ({
  //     color: { $regex: el, $options: "i" },
  //   }))
  //   colorQueryObject = { $or: colorQuery }
  // }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    queryCommand = queryCommand.sort(sortBy)
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ")
    queryCommand = queryCommand.select(fields)
  }

  // Pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
  const skip = (page - 1) * limit
  queryCommand.skip(skip).limit(limit)
  // Execute query
  // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message)
    const counts = await Product.find(formatedQueries).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    })
  })
  // queryCommand.then((response) => {
  //   const counts = Product.find(formatedQueries).countDocuments()
  //   return res.status(200).json({
  //     success: response ? true : false,
  //     counts,
  //     products: response ? response : "Cannot get products",
  //   })
  // }).catch((err) => {
  //   // throw new Error(err.message)
  //   console.log(err)
  // });
})

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  })
  return res.status(200).json({
    success: updatedProduct ? true : false,
    mes: updatedProduct ? "Updated." : "Cannot update product",
  })
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const deletedProduct = await Product.findByIdAndDelete(pid)
  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct ? "Deleted." : "Cannot delete product",
  })
})

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { star, comment, pid, updatedAt } = req.body
  if (!star || !pid) throw new Error("Missing inputs")
  const ratingProduct = await Product.findById(pid)
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  )
  if (alreadyRating) {
    // update star & comment
    await Product.updateOne(
      {
        //update trường ratings đã có chứa alreadyRating
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          //Dấu $ tượng trưng cho object mà elemMatch tìm được
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    )
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    )
  }

  // Sum ratings
  const updatedProduct = await Product.findById(pid)
  const ratingCount = updatedProduct.ratings.length
  const sumRatings = updatedProduct.ratings.reduce(
    // Dấu + trước el.star để convert từ string sang number
    (sum, el) => sum + +el.star,
    0
  )
  updatedProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10

  await updatedProduct.save()

  return res.status(200).json({
    success: true,
    updatedProduct,
  })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  if (!req.files) throw new Error("Missing inputs")
  const response = await Product.findByIdAndUpdate(
    pid,
    //Push '$each: req.files.map((el) => el.path' vào mảng images (Stackoverflow)
    //'$each: req.files.map((el) => el.path': map qua từng phần tử và lấy ra path (đường link)
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  )
  return res.status(200).json({
    success: response ? true : false,
    updatedProduct: response ? response : "Cannot upload images product",
  })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct, 
    ratings,
    uploadImagesProduct
}