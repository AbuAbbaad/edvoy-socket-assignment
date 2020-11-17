import { AuthenticationError } from 'apollo-server';
import { v4 as uuid } from 'uuid';
import { ADD_USER, MESSAGE_SENT, REMOVE_USER } from '../constant';

export default {
  sendMessage: (_parent, args, ctx) => {
    if (!ctx.user) throw new AuthenticationError('You must be logged-in to do that!');
    const id = uuid();
    const time = new Date().getTime();
    const newMessage = {
      ...args.message,
      id,
      sender: ctx.user,
      time,
    };
    ctx.messages.push(newMessage);
    ctx.pubsub.publish(MESSAGE_SENT, { messageSent: newMessage });
    return newMessage;
  },
  addUser: (_parent, args, ctx) => {
    const id = uuid();
    const newUser = { id, ...args.user };
    ctx.users.push(newUser);
    ctx.pubsub.publish(ADD_USER, { userAdded: newUser });
    return newUser;
  },
  removeUser: (_parent, args, ctx) => {
    const { userId } = args;
    ctx.users = ctx.users.filter((u) => u.id === userId);
    ctx.pubsub.publish(REMOVE_USER, { userRemoved: userId });
    return true;
  },
};
