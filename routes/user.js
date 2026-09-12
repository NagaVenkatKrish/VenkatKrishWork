const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const Wrapasync = require("../utils/Wrapasync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
router.route("/signup")
  .get(userController.renderSignup)
  .post(Wrapasync(userController.signUp));

router.get("/login", userController.renderLogin);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
}), userController.renderSession);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
});

module.exports = router;
