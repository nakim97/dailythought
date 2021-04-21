const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const {
    blogSchema
} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');
const ExpressError = require('../utilities/ExpressError');
const Blog = require('../models/blog');

const validateBlog = (req, res, next) => {
    const {
        error
    } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', {
        blogs
    })
}))

router.get('/new', isLoggedIn,(req, res) => {
    res.render('blogs/new');
})

router.post('/', isLoggedIn, validateBlog, catchAsync(async (req, res, next) => {
    const blog = new Blog(req.body.blog);
    blog.author = req.user._id;
    await blog.save();
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/blogs/${blog._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('comments').populate('author');
    console.log(blog);
    if (!blog) {
        req.flash('error', 'Uh Oh...Cannot find that post');
        return res.redirect('/blogs');
    }
    res.render('blogs/show', {
        blog
    });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        req.flash('error', 'Uh Oh...Cannot find that post');
        return res.redirect('/blogs');
    }
    res.render('blogs/edit', {
        blog
    });
}))

router.put('/:id', isLoggedIn, validateBlog, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {
        ...req.body.blog
    });
    req.flash('success', 'Successfully updated post');
    res.redirect(`/blogs/${blog._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post');
    res.redirect('/blogs');
}))

module.exports = router;