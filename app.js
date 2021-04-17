const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');


const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');

const blogs = require('./routes/blogs');

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

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


app.use('/blogs', blogs)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {
        err
    })
})

app.listen(3000, () => {
    console.log('Serving on port 3000!!!')
})