import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { Card } from "react-native-paper"
import FriendRquest from './FriendRquest';
import Activity from './Activity';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();



export default function Notification() {
  return (
    <>
      <View style={{ backgroundColor: "#fff", height: 70, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold", fontFamily: "Poppins-Bold" }}>Notification</Text>
      </View>
      <Tab.Navigator
        initialRouteName="FriendRequest"
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#fff" },
          tabBarIndicatorStyle: { backgroundColor: "#3498db", height: 50, color: "#fff", borderRadius: 10 },
          tabBarPressColor: '#3C60AA',
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="FriendRequest"
          component={FriendRquest}
          options={{ tabBarLabel: 'Friend Request' }}
        />
        <Tab.Screen
          name="Activity"
          component={Activity}
          options={{ tabBarLabel: 'Activity' }}
        />

      </Tab.Navigator>
    </>
  )
}