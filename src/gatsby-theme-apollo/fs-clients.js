// import { ApolloClient } from "apollo-client";
// import { HttpLink } from "apollo-link-http";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { SubscriptionClient } from "subscriptions-transport-ws";
// import { WebSocketLink } from "apollo-link-ws";
// import web3 from "../provider";

// export const getChainlinkClient = async () => {
//   const mainnet =
//     "https://api.thegraph.com/subgraphs/name/jesseabram/chainlink-aggregators";
//   const rinkeby =
//     "https://api.thegraph.com/subgraphs/name/jesseabram/rinkeby-chainlink-aggregators";
//   const network = await web3.eth.net.getNetworkType();
//   const endpoint = network === "rinkeby" ? rinkeby : mainnet;
//   const client = new ApolloClient({
//     link: new HttpLink({ uri: endpoint }),
//     cache: new InMemoryCache()
//   });
//   return client;
// };

// export const getFSHTTPClient = async () => {
//   const mainnet =
//     "https://api.thegraph.com/subgraphs/name/jesseabram/futureswap";
//   const rinkeby =
//     "https://api.thegraph.com/subgraphs/name/jesseabram/futureswap";
//   const network = await web3.eth.net.getNetworkType();
//   const endpoint = network === "rinkeby" ? rinkeby : mainnet;
//   const client = new ApolloClient({
//     link: new HttpLink({ uri: endpoint }),
//     cache: new InMemoryCache()
//   });
//   return client;
// };

// export const setupFSWSClient = async () => {
//   const mainnet = "wss://api.thegraph.com/subgraphs/name/jesseabram/futureswap";
//   const rinkeby = "wss://api.thegraph.com/subgraphs/name/jesseabram/futureswap";
//   const network = await web3.eth.net.getNetworkType();
//   const endpoint = network === "rinkeby" ? rinkeby : mainnet;

//   const client = new SubscriptionClient(endpoint, {
//     reconnect: true
//   });

//   const apolloClient = new ApolloClient({
//     networkInterface: client,
//     link: new WebSocketLink(client),
//     cache: new InMemoryCache()
//   });

//   getFSWSClient = apolloClient;
// };

// export let getFSWSClient;