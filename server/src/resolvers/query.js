import { AuthenticationError } from 'apollo-server';

export default {
  users: (_parent, _args, ctx) => ctx.users,
  messages: (_parent, args, ctx) => {
    if (!ctx.user) throw new AuthenticationError('You must be logged-in to do that!');
    const { userId } = args;
    return ctx.messages
      .filter(
        (msg) =>
          // eslint-disable-next-line operator-linebreak
          (msg.receiver.id === userId && msg.sender.id === ctx.user.id) ||
          (msg.receiver.id === ctx.user.id && msg.sender.id === userId)
      )
      .sort((a, z) => z - a);
  },
};
