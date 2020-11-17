import { ApolloServer, PubSub } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './schema';
import { getUser } from './utils';

const pubsub = new PubSub();

const users = [];
const messages = [];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (request) => {
    // req will be undefined for WebSocket connections.
    if (!request.req) {
      return {
        ...request,
        pubsub,
        users,
        messages,
      };
    }
    // Get the user token from the headers.
    const token = request.req.headers.authorization || '';
    // try to retrieve a user with the token
    const user = getUser(token);

    return {
      ...request,
      pubsub,
      users,
      messages,
      user,
    };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
  // eslint-disable-next-line no-console
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
