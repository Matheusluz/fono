// frontend/lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  // pega token do localStorage (demo). Preferir cookie httpOnly em produção.
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
