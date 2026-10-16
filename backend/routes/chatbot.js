const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/listing.js");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Fetch top listings to provide context
    const listings = await Listing.find().limit(5).select("title location price category");

    // Check if GEMINI_API_KEY is configured
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith("AIzaSy")) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const context = `You are the WanderLodge AI Concierge. Be helpful, enthusiastic, and concise. 
Here are some of our top luxury properties available right now:
${listings.map((l) => `- ${l.title} in ${l.location} for ₹${l.price}/night (${l.category})`).join("\n")}

User message: ${message}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: context,
        });

        if (response && response.text) {
          return res.json({ reply: response.text });
        }
      } catch (aiErr) {
        console.warn("Gemini API call failed, falling back to smart concierge engine:", aiErr.message);
      }
    }

    // SaaS Resilient Fallback Engine: If Gemini key is missing, expired, or invalid, never fail with 500!
    const queryTerm = message.toLowerCase();
    let filter = {};
    if (queryTerm.includes("cabin")) filter.category = "Cabins";
    else if (queryTerm.includes("beach")) filter.category = "Beachfront";
    else if (queryTerm.includes("pool")) filter.category = "Pools";
    else if (queryTerm.includes("castle")) filter.category = "Castles";
    else if (queryTerm.includes("lake")) filter.category = "Lakefront";
    else if (queryTerm.includes("farm")) filter.category = "Farms";

    const recommendations = await Listing.find(filter).limit(3).select("title location price category");
    const recText =
      recommendations.length > 0
        ? recommendations.map((r) => `"${r.title}" in ${r.location} (₹${r.price.toLocaleString("en-IN")}/night)`).join(", ")
        : "our exclusive Beachfront villas and secluded Alpine cabins";

    const reply = `Welcome to WanderLodge! I would love to recommend ${recText}. Let me know if you would like more details or assistance booking your dream getaway!`;

    res.json({ reply, fallback: true });
  } catch (err) {
    console.error("Chatbot router error:", err);
    res.status(500).json({ error: "Concierge is temporarily resting. Please try again shortly." });
  }
});

module.exports = router;
