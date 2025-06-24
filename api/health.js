// Simple health check endpoint
export default function handler(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'cork-api'
  });
}