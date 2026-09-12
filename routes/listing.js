const express = require("express");

const router = express.Router();

const Wrapasync = require("../utils/Wrapasync.js");

const { listingSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");

const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");

const path = require("path");


// Multer Storage
const storage = multer.diskStorage({
    destination: "public/uploads/",

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


// Validate Listing
const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if(error) {
        throw new ExpressError(400, error.message);
    }

    next();
};


// INDEX + CREATE
router.route("/")
    .get(
        Wrapasync(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        Wrapasync(listingController.createListing)
    );


// NEW LISTING
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(
        isLoggedIn,
        Wrapasync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        validateListing,
        Wrapasync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        Wrapasync(listingController.deleteListing)
    );


// EDIT LISTING
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    Wrapasync(listingController.renderEditForm)
);


module.exports = router;