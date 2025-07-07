// Test script for recommendations API
const testRecommendations = async () => {
  console.log('Testing recommendations API...\n');

  const testCases = [
    { query: 'white wine', expected: 'white wines' },
    { query: 'red wine', expected: 'red wines' },
    { query: 'light summer wine', expected: 'light wines' },
    { query: 'Australian wines', expected: 'default recommendations' },
  ];

  for (const testCase of testCases) {
    console.log(`Testing query: "${testCase.query}"`);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: testCase.query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(`✅ Status: ${response.status}`);
      console.log(`✅ Success: ${data.success}`);
      console.log(
        `✅ Recommendations count: ${data.recommendations?.length || 0}`
      );
      console.log(`✅ Query processed: "${data.query}"`);
      console.log(`✅ Source: ${data.source}`);

      if (data.recommendations && data.recommendations.length > 0) {
        console.log(`✅ First recommendation: ${data.recommendations[0].name}`);
      }

      console.log('---\n');
    } catch (error) {
      console.error(`❌ Error testing "${testCase.query}":`, error.message);
      console.log('---\n');
    }
  }
};

// Run the test
testRecommendations();
