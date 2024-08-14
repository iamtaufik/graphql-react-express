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
