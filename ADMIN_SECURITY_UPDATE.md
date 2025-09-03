# Admin Security Update

## Overview
The admin panel has been updated with a secure authentication system that moves sensitive credentials out of the source code.

## Changes Made

### 1. Environment Variables
Added secure credentials to `.env.local`:
```
ADMIN_PASSWORD=YummiGo@admin123
ADMIN_API_KEY=yummi-go-secure-api-2025-v2
```

### 2. Authentication API
Created `/api/admin/auth` endpoint that:
- Validates the admin password securely on the server
- Returns the API key only after successful authentication
- Never exposes credentials in client-side code

### 3. Updated Components
- **Admin Page**: Now uses API-based authentication instead of hardcoded password
- **Upload API**: Uses environment variable for API key validation
- **Content API**: Uses environment variable for API key validation  
- **Image Manager**: Receives API key as prop from authenticated parent

### 4. Security Benefits
- ✅ No hardcoded passwords in source code
- ✅ Credentials stored in `.env.local` (gitignored)
- ✅ Server-side validation only
- ✅ API keys passed securely after authentication
- ✅ Environment-specific configuration

## Usage

### Admin Login
1. Go to `/admin`
2. Enter password: `YummiGo@admin123`
3. System validates credentials server-side
4. On success, receives secure API key for subsequent operations

### Development Setup
Ensure your `.env.local` file contains:
```
ADMIN_PASSWORD=YummiGo@admin123
ADMIN_API_KEY=yummi-go-secure-api-2025-v2
```

### Production Deployment
Make sure to set these environment variables in your production environment (Vercel, AWS, etc.):
- `ADMIN_PASSWORD`
- `ADMIN_API_KEY`

## Files Modified
- `.env.local` - Added secure credentials
- `src/app/api/admin/auth/route.ts` - New authentication endpoint
- `src/app/admin/page.tsx` - Updated to use API authentication
- `src/app/api/upload/route.ts` - Uses environment variables
- `src/app/api/content/route.ts` - Uses environment variables
- `src/components/ImageManager.tsx` - Accepts API key as prop

The system is now secure and follows best practices for credential management.
