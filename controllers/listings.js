const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
// INDEX
module.exports.index = async (req, res) =>
{
    const { location } = req.query;

    let allListings;

    if (location && location.trim() !== "")
    {
        const search = location.trim();

        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    }
    else
    {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", {
        allListings,
        searchLocation: location || ""
    });
};
// NEW FORM
module.exports.renderNewForm = (req, res) =>
{
    res.render("listings/new.ejs");
};
const geocodeLocation = async (location, country) => {
    const cleanLocation = String(location || "").trim();
    const cleanCountry = String(country || "").trim();
    const firstPart = cleanLocation.split(",")[0].trim();
    const queries = [
        `${cleanLocation}, ${cleanCountry}`,
        cleanLocation,
        `${firstPart}, ${cleanCountry}`
    ].filter(Boolean);
    const uniqueQueries = [...new Set(queries)];
    for (const query of uniqueQueries) {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", query);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("limit", "1");
        const response = await fetch(url, {
            headers: {
                "User-Agent": "WanderLust/1.0"
            }
        });
        if (!response.ok) {
            throw new ExpressError(502, "Geocoding Service Unavailable");
        }
        const data = await response.json();
        if (data.length > 0) {
            return {
                type: "Point",
                coordinates: [
                    Number(data[0].lon),
                    Number(data[0].lat)
                ]
            };
        }
    }
    throw new ExpressError(
        400,
        `Location "${cleanLocation}, ${cleanCountry}" could not be found. Please enter a real place name and country.`
    );
};
// SHOW
module.exports.showListing = async (req, res) =>
{
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if(!listing)
    {
        req.flash("error", "Requested Listing is Inexistent");

        return res.redirect("/listings");
    }
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length !== 2) {
        listing.geometry = await geocodeLocation(
            listing.location,
            listing.country
        );

        await listing.save();
    }
    res.render("listings/show.ejs", { listing });
};
// CREATE
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
        newListing.image = {
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        };
    }
    newListing.geometry = await geocodeLocation(
        newListing.location,
        newListing.country
    );
    await newListing.save();
    req.flash("success", "New Listing Concocted");
    res.redirect("/listings");
};
// EDIT FORM
module.exports.renderEditForm = async (req, res) =>
{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Requested Listing is Inexistent");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};
// UPDATE
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    const oldLocation = listing.location;
    const oldCountry = listing.country;
    listing.set(req.body.listing);
    if (req.file) {
        listing.image = {
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        };
    }
    const locationChanged =
        oldLocation !== listing.location ||
        oldCountry !== listing.country;
    if (locationChanged || !listing.geometry) {
        listing.geometry = await geocodeLocation(
            listing.location,
            listing.country
        );
    }
    await listing.save();
    req.flash("success", "Preferred Listing Modified");
    res.redirect(`/listings/${id}`);
};
// DELETE
module.exports.deleteListing = async (req, res) =>
{
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing)
    {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    req.flash("success", "Preferred Listing Terminated");
    res.redirect("/listings");
};