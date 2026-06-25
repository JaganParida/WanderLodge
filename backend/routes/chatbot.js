const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Listing = require("../models/listing.js");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch a couple of top listings to give context to the AI
    const listings = await Listing.find().limit(5).select('title location price category');
    
    const context = `You are the Vistiqo AI Concierge. Be helpful, enthusiastic, and concise. 
    Here are some of our top properties available right now:
    ${listings.map(l => `- ${l.title} in ${l.location} for ₹${l.price}/night (${l.category})`).join('\n')}
    
    User message: ${message}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: context,
    });
    
    res.json({ reply: response.text });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to communicate with AI" });
  }
});

module.exports = router;
