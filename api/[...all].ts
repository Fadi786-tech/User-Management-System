import app from '../backend/src/server';

// Vercel will route all `/api/*` requests to this function (catch-all).
// Our Express app already mounts routes under `/api`, so requests like
// `/api/login` will work without any extra path rewriting.
export default app;


