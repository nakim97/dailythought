const {blogSchema, commentSchema} = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Blog = require('./models/blog');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to make a post');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateBlog = (req, res, next) => {
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

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog.author.equals(req.user._id)) {
        req.flash('error', 'No No! You do not have permission to do that');
        return res.redirect(`/blogs/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blogs/${id}`);
    }
    next();
}


module.exports.validateComment = (req, res, next) => {
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
