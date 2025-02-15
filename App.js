// In App.js in a new project

import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import UserDetailsScreen from './src/screens/UserDetailsScreen';
Amplify.configure(awsconfig);

const RootStack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: HomeScreen,
            options: { headerShown: false },
        },
        UserDetails: {
            screen: UserDetailsScreen,
        },
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />;
}
