// frontend/lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3001/graphql", // endpoint do Rails
    credentials: "include", // importante p/ cookies JWT
  }),
  cache: new InMemoryCache(),
});

export default client;
