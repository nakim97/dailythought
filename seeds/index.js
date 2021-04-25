const mongoose = require('mongoose');
const Blog = require('../models/blog');

mongoose.connect('mongodb://localhost:27017/mythoughts', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useFindAndModify: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const seedDB = async () => {
    await Blog.deleteMany({});
    const blog = new Blog({
        author: '607ce566a946373b7453b339',
        username: 'itme',
        title: 'boii',
        bubble: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
        description: 'k',
    })
    await blog.save();
}

seedDB().then(() => {
    mongoose.connection.close();
})