import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/db/connect.js';
import { typeDefs } from './src/graphql/typeDefs.js';
import { resolvers } from './src/graphql/resolvers.js';
import { verifyToken } from './src/auth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const start = async () => {
  try {
    await connectDB();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const auth = req.headers.authorization || '';
        const user = verifyToken(auth);
        return { user };
      },
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
  } catch (err) {
    console.error('Server start failed:', err);
    process.exit(1);
  }
};

start();
