import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key" 
});

export default async function handler(req, res) {
  try {
    console.log("Standalone recommendations handler called");
    
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Basic validation
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query is required" });
    }

    console.log("Processing query:", query);

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'default_key') {
      console.error("OpenAI API key not configured");
      return res.status(500).json({ message: "AI service not configured" });
    }

    const prompt = `You are an expert wine sommelier with deep knowledge of Australian wines. A user has described what they're looking for: "${query}"

Recommend 3 specific Australian wines that would be perfect for their request. Focus on real, available Australian wines from reputable producers.

For each wine, provide detailed information in JSON format with these fields:
- name: The exact wine name and producer
- type: Wine type (e.g., Shiraz, Chardonnay, Pinot Noir, etc.)
- region: Australian wine region
- vintage: Recent vintage year if applicable
- description: Rich description with tasting notes and food pairing suggestions
- priceRange: Price range in AUD (e.g., "$30-40", "$80-100")
- abv: Alcohol by volume percentage
- rating: Professional rating out of 100 or star rating
- matchReason: Why this wine matches their request

Respond with JSON in this exact format: { "recommendations": [wine1, wine2, wine3] }`;

    console.log("Making OpenAI API call...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert Australian wine sommelier. Always recommend real, specific Australian wines.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      timeout: 25000,
    });

    console.log("OpenAI API call successful");
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const recommendations = result.recommendations || [];
    
    console.log("Returning recommendations:", recommendations.length);
    
    res.status(200).json({ recommendations });
    
  } catch (error) {
    console.error("Recommendations error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500)
    });
    
    res.status(500).json({ 
      message: "Failed to get wine recommendations",
      error: error.message 
    });
  }
}