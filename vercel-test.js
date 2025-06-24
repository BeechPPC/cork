// Test the simplified email signup endpoint
fetch('https://getcork.app/api/email-signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    firstName: 'Test' 
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);