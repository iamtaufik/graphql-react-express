import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { TodoType } from '../types';
import { prisma } from '../../utils/prisma';

export const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { title: string }) => {
        try {
          return await prisma.todo.create({
            data: {
              title: args.title,
            },
          });
        } catch (error) {
          throw new Error('Error creating todo');
        }
      },
    },

    updateTodo: {
      type: TodoType,
      args: {
        completed: { type: new GraphQLNonNull(GraphQLBoolean) },
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { completed: boolean; id: string }) => {
        try {
          const isTodoExist = await prisma.todo.findUnique({
            where: {
              id: args.id,
            },
          });

          if (!isTodoExist) throw new Error('Todo not found');

          return await prisma.todo.update({
            where: {
              id: args.id,
            },
            data: {
              completed: args.completed,
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error('Error updating todo');
        }
      },
    },

    deleteTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { id: string }) => {
        try {
          const isTodoExist = await prisma.todo.findUnique({
            where: {
              id: args.id,
            },
          });

          if (!isTodoExist) throw new Error('Todo not found');

          return await prisma.todo.delete({
            where: {
              id: args.id,
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error('Error deleting todo');
        }
      },
    },
  },
});
