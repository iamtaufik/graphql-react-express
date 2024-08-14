import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
var { ruruHTML } = require('ruru/server');
import { schema } from './schema';
import cors from 'cors';
import { getUserFromToken } from './utils/auth';

const port = 4000;

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.all(
  '/graphql',
  createHandler({
    schema,
    context: (req) => {
      const userId = getUserFromToken(req);
      return {
        userId,
      };
    },
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
