import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHp0enU5cWIwMDA0MTM1YnNvcmlic2lsIiwiaWF0IjoxNzIzNjQ4NTUxLCJleHAiOjE3MjM3MzQ5NTF9.oc6AOwG8wY5MsaSsgbU9cNMPRucGrH-s2WuTVXqFRAQ',
  },
});

export default client;
