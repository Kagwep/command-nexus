// apollo/client.ts
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
    uri: 'http://localhost:8080/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://127.0.0.1:9092/ws'  // WebSocket endpoint from the logs
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

export const ApollClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});