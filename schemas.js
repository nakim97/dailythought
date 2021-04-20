const Joi = require('joi');

module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        mood: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
})