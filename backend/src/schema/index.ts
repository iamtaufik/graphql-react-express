import {  GraphQLSchema } from 'graphql';
import { RootQuery } from './query';
import { RootMutation } from './mutation';


export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,  // Tambahkan jika ada
  // subscription: RootSubscription, // Tambahkan jika ada
});
