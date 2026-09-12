const User = require("../models/user.js");
module.exports.renderSignup = (req, res) => 
    {
    res.render("users/signup.ejs");
}
module.exports.renderLogin = (req, res) => 
{
    res.render("users/login.ejs");
}
module.exports.signUp = async (req, res, next) => 
{
    try 
    {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) 
            {
                return next(err);
            }

            req.flash("success", "WanderLust Welcomes You In");
            res.redirect("/listings");
        });
    } 
    catch (err) 
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}
module.exports.renderSession = (req, res) => {
    req.flash("success", "Welcome Back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}
module.exports.renderLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
}
