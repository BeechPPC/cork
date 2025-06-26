const { neon } = require('@neon-database/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No valid authorization token" });
    }

    const { query } = req.body || {};
    
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    // OpenAI API integration for authentic wine recommendations
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `As an expert Australian wine sommelier, recommend 3 specific Australian wines based on this request: "${query}"

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
        const recommendations = result.recommendations || [];

        // Save to database if available
        if (process.env.DATABASE_URL && recommendations.length > 0) {
          try {
            const sql = neon(process.env.DATABASE_URL);
            const userId = 'user_' + Buffer.from(authHeader.slice(-20)).toString('hex').slice(0, 16);
            
            await sql`
              INSERT INTO recommendation_history (
                user_id, 
                query, 
                recommendations, 
                created_at
              ) VALUES (
                ${userId},
                ${query.trim()},
                ${JSON.stringify(recommendations)},
                NOW()
              )
            `;
          } catch (dbError) {
            console.warn('Database save failed:', dbError);
          }
        }

        return res.status(200).json({ 
          recommendations,
          query: query.trim(),
          timestamp: new Date().toISOString()
        });

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fall through to curated recommendations
      }
    }

    // Curated Australian wine recommendations as fallback
    const queryLower = query.toLowerCase();
    let recommendations = [];

    if (queryLower.includes('red') || queryLower.includes('shiraz') || queryLower.includes('cabernet')) {
      recommendations = [
        {
          name: "Penfolds Bin 389 Cabernet Shiraz",
          type: "Red Wine",
          region: "Barossa Valley, South Australia",
          vintage: "2020",
          description: "A powerhouse blend showcasing the best of Australian winemaking. Rich blackberry and plum flavours with integrated oak and firm tannins. Perfect with grilled meats and aged cheeses.",
          priceRange: "$60-80 AUD",
          abv: "14.5%",
          rating: "95/100",
          matchReason: "Iconic Australian red wine with exceptional depth and complexity"
        },
        {
          name: "Wynns Coonawarra Estate Black Label Cabernet Sauvignon",
          type: "Red Wine", 
          region: "Coonawarra, South Australia",
          vintage: "2019",
          description: "Premium Cabernet Sauvignon from the famous terra rossa soil of Coonawarra. Elegant cassis and mint flavours with fine-grained tannins and excellent aging potential.",
          priceRange: "$40-55 AUD",
          abv: "14.0%",
          rating: "92/100",
          matchReason: "Classic Australian Cabernet from one of the country's most prestigious regions"
        },
        {
          name: "Torbreck RunRig Shiraz",
          type: "Red Wine",
          region: "Barossa Valley, South Australia", 
          vintage: "2018",
          description: "From old vine Shiraz and Viognier, this wine offers incredible concentration and complexity. Dark fruit, spice, and floral notes create a truly memorable experience.",
          priceRange: "$120-150 AUD",
          abv: "15.0%",
          rating: "97/100",
          matchReason: "Premium expression of Australian Shiraz from century-old vines"
        }
      ];
    } else if (queryLower.includes('white') || queryLower.includes('chardonnay') || queryLower.includes('sauvignon blanc')) {
      recommendations = [
        {
          name: "Leeuwin Estate Art Series Chardonnay",
          type: "White Wine",
          region: "Margaret River, Western Australia",
          vintage: "2021",
          description: "Elegant and refined Chardonnay with perfect balance of fruit and oak. Stone fruit flavours with subtle vanilla and a long, mineral finish.",
          priceRange: "$45-60 AUD",
          abv: "13.0%",
          rating: "94/100",
          matchReason: "World-class Australian Chardonnay with international acclaim"
        },
        {
          name: "Shaw + Smith Sauvignon Blanc",
          type: "White Wine",
          region: "Adelaide Hills, South Australia",
          vintage: "2022",
          description: "Crisp and vibrant Sauvignon Blanc with tropical fruit flavours and zesty acidity. Perfect aperitif wine with bright citrus and herbaceous notes.",
          priceRange: "$20-25 AUD",
          abv: "12.5%",
          rating: "89/100",
          matchReason: "Fresh and expressive Australian Sauvignon Blanc ideal for warm weather"
        },
        {
          name: "Tyrrell's Vat 1 Semillon",
          type: "White Wine",
          region: "Hunter Valley, New South Wales",
          vintage: "2020",
          description: "Classic Hunter Valley Semillon with incredible aging potential. Young and crisp now, but will develop beautiful honey and toast flavours over time.",
          priceRange: "$25-35 AUD",
          abv: "11.0%",
          rating: "91/100",
          matchReason: "Iconic Australian Semillon style with exceptional longevity"
        }
      ];
    } else {
      recommendations = [
        {
          name: "Penfolds Bin 28 Kalimna Shiraz",
          type: "Red Wine",
          region: "Barossa Valley, South Australia",
          vintage: "2020",
          description: "Classic Australian Shiraz with rich berry flavours and well-integrated oak. A benchmark wine showcasing the best of Australian winemaking.",
          priceRange: "$35-45 AUD",
          abv: "14.5%",
          rating: "90/100",
          matchReason: "Quintessential Australian wine perfect for discovering local flavours"
        },
        {
          name: "Cullen Diana Madeline",
          type: "Red Wine",
          region: "Margaret River, Western Australia",
          vintage: "2019",
          description: "Elegant Cabernet Sauvignon blend from biodynamic vineyards. Complex and refined with excellent structure and aging potential.",
          priceRange: "$80-100 AUD",
          abv: "14.0%",
          rating: "96/100",
          matchReason: "Premium Australian wine showcasing sustainable winemaking practices"
        },
        {
          name: "Henschke Hill of Grace",
          type: "Red Wine",
          region: "Eden Valley, South Australia",
          vintage: "2017",
          description: "One of Australia's most iconic wines from 150-year-old Shiraz vines. Incredibly complex with layers of dark fruit, spice, and earth.",
          priceRange: "$700-800 AUD",
          abv: "14.5%",
          rating: "98/100",
          matchReason: "Australia's most prestigious Shiraz for special occasions"
        }
      ];
    }

    return res.status(200).json({ 
      recommendations,
      query: query.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ 
      message: "Failed to get recommendations", 
      error: error.message || "Unknown error"
    });
  }
};