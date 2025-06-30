// Fixed recommendations endpoint - bypasses server complexity
import 'dotenv/config';

export default async function handler(req, res) {
  console.log('Fixed recommendations endpoint called');

  // CORS headers
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
    const { query } = req.body;
    console.log('Processing wine recommendation query:', query);

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Try OpenAI first if available
    let recommendations = [];
    let source = 'fallback';

    if (
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== 'default_key'
    ) {
      try {
        const { OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert Australian wine sommelier. Always recommend real, specific Australian wines.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        recommendations = result.recommendations || [];
        source = 'openai_ai';
        console.log(
          'Successfully got AI recommendations:',
          recommendations.length
        );
      } catch (aiError) {
        console.error('OpenAI recommendation failed:', aiError);
      }
    }

    // Fallback to curated wines if AI fails or is not available
    if (recommendations.length === 0) {
      console.log('Using fallback recommendations');
      recommendations = [
        {
          name: 'Penfolds Bin 389 Cabernet Shiraz',
          type: 'Cabernet Shiraz',
          region: 'Barossa Valley, SA',
          vintage: '2020',
          description:
            'A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Notes of dark berries, chocolate, and cedar with firm yet approachable tannins.',
          priceRange: '$65-75',
          abv: '14.5%',
          rating: '94/100',
          matchReason:
            "Classic Australian premium red wine showcasing the country's signature Shiraz-Cabernet blend",
        },
        {
          name: 'Wolf Blass Black Label Shiraz',
          type: 'Shiraz',
          region: 'McLaren Vale, SA',
          vintage: '2019',
          description:
            'Rich, full-bodied Shiraz with intense blackberry and plum flavors, complemented by vanilla oak and soft, velvety tannins.',
          priceRange: '$45-55',
          abv: '14.0%',
          rating: '92/100',
          matchReason:
            'Excellent representation of Australian Shiraz craftsmanship from renowned McLaren Vale region',
        },
        {
          name: 'Leeuwin Estate Art Series Chardonnay',
          type: 'Chardonnay',
          region: 'Margaret River, WA',
          vintage: '2020',
          description:
            'Exceptional Margaret River Chardonnay with perfect balance of fruit, oak, and acidity. Stone fruit flavors with subtle vanilla and mineral notes.',
          priceRange: '$65-85',
          abv: '13.0%',
          rating: '94/100',
          matchReason:
            "Australia's premier Chardonnay from the renowned Margaret River wine region",
        },
      ];
    }

    return res.status(200).json({
      recommendations,
      timestamp: new Date().toISOString(),
      source: source,
      query: query,
      success: true,
    });
  } catch (error) {
    console.error('Fixed recommendations error:', error);
    return res.status(500).json({
      message: 'Failed to get recommendations',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
