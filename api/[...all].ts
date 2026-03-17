import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple handler for debugging
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Import the app dynamically to catch any import errors
    const { default: app } = await import('../backend/src/server');
    
    // Use serverless-http to handle the request
    const serverless = await import('serverless-http');
    const handler = serverless.default(app);
    
    return handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Function initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};