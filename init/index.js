const { loadEnvFile } = require("node:process");
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

try
{
    loadEnvFile();
}
catch (err)
{
    if (err.code !== "ENOENT")
    {
        throw err;
    }
}

const dbURL = process.env.ATLASDB_URL;

main()
    .then(() =>
    {
        console.log("DB Connection Achieved");
    })
    .catch((err) =>
    {
        console.log(err);
    });

async function main()
{
    await mongoose.connect(dbURL);
    await initDB();
    await mongoose.connection.close();
}

const initDB = async () =>
{
    await Listing.deleteMany({});

    const owner = await User.findOne({
        username: "delta-student"
    });

    if (!owner)
    {
        console.log("delta-student User Not Found");
        return;
    }

    const listingsWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: owner._id
    }));

    await Listing.insertMany(listingsWithOwner);

    console.log("Initialization Complete.");
    console.log(`All listings assigned to ${owner.username}.`);
};