import { View, Text, StatusBar, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Login from '../Login'
import Registration from '../Registration'
import Home from '../Home'
import Chat from '../Chat'
import BottomNavigation from './BottomNavigation'
import ChatUserList from '../ChatUserList'
import Comment from '../Comment'
import AddPost from '../AddPost'
import Story from '../Story'
import File from '../File'
import MyAllFriend from '../MyAllFriend'
import UserProfileDetail from '../UserProfileDetail'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/Authcontext'
import Camera from '../Camera'
import EditProfile from '../EditProfile'
import AddPostCamera from '../AddPostCamera'
import Setting from '../Setting'
import EditPost from '../EditPost'
import TestStories from '../TestStories'
import UserGallery from '../UserGallery'
import Notification from '../Notification'
import UserPost from '../UserPost'
import AddSomeone from "../AddSomeone"
import AddFriend from "../AddFriend"
import SplashScreen from '../SplashScreen'
import IntroScreen from '../IntroScreen'
import logo from "../../assets/Img/Picture1.png"
import SinglePost from '../SinglePost'
import EmailValidationForgetPass from '../EmailValidationForgetPass'
import NewPassword from '../NewPassword'
import { useQuery } from '@apollo/client'
import { QUERY_GET_USER_BY_ID } from '../../GraphqlOperation/Query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Policy from '../Policy'
import Test from '../Test'


const Stack = createNativeStackNavigator();
export default function AuthStack() {

  const { userInfo, splashLoading } = useContext(AuthContext)

  const [userId, setUserId] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  function Checkuserdata({ navigation }) {
    return (
      <>
        <StatusBar hidden={true} />
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", height: "100%" }}>
          <Image source={logo} style={{ width: 200, height: 200, borderRadius: 100 }} />
        </View>
      </>
    )
  }


  function BlockStatus({ navigation }) {
    return (
      <>
        <StatusBar hidden={true} />
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", height: "100%" }}>
          <Image source={logo} style={{ width: 200, height: 200, borderRadius: 100 }} />
          <Text style={{fontSize:18,marginTop:20,color:"red",fontFamily:"Poppins-Medium"}}>Your Profile is Block</Text>
        </View>
      </>
    )
  }




  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal' }}  >
     {/* <Stack.Screen name="Test" component={Test} /> */}
        {

          splashLoading ?
            <Stack.Screen name="Checkuserdata" component={Checkuserdata} />
            :
             data && data.getUserById.status === "Block" ?
             <Stack.Screen name="BlockStatus" component={BlockStatus} />
             :
             userInfo ?
              <>
               
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="ChatUserList" component={ChatUserList} />
                <Stack.Screen name="Comment" component={Comment} />
                <Stack.Screen name="AddPost" component={AddPost} />
                <Stack.Screen name="File" component={File} />
                <Stack.Screen name="Camera" component={Camera} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="MyAllFriend" component={MyAllFriend} />
                <Stack.Screen name="AddPostCamera" component={AddPostCamera} />
                <Stack.Screen name="UserProfileDetail" component={UserProfileDetail} />
                <Stack.Screen name="Setting" component={Setting} />
                <Stack.Screen name="EditPost" component={EditPost} />
                <Stack.Screen name="Story" component={Story} />
                <Stack.Screen name="TestStories" component={TestStories} />
                <Stack.Screen name="UserGallery" component={UserGallery} />
                <Stack.Screen name="UserPost" component={UserPost} />
                <Stack.Screen name="AddSomeone" component={AddSomeone} />
                <Stack.Screen name="AddFriend" component={AddFriend} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="SinglePost" component={SinglePost} />
                <Stack.Screen name="Policy" component={Policy} />
               
              </>
                :
                <>
                
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Registration" component={Registration} />
                  <Stack.Screen name="EmailValidationForgetPass" component={EmailValidationForgetPass} />
                  <Stack.Screen name="NewPassword" component={NewPassword} />
                  <Stack.Screen name="Policy" component={Policy} />
                </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}