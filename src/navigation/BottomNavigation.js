import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Home';
import Notification from '../Notification';
import Search from '../Search';
import AddPost from '../AddPost';
import Profile from '../Profile';
import Feather from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();



export default function BottomNavigation({ navigation }) {

  const CustomTabBarButton = ({ childern, onPress }) => (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",

      }}
      onPress={() => navigation.navigate("AddPost")}>

      <View style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#0097e6",
        alignItems: "center",
        justifyContent: "center"
      }}>

        <Feather name="plus" size={26} color="#fff" />
      </View>
    </TouchableOpacity>
  )



  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          position: "absolute",

        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'AddPost') {
            iconName = focused ? 'plus' : 'plus';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'bell' : 'bell';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
          }
          // You can return any component that you like here!
          return (
            <Feather name={iconName} size={size} color={color} />

          )
        },
        tabBarActiveTintColor: '#0097e6',
        tabBarInactiveTintColor: '#000',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="AddPost" component={AddPost} options={{

        tabBarButton: (props) => (
          <CustomTabBarButton {...props} />
        )
      }}/>
      <Tab.Screen name="Notification" component={Notification}/>
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}