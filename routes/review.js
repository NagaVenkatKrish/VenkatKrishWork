const express = require("express");
const router = express.Router({ mergeParams: true });
const Wrapasync = require("../utils/Wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    next();
};
router.post("/", isLoggedIn, validateReview, Wrapasync(reviewController.renderReviews));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, Wrapasync(reviewController.destroyReview));
module.exports = router;
