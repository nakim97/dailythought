module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in to make a post');
        return res.redirect('/login');
    }
    next();
}