import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { TodoType } from '../types';
import { prisma } from '../../utils/prisma';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve: async (parent, args) => {
        try {
          return await prisma.todo.findMany();
        } catch (error) {
          throw new Error('Error getting todos');
        }
      },
    },

    todo: {
      type: TodoType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, { id }: { id: string }) => {
        try {
          const todo = await prisma.todo.findUnique({
            where: {
              id: id,
            },
          });

          if(!todo) throw new Error('Todo not found');

          return todo;
        } catch (error) {
            if(error instanceof Error) {
                throw new Error(error.message);
            }
          throw new Error('Error getting todo');
        }
      },
    },
  },
});
