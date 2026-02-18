import serverless from 'serverless-http';
import app from '../backend/src/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default serverless(app);
