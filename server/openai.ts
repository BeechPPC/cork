import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'default_key') {
      throw new Error("OpenAI API key not configured");
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
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get wine recommendations: " + (error as Error).message);
  }
}

export interface PairingRecommendation {
  wineName: string;
  wineType: string;
  producer?: string;
  vintage?: string;
  region: string;
  priceRange: string;
  matchReason: string;
  confidence: number;
}

export interface MealPairingAnalysis {
  recognizedFood: string[];
  cuisineType: string;
  mainIngredients: string[];
  cookingMethod: string;
  recommendations: PairingRecommendation[];
}

export async function analyzeWineMenu(base64Image: string, question: string): Promise<string> {
  const prompt = `You are an expert sommelier analyzing a wine menu photo. The user has uploaded a wine menu and asked: "${question}"

Please analyze the wine menu in the image and provide a detailed, helpful response to their question. Focus on:
- Identifying specific wines from the menu that match their request
- Explaining why these wines are good choices
- Including price information if visible
- Providing professional sommelier advice
- Considering food pairing principles if relevant

Be conversational and helpful, as if you're a knowledgeable sommelier assisting a customer in person.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high"
            }
          }
        ]
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "Unable to analyze the wine menu. Please try again with a clearer image.";
}

export async function analyzeMealPairing(base64Image: string, analysisType: 'meal' | 'menu'): Promise<MealPairingAnalysis> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const isMenuAnalysis = analysisType === 'menu';
  
  const systemPrompt = isMenuAnalysis
    ? `You are an expert sommelier analyzing a wine menu photo. Extract wine information from the menu and provide pairing recommendations for a hypothetical meal. Focus on Australian wines when possible.
    
    Respond with JSON in this exact format:
    {
      "recognizedFood": ["hypothetical dish 1", "hypothetical dish 2"],
      "cuisineType": "cuisine type that would pair well with menu wines",
      "mainIngredients": ["ingredient1", "ingredient2"],
      "cookingMethod": "suggested cooking method",
      "recommendations": [
        {
          "wineName": "exact wine name from menu",
          "wineType": "wine type",
          "producer": "producer if visible",
          "vintage": "vintage if visible",
          "region": "region if known or inferred",
          "priceRange": "price from menu or estimated range",
          "matchReason": "why this wine pairs well with the suggested cuisine",
          "confidence": 90
        }
      ]
    }`
    : `You are an expert sommelier analyzing a meal photo. Identify the food items, cuisine type, ingredients, and cooking methods. Then recommend 3-5 wines (available to purchase in Australian) that would pair perfectly with this meal.
    
    Respond with JSON in this exact format:
    {
      "recognizedFood": ["dish1", "dish2"],
      "cuisineType": "cuisine type",
      "mainIngredients": ["ingredient1", "ingredient2"],
      "cookingMethod": "cooking method",
      "recommendations": [
        {
          "wineName": "specific wine name",
          "wineType": "wine type",
          "producer": "producer name",
          "vintage": "vintage year",
          "region": "wine region",
          "priceRange": "$XX-XX",
          "matchReason": "detailed pairing explanation",
          "confidence": 85
        }
      ]
    }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: isMenuAnalysis 
                ? "Analyze this wine menu photo and suggest wines that would pair well with a meal, extracting specific wines from the menu."
                : "Analyze this meal photo and recommend wines that would pair perfectly with this food."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const analysis = JSON.parse(content) as MealPairingAnalysis;
    
    // Validate and ensure proper structure
    return {
      recognizedFood: analysis.recognizedFood || [],
      cuisineType: analysis.cuisineType || "Unknown",
      mainIngredients: analysis.mainIngredients || [],
      cookingMethod: analysis.cookingMethod || "Unknown",
      recommendations: (analysis.recommendations || []).map(rec => ({
        wineName: rec.wineName || "Unknown Wine",
        wineType: rec.wineType || "Unknown Type",
        producer: rec.producer || undefined,
        vintage: rec.vintage || undefined,
        region: rec.region || "Unknown Region",
        priceRange: rec.priceRange || "$25-35",
        matchReason: rec.matchReason || "Classic pairing",
        confidence: Math.min(100, Math.max(1, rec.confidence || 75))
      }))
    };
  } catch (error) {
    console.error("OpenAI meal pairing analysis error:", error);
    throw new Error("Failed to analyse meal for wine pairings");
  }
}

export interface WineryInfo {
  wineryName: string;
  address: string;
  region: string;
  websiteUrl: string;
  description: string;
  establishedYear: string;
  contactPhone: string;
  contactEmail: string;
  specialtyWines: string[];
  cellarDoorHours: string;
  tastingFees: string;
  bookingRequired: boolean;
}

export async function searchAustralianWineries(searchQuery: string): Promise<WineryInfo[]> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert on Australian wineries with comprehensive knowledge of wineries across all Australian wine regions. When given a search query, provide information about relevant Australian wineries.

        Return your response in JSON format as an array of wineries with these exact fields:
        {
          "wineries": [
            {
              "wineryName": "Full winery name",
              "address": "Complete address including suburb, state, postcode",
              "region": "Wine region (e.g., Barossa Valley, Hunter Valley)",
              "websiteUrl": "Website URL if known, otherwise 'Not available'",
              "description": "Brief description of the winery, history, and what makes it special",
              "establishedYear": "Year established or 'Unknown'",
              "contactPhone": "Phone number if known, otherwise 'Not available'",
              "contactEmail": "Email if known, otherwise 'Not available'",
              "specialtyWines": ["Array of their signature or specialty wines"],
              "cellarDoorHours": "Cellar door operating hours or 'Contact for hours'",
              "tastingFees": "Tasting fee information or 'Contact for pricing'",
              "bookingRequired": true/false for whether booking is required
            }
          ]
        }

        Focus on providing accurate, well-known Australian wineries. If searching by region, include multiple wineries from that region. If searching by name, try to find the specific winery plus similar ones.`
      },
      {
        role: "user",
        content: `Search for Australian wineries: ${searchQuery}`
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0].message.content || '{"wineries": []}');
  return result.wineries || [];
}

export async function analyseWineImage(base64Image: string): Promise<WineAnalysis> {
  try {
    const prompt = `You are an expert wine analyst. Analyse this wine bottle image and provide detailed information about the wine.

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
