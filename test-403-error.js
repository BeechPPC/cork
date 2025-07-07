// Test script to see the exact format of 403 error response
const test403Error = async () => {
  console.log('Testing 403 error response format...\n');

  try {
    // This will likely fail with 403 since the user has reached their limit
    const response = await fetch('http://localhost:5000/api/cellar/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        wineName: 'Test Wine 403',
        wineType: 'Shiraz',
        region: 'Barossa Valley',
        vintage: '2020',
        description: 'Test wine for 403 error',
        priceRange: '$50-60',
        abv: '14.0%',
        rating: '92/100',
        source: 'recommendation',
      }),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (response.status === 403) {
      try {
        const errorData = JSON.parse(responseText);
        console.log('Parsed error data:', errorData);
        console.log('Current count:', errorData.currentCount);
        console.log('Max count:', errorData.maxCount);
      } catch (e) {
        console.log('Could not parse response as JSON:', e.message);
      }
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

// Run the test
test403Error();
