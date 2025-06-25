# Critical Production Deployment Issue

## Issue Summary
FUNCTION_INVOCATION_FAILED errors preventing Clerk authentication profile setup completion on getcork.app

## Root Cause
TypeScript compilation errors in protected configuration files (server/vite.ts, vite.config.ts) blocking ALL Vercel serverless functions:

```
server/vite.ts:1:8 - error TS1259: Module express can only be default-imported using the 'esModuleInterop' flag
server/vite.ts:2:8 - error TS1192: Module "fs" has no default export
server/vite.ts:3:8 - error TS1259: Module "path" can only be default-imported using the 'esModuleInterop' flag
server/vite.ts:52:9 - error TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'
```

## Impact
- ❌ Profile setup fails: Users cannot complete account creation
- ❌ Wine recommendations fail: Core app functionality unavailable  
- ❌ All authentication-dependent features broken
- ✅ Frontend loads correctly
- ✅ Email signup works (standalone function)
- ✅ Health checks operational

## Solutions Attempted
1. ✅ Created standalone serverless functions (profile-complete.js, wine-recommendations.js)
2. ❌ All serverless functions fail with FUNCTION_INVOCATION_FAILED
3. ❌ Cannot modify protected vite configuration files
4. ✅ Identified exact compilation errors

## Required Fix
The TypeScript compilation errors in protected configuration files must be resolved to enable serverless function deployment. This requires:

1. Fixing import syntax in server/vite.ts:
   - Change `import express, { type Express }` to proper CommonJS imports
   - Replace `import.meta.dirname` with `__dirname`
   - Add proper TypeScript module configuration

2. Updating tsconfig.json to enable ES module interop:
   - Add `"esModuleInterop": true`
   - Set `"module": "esnext"` or compatible

3. Alternative: Deploy main Express server as single serverless function instead of individual endpoints

## Current Status
- Production frontend: ✅ Working
- Email capture: ✅ Working  
- Account creation: ❌ Blocked by profile setup failure
- Core features: ❌ Blocked by API endpoint failures

## Testing Verification
```bash
# Working endpoints
curl https://getcork.app/api/health
curl -X POST https://getcork.app/api/email-signup

# Failing endpoints (FUNCTION_INVOCATION_FAILED)
curl -X POST https://getcork.app/api/profile/setup
curl -X POST https://getcork.app/api/recommendations
```

## Next Steps
Fix the TypeScript configuration issues to enable proper serverless function compilation and deployment.