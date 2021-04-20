const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Blog = require('../models/blog');
const Comment = require('../models/comment');

const {
    commentSchema
} = require('../schemas.js');


const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

const validateComment = (req, res, next) => {
    const {
        error
    } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.post('/', validateComment, catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/blogs/${blog._id}`);
}))

router.delete('/:commentId', catchAsync(async (req, res) => {
    const {
        id,
        commentId
    } = req.params;
    await Blog.findByIdAndUpdate(id, {
        $pull: {
            comments: commentId
        }
    });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/blogs/${id}`);
}))

module.exports = router;