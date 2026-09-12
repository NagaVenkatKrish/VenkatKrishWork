module.exports.isLoggedIn = (req, res, next) =>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Logging in Required");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) =>
{
    const Listing = require("./models/listing.js");
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if(!listing)
    {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }

    if(!listing.owner || String(listing.owner) !== String(req.user._id))
    {
        req.flash("error", "You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) =>
{
    const Review = require("./models/review.js");
    const { reviewId, id } = req.params;

    const review = await Review.findById(reviewId);

    if(!review)
    {
        req.flash("error", "Review Not Found");
        return res.redirect(`/listings/${id}`);
    }

    if(!review.author || String(review.author) !== String(req.user._id))
    {
        req.flash("error", "You are not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
