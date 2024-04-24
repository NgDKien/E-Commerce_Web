const Blog = require("../models/blog")
const asyncHandler = require("express-async-handler")

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, hashtags } = req.body
  if (!req.file) throw new Error("Missing inputs")
  if (!title || !description || !hashtags) throw new Error("Missing inputs")
  const response = await Blog.create(req.body)
  return res.json({
    success: response ? true : false,
    mes: response ? "Blog Created." : "Cannot create new blog",
  })
})

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
  return res.json({
    success: response ? true : false,
    mes: response ? "Updated." : "Cannot update blog",
  })
})

const getBlogs = asyncHandler(async (req, res) => {
  const queries = { ...req.query }
  const excludeFields = ["limit", "sort", "page", "fields"]
  excludeFields.forEach((el) => delete queries[el])
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  )
  const formatedQueries = JSON.parse(queryString)
  let queryObject = {}
  if (queries?.q) {
    delete formatedQueries.q
    queryObject = {
      $or: [
        { title: { $regex: queries.q, $options: "i" } },
        // { description: { $regex: queries.q, $options: 'i' } },
      ],
    }
  }
  const qr = { ...formatedQueries, ...queryObject }
  let queryCommand = Blog.find(qr)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    queryCommand = queryCommand.sort(sortBy)
  }
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ")
    queryCommand = queryCommand.select(fields)
  }
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
  const skip = (page - 1) * limit
  queryCommand.skip(skip).limit(limit)
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message)
    const counts = await Blog.find(qr).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      blogs: response ? response : "Cannot get blogs",
    })
  })
})

const likeBlog = asyncHandler(async (req, res) => {
  //Id của user
  const { _id } = req.user
  //Id của bài đăng
  const { bid } = req.params
  if (!bid) throw new Error('Missing Inputs !')
  const blog = await Blog.findById(bid)
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id)
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id }, isDisliked: false },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id)
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  }
})

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { bid } = req.params
  if (!bid) throw new Error("Missing inputs")
  const blog = await Blog.findById(bid)
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id)
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  }
  const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id)
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    )
    return res.json({
      success: response ? true : false,
      rs: response,
    })
  }
})

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    //Lấy dữ liệu từ nhiều bảng
    //Tham sô 1 là lấy từ bảng nào, tham số 2 là lấy những trường nào
    .populate("likes", "firstname lastname")
    .populate("dislikes", "firstname lastname")
  return res.json({
    success: blog ? true : false,
    rs: blog,
  })
})

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params
  const blog = await Blog.findByIdAndDelete(bid)
  return res.json({
    success: blog ? true : false,
    deletedBlog: blog || "Something went wrong",
  })
})

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params
  if (!req.file) throw new Error("Missing inputs")
  const response = await Blog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  )
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Cannot upload image blog",
  })
})

module.exports = {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadImagesBlog
}