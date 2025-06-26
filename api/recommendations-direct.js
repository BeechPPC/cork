import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req, res) {
  // Force cache bypass with unique headers
  const timestamp = Date.now();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Timestamp', timestamp);
  res.setHeader('X-Cache-Bust', Math.random().toString(36));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query is required" });
    }

    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'default_key') {
      return res.status(500).json({ message: "OpenAI API key not configured" });
    }

    const prompt = `You are an expert wine sommelier specializing in Australian wines. A customer asks: "${query}"

Recommend exactly 3 Australian wines that match their request. Focus on real wines from established Australian producers.

Return a JSON response with this structure:
{
  "recommendations": [
    {
      "name": "Producer Wine Name",
      "type": "Wine varietal",
      "region": "Australian region", 
      "vintage": "Year",
      "description": "Detailed tasting notes and food pairing suggestions",
      "priceRange": "AUD price range",
      "abv": "Alcohol percentage",
      "rating": "Professional score",
      "matchReason": "Why this wine suits the request"
    }
  ]
}`;

    // OpenAI API call with error handling
    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert Australian wine sommelier. Recommend only real Australian wines from established producers."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 20000)
      )
    ]);

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const recommendations = result.recommendations || [];

    if (recommendations.length === 0) {
      throw new Error("No recommendations generated");
    }

    res.status(200).json({ 
      recommendations,
      timestamp: new Date().toISOString(),
      source: 'openai_direct'
    });
    
  } catch (error) {
    console.error("Direct recommendations error:", error);
    res.status(500).json({ 
      message: "Failed to generate wine recommendations",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}