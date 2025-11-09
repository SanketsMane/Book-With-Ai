import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const manifest = {
    "name": "Book With Ai",
    "short_name": "BookWithAi", 
    "description": "Plan your perfect trip with AI-powered recommendations",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6", 
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/logo.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/logo.png",
        "sizes": "512x512", 
        "type": "image/png"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest), {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
}