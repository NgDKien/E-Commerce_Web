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

  queryCommand.then((response) => {
    const counts = Product.find(formatedQueries).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    })
  }).catch((err) => {
    throw new Error(err.message)
  });
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

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}