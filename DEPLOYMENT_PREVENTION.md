# Deployment Issue Prevention Guide

## Root Cause Prevention

### 1. TypeScript Configuration Hardening
- **Issue**: `import.meta.dirname` syntax causing compilation failures
- **Prevention**: Use Node.js compatible patterns consistently

```typescript
// Instead of: import.meta.dirname
// Use: const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

### 2. Vercel Deployment Monitoring
- **Issue**: Cached broken builds preventing serverless function updates
- **Prevention**: Implement deployment health checks

#### Add to package.json:
```json
{
  "scripts": {
    "vercel:health": "curl -f https://getcork.app/api/health || exit 1",
    "vercel:test": "npm run vercel:health && curl -f https://getcork.app/api/recommendations -X POST -H 'Content-Type: application/json' -d '{\"query\":\"test\"}'",
    "deploy:verify": "sleep 30 && npm run vercel:test"
  }
}
```

### 3. Serverless Function Isolation
- **Issue**: Complex Express server causing compilation failures
- **Prevention**: Critical endpoints as standalone functions

#### Keep These as Standalone Functions:
- Email capture (`/api/email-signup.js`)
- Health checks (`/api/health.js`) 
- Profile setup (`/api/setup-profile.js`)

### 4. TypeScript Build Validation
- **Issue**: Silent compilation failures in protected files
- **Prevention**: Pre-deployment type checking

#### Add to vercel.json:
```json
{
  "buildCommand": "npm run type-check && npm run build",
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

### 5. Graceful Fallbacks
- **Issue**: Complete functionality loss during deployment issues
- **Prevention**: Progressive enhancement patterns

#### For Wine Recommendations:
```typescript
// Fallback to cached recommendations if OpenAI fails
const getCachedRecommendations = () => [/* Australian wine data */];

try {
  return await getWineRecommendations(query);
} catch (error) {
  console.warn("Using cached recommendations due to:", error.message);
  return getCachedRecommendations();
}
```

## Monitoring Implementation

### 1. Deployment Status Endpoint
Create `/api/deployment-status` to check:
- Server compilation status
- Database connectivity
- External API availability
- Critical function health

### 2. Automated Testing Pipeline
- Health check after each deployment
- Critical path testing (auth, recommendations, payments)
- Rollback triggers for failed deployments

### 3. Error Alerting
- Monitor FUNCTION_INVOCATION_FAILED patterns
- Track compilation error frequency
- Alert on consecutive endpoint failures

## Emergency Response Protocol

### 1. Quick Diagnosis
```bash
# Check health endpoint
curl https://getcork.app/api/health

# Test core functionality
curl -X POST https://getcork.app/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

### 2. Rapid Recovery
- Route failing endpoints to standalone functions
- Enable maintenance mode for critical features
- Implement circuit breakers for external dependencies

### 3. Communication Plan
- User-facing status updates
- Technical team notifications
- Escalation procedures for extended outages

## Best Practices Going Forward

1. **Protected File Access**: Always test compilation after editing vite.ts or similar protected files
2. **Deployment Verification**: Wait 2-3 minutes after deployment before marking as successful
3. **Redundant Routing**: Keep standalone serverless functions as backup for critical endpoints
4. **Gradual Rollouts**: Test new features on staging before production deployment
5. **Dependency Isolation**: Keep OpenAI and external APIs separate from core functionality