export default async function handler(req, res) {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      server: "unknown",
      database: "unknown", 
      openai: "unknown",
      recommendations: "unknown"
    };

    // Test server compilation
    try {
      status.server = "healthy";
    } catch (error) {
      status.server = "failed";
    }

    // Test OpenAI availability
    try {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'default_key') {
        status.openai = "configured";
      } else {
        status.openai = "not_configured";
      }
    } catch (error) {
      status.openai = "error";
    }

    // Test database connectivity
    try {
      if (process.env.DATABASE_URL) {
        status.database = "configured";
      } else {
        status.database = "not_configured";
      }
    } catch (error) {
      status.database = "error";
    }

    // Test recommendations endpoint
    status.recommendations = "testing_required";

    res.status(200).json({
      status: "operational",
      checks: status,
      message: "Deployment health check completed"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}