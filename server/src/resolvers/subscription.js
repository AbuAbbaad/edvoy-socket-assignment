import { withFilter } from 'apollo-server';
import { ADD_USER, MESSAGE_SENT, REMOVE_USER } from '../constant';

export default {
  messageSent: {
    subscribe: withFilter(
      (_parent, _args, ctx) => ctx.pubsub.asyncIterator([MESSAGE_SENT]),
      (payload, variables) => payload.messageSent.receiver.id === variables.userId
    ),
  },
  userAdded: {
    subscribe: (_parent, _args, ctx) => ctx.pubsub.asyncIterator([ADD_USER]),
  },
  userRemoved: {
    subscribe: (_parent, _args, ctx) => ctx.pubsub.asyncIterator([REMOVE_USER]),
  },
};
