import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AuthType, TodoType, UserType } from '../types';
import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/auth';

export const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { title: string }, ctx: { userId?: string }) => {
        try {
          if (!ctx.userId) {
            throw new Error('Unauthorized');
          }

          return await prisma.todo.create({
            data: {
              title: args.title,
              user: {
                connect: {
                  id: ctx.userId,
                },
              },
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
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
      resolve: async (parent, args: { completed: boolean; id: string }, ctx: { userId?: string }) => {
        try {
          const isTodoExist = await prisma.todo.findUnique({
            where: {
              id: args.id,
              AND: { userId: ctx.userId },
            },
          });

          if (!isTodoExist) throw new Error('Todo not found');

          return await prisma.todo.update({
            where: {
              id: args.id,
              AND: { userId: ctx.userId },
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
      resolve: async (parent, args: { id: string }, ctx: { userId?: string }) => {
        try {
          if (!ctx.userId) {
            throw new Error('Unauthorized');
          }

          const isTodoExist = await prisma.todo.findUnique({
            where: {
              id: args.id,
              AND: { userId: ctx.userId },
            },
          });

          if (!isTodoExist) throw new Error('Todo not found');

          return await prisma.todo.delete({
            where: {
              id: args.id,
              AND: { userId: ctx.userId },
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

    signUp: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { email: string; password: string }) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: args.email,
            },
          });

          if (user) throw new Error('User already exists');

          const hashedPassword = await bcrypt.hash(args.password, 10);

          return await prisma.user.create({
            data: {
              email: args.email,
              password: hashedPassword,
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error('Error creating user');
        }
      },
    },

    signIn: {
      type: AuthType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args: { email: string; password: string }) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: args.email,
            },
          });

          if (!user) throw new Error('Invalid email or password');

          const isPasswordValid = await bcrypt.compare(args.password, user.password);

          if (!isPasswordValid) throw new Error('Invalid email or password');

          const token = generateToken(user.id);

          return { token, user };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error('Error authenticating user');
        }
      },
    },
  },
});
