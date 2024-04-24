const Order = require("../models/order")
const User = require("../models/user")
const Coupon = require("../models/coupon")
const asyncHandler = require("express-async-handler")

// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user
//   const { coupon } = req.body
//   const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
//   const products = userCart?.cart?.map(el => ({
//     product: el.product._id,
//     count: el.quantity,
//     color: el.color
//   }))
//   let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
//   const createData = {products, total, orderBy: _id}
//   if (coupon) {
//     const selectedCoupon = await Coupon.findById(coupon)
//     total = Math.round(total * (1- +selectedCoupon.discount / 100) /1000) * 1000
//     createData.total = total
//     createData.coupon = coupon
//   }
//   const rs = await Order.create(createData)
//   return res.json({
//     success: rs ? true : false,
//     rs: rs ? rs : "Something went wrong",
//   })
// })

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { products, total, address, status } = req.body
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] })
  }
  const data = { products, total, orderBy: _id }
  if (status) data.status = status
  const rs = await Order.create(data)
  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Something went wrong",
  })
})

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params
  const { status } = req.body
  if (!status) throw new Error("Missing status")
  const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
  return res.json({
    success: response ? true : false,
    mes: response ? "Updated." : "Something went wrong",
  })
})

const getUserOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query }
  const { _id } = req.user
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
  const qr = { ...formatedQueries, orderBy: _id }
  let queryCommand = Order.find(qr).populate("orderBy", "firstname lastname")

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
    const counts = await Order.find(qr).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get products",
    })
  })
})

const getOrders = asyncHandler(async (req, res) => {
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
  const qr = { ...formatedQueries }
  let queryCommand = Order.find(qr).populate("orderBy", "firstname lastname")

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
    const counts = await Order.find(qr).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get products",
    })
  })
})

const deleteOrderByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params
  const rs = await Order.findByIdAndDelete(id)
  return res.json({
    success: rs ? true : false,
    mes: rs ? "Deleted" : "Something went wrong",
  })
})

module.exports = {
  createOrder,
  updateStatus,
  getUserOrders,
  getOrders,
  deleteOrderByAdmin
}