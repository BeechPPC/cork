import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" });

export interface WineRecommendation {
  name: string;
  type: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  imageUrl?: string;
  matchReason: string;
}

export interface WineAnalysis {
  wineName: string;
  wineType: string;
  region: string;
  vintage?: string;
  optimalDrinkingStart: string;
  optimalDrinkingEnd: string;
  peakYearsStart: string;
  peakYearsEnd: string;
  analysis: string;
  estimatedValue: string;
  abv: string;
}

export async function getWineRecommendations(query: string): Promise<WineRecommendation[]> {
  try {
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
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    throw new Error("Failed to get wine recommendations: " + (error as Error).message);
  }
}

export async function analyzeWineImage(base64Image: string): Promise<WineAnalysis> {
  try {
    const prompt = `You are an expert wine analyst. Analyze this wine bottle image and provide detailed information about the wine.

Look at the label, bottle shape, and any visible details to identify:
1. The wine name and producer
2. Wine type/varietal
3. Region of origin (preferably Australian)
4. Vintage year if visible
5. Optimal drinking window (when to drink it)
6. Peak drinking years (best years to drink)
7. Detailed analysis of the wine's aging potential and characteristics
8. Estimated current market value
9. Alcohol content if visible

Respond with JSON in this exact format:
{
  "wineName": "Producer Wine Name",
  "wineType": "Wine type/varietal",
  "region": "Wine region",
  "vintage": "Year or null if not visible",
  "optimalDrinkingStart": "Start year",
  "optimalDrinkingEnd": "End year", 
  "peakYearsStart": "Peak start year",
  "peakYearsEnd": "Peak end year",
  "analysis": "Detailed analysis of the wine's characteristics and aging potential",
  "estimatedValue": "Price range in local currency",
  "abv": "Alcohol percentage"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error("Failed to analyze wine image: " + (error as Error).message);
  }
}
