import AWSAppSyncClient from 'aws-appsync';
import { Amplify } from 'aws-amplify'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

// const client = new AWSAppSyncClient({
//     url: awsconfig.aws_appsync_graphqlEndpoint,
//     region: awsconfig.aws_project_region,
//     auth: {
//         type: awsconfig.aws_appsync_authenticationType,
//         apiKey: awsconfig.aws_appsync_apiKey,
//     },
//     disableOffline: true,
// });

// const apolloClient = new ApolloClient({
//     link: client.createLink(),
//     cache: new InMemoryCache(),
// });

// export default apolloClient;
