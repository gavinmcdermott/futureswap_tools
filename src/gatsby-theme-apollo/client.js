import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"
import fetch from "isomorphic-fetch"

// Multi-link Setup:
// https://www.loudnoises.us/next-js-two-apollo-clients-two-graphql-data-sources-the-easy-way/
// https://www.apollographql.com/docs/link/composition/

// WS subscriptions: 
// https://www.apollographql.com/docs/react/api/react-hooks/#usesubscriptions

// Live Data Manual Learning:
// https://thegraph.com/explorer/subgraph/futureswap/futureswap-v1

// Test Playground:
// const mainnetHTTP = "https://api.thegraph.com/subgraphs/name/jesseabram/futureswap";
// const mainnetWS = "wss://api.thegraph.com/subgraphs/name/jesseabram/futureswap";


const mainnetHTTP = "https://api.thegraph.com/subgraphs/name/futureswap/futureswap-v1";
const mainnetWS = "https://api.thegraph.com/subgraphs/name/futureswap/futureswap-v1";

const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().WS === true,
    ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        if (networkError) console.log(`[Network error]: ${networkError}`)
      }),
      new HttpLink({
        uri: mainnetWS,
      }),
    ]),
    ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        if (networkError) console.log(`[Network error]: ${networkError}`)
      }),
      new HttpLink({
        uri: mainnetHTTP,
      }),
    ]),
  ),
  cache: new InMemoryCache(),
  fetch,
})

export default client
