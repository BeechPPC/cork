import https from 'https';

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'getcork.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          path: path,
          timestamp: new Date().toISOString(),
          success: res.statusCode < 400
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 'ERROR',
        path: path,
        error: error.message,
        timestamp: new Date().toISOString(),
        success: false
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function monitor() {
  console.log('Monitoring deployment status...');
  
  const health = await testEndpoint('/api/health');
  console.log(`Health: ${health.status} ${health.success ? '✓' : '✗'}`);
  
  const recommendations = await testEndpoint('/api/recommendations', 'POST', {query: 'test'});
  console.log(`Recommendations: ${recommendations.status} ${recommendations.success ? '✓' : '✗'}`);
  
  console.log(`Check completed at ${new Date().toISOString()}`);
}

monitor();