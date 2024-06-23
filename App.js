import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Home from './src/Home';
import BottomNavigation from './src/navigation/BottomNavigation';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { ApolloClient, ApolloLink, InMemoryCache, split, ApolloProvider, useMutation } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from '@apollo/client/link/ws';
import FlashMessage from "react-native-flash-message";
import { AuthProvider } from './src/context/Authcontext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MUTATION_UPDATE_USER_PROFILE } from './GraphqlOperation/Mutation';




export default function App() {
  const httpLink = new HttpLink({
    uri: "https://social-networking-backend-nine.vercel.app/graphql",
  });


  const wsLink = new WebSocketLink({
    uri: "wss://social-networking-backend-nine.vercel.app/graphql",
    options: {
      reconnect: true
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([splitLink]),
  });




  const [userId, setUserId] = useState()
  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])







  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AuthStack />
        <FlashMessage position="bottom" />
      </AuthProvider>
    </ApolloProvider>

  )
}
