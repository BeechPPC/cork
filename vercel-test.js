// Test script for email signup endpoint
async function testEmailSignup() {
  const testUrl = 'https://getcork.app/api/email-signup';
  const testEmail = `test-${Date.now()}@example.com`;

  try {
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        firstName: 'Test User'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.status === 500) {
      console.error('Server error detected!');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Run test
testEmailSignup();