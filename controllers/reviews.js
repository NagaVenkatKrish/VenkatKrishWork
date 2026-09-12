const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.renderReviews = async (req, res) =>
{
    const listing = await Listing.findById(req.params.id);
    if(!listing)
    {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "New Review Concocted");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview = async (req, res) =>
{
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Terminated");

    res.redirect(`/listings/${id}`);
}