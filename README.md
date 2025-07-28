# GeminiQuery

A full-stack application that uses Google's Gemini AI to answer programming questions.

## Features

- Submit programming questions and get AI-generated answers
- View a live feed of recent questions and answers
- Built with React, TypeScript, and Express
- Deployable to Vercel

## Prerequisites

- Node.js 16+ and npm
- Google Gemini API key
- PostgreSQL database

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database and run migrations:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Prerequisites

- Vercel account
- Vercel CLI (optional)
- All required environment variables set in Vercel project settings

### Deployment Steps

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project** (first time only):
   ```bash
   vercel link
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

   Or deploy to preview:
   ```bash
   vercel
   ```

### Environment Variables in Vercel

Make sure to set the following environment variables in your Vercel project settings:

- `GOOGLE_GEMINI_API_KEY` - Your Google Gemini API key
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - A secure random string for session encryption
- `NODE_ENV` - Set to "production"

### Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your domain and follow the verification steps

## Troubleshooting

- **Build Fails**: Check the build logs in the Vercel dashboard for specific error messages.
- **Database Connection Issues**: Verify your `DATABASE_URL` is correct and the database is accessible from Vercel's servers.
- **API Errors**: Check the server logs in the Vercel dashboard for any runtime errors.

## License

MIT
