# Authentication Setup Guide

This guide will help you set up authentication for your Sella application using Supabase and Google OAuth.

## Prerequisites

1. A Supabase account and project
2. A Google Cloud Console project with OAuth configured

## Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key from the API settings

### 2. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Add your site URL: `http://localhost:3000` (for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### 3. Enable Google OAuth

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen

1. Go to APIs & Services > OAuth consent screen
2. Fill in the required information
3. Add your domain to authorized domains

### 3. Create OAuth Credentials

1. Go to APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

## Authentication Routes

The following routes are available:

- `/auth/login` - Login page with email/password and Google OAuth
- `/auth/signup` - Signup page with email/password and Google OAuth
- `/auth/callback` - OAuth callback handler
- `/dashboard` - Protected dashboard page

## Usage

### Basic Authentication

```typescript
import { authService } from '@/lib/auth'

// Sign up with email/password
const { user, error } = await authService.signUp(email, password)

// Sign in with email/password
const { user, error } = await authService.signIn(email, password)

// Sign in with Google
const { error } = await authService.signInWithGoogle()

// Sign out
const { error } = await authService.signOut()

// Get current user
const user = await authService.getCurrentUser()
```

### Protecting Routes

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function ProtectedPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
    }

    checkAuth()
  }, [router])

  if (!user) return <div>Loading...</div>

  return <div>Protected content</div>
}
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/login`
3. Test both email/password and Google OAuth flows
4. Verify redirect to dashboard after successful authentication
5. Test sign out functionality

## Troubleshooting

### Common Issues

1. **OAuth redirect mismatch**: Ensure redirect URLs match exactly in both Google Console and Supabase
2. **Environment variables not loaded**: Restart your development server after adding `.env.local`
3. **Google OAuth not working**: Check that Google+ API is enabled and OAuth consent screen is configured
4. **Session not persisting**: Verify Supabase configuration and check browser cookies

### Debug Tips

- Check browser developer tools for console errors
- Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
- Check Supabase logs in the dashboard for authentication errors
- Ensure your site URL is correctly configured in Supabase settings

## Security Notes

- Never commit `.env.local` to version control
- Use different Supabase projects for development and production
- Regularly rotate your API keys
- Configure proper CORS settings for production
- Enable RLS (Row Level Security) on your database tables
