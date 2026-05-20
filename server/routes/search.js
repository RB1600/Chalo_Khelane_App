// routes/search.js
const express = require("express");
const router = express.Router();
const Turf = require("../Modal/Turf");
const Tournament = require("../Modal/Tournament");
const User = require("../Modal/User");
const Trainer = require("../Modal/Trainer");

router.get("/", async (req, res) => {
  const query = req.query.query || "";
  const keywords = query.split(" ").filter(Boolean); // split into ['Rushikesh', 'Mishra']

  // Create array of OR conditions with regex for each word
  const createRegexOrQuery = (fields) => ({
    $or: keywords.flatMap(word =>
      fields.map(field => ({ [field]: { $regex: word, $options: "i" } }))
    )
  });

  try {
    const [turfs, tournaments, users, trainers] = await Promise.all([
      Turf.find(createRegexOrQuery(["name", "clubName", "address.fullAddress", "address.area", "address.city", "sports.name"])),
      Tournament.find(createRegexOrQuery(["title", "sportsType", "organizerName", "description"])),
      User.find(createRegexOrQuery(["name", "email", "mobile"])),
      Trainer.find(createRegexOrQuery(["firstName", "lastName", "sports", "address", "bio"]))
    ]);

    res.json({ turfs, tournaments, users, trainers });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

module.exports = router;
