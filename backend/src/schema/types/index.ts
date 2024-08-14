import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

export const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: {
    token: { type: GraphQLString },
    user: { type: UserType },
  },
});
