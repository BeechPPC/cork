// Test script for wine save functionality
const testSaveWine = async () => {
  console.log('Testing wine save functionality...\n');

  // Test data for saving a wine
  const testWine = {
    wineName: 'Test Wine Save',
    wineType: 'Shiraz',
    region: 'Barossa Valley',
    vintage: '2020',
    description: 'Test wine for debugging save functionality',
    priceRange: '$50-60',
    abv: '14.0%',
    rating: '92/100',
    source: 'recommendation',
  };

  try {
    console.log('1. Testing save wine endpoint...');
    const saveResponse = await fetch('http://localhost:5000/api/cellar/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(testWine),
    });

    console.log(`Save response status: ${saveResponse.status}`);

    if (saveResponse.ok) {
      const savedWine = await saveResponse.json();
      console.log('✅ Wine saved successfully:', savedWine);
    } else {
      const error = await saveResponse.text();
      console.log('❌ Save failed:', error);
    }

    console.log('\n2. Testing get cellar endpoint...');
    const getResponse = await fetch('http://localhost:5000/api/cellar', {
      headers: {
        Authorization: 'Bearer test-token',
      },
    });

    console.log(`Get response status: ${getResponse.status}`);

    if (getResponse.ok) {
      const wines = await getResponse.json();
      console.log('✅ Retrieved wines:', wines);
      console.log(`Found ${wines.length} wines in cellar`);
    } else {
      const error = await getResponse.text();
      console.log('❌ Get failed:', error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testSaveWine();
