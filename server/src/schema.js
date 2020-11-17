import { gql } from 'apollo-server';

export default gql`
  type Message {
    id: ID!
    text: String!
    sender: User!
    receiver: User!
    time: Float!
  }

  input MessageInput {
    text: String!
    receiver: ReceiverInput!
  }

  input ReceiverInput {
    id: ID!
    name: String!
  }

  input UserInput {
    name: String!
  }

  type User {
    id: ID!
    name: String!
    messages: [Message!]
  }

  type Query {
    users: [User!]!
    messages(userId: String!): [Message!]!
  }

  type Mutation {
    addUser(user: UserInput): User!
    removeUser(userId: ID!): Boolean!
    sendMessage(message: MessageInput!): Message!
  }

  type Subscription {
    userAdded: User!
    userRemoved: String!
    messageSent(userId: String!): Message!
  }
`;
