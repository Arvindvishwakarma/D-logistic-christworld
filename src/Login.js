import { View, Text, StatusBar, TouchableOpacity, TextInput, ActivityIndicator,Image ,StyleSheet} from 'react-native'
import React, { useContext, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from './context/Authcontext';
import { useQuery } from '@apollo/client';
import { QUERY_GET_ALL_USER } from '../GraphqlOperation/Query';
import christ from "../assets/Img/newlogo.jpeg"
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Login({ navigation }) {

  const [text, setText] = useState("");
  const [checkpass, setCheckPass] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loginHandel, emptyError, userLoginLoading, loginError } = useContext(AuthContext)
  const { data } = useQuery(QUERY_GET_ALL_USER)
  console.log("data", data)
  
  const slides = [
    {
      key: 'one',
      title: 'Christ World',
      text: '" Jesus saith unto him,I am the way, the truth, and the life: no man cometh unto the Father, but by me. " Jonh14:06',
      logo: require('../assets/Img/newlogo.jpeg'),
      image: "null",
      backgroundColor: '#fff',
    },
    {
      key: 'two',
      title: 'Christ World',
      text: 'Christ World is a social platform for believers to share their love for Jesus Christ, find peace through fellowship, praise, and worship, and offer support and encouragement to each other. It is a place where devotion to the Savior is expressed wholeheartedly.',
      logo: require('../assets/Img/newlogo.jpeg'),
      image: require('../assets/Img/Pray-rafiki1.png'),
      backgroundColor: '#0abde3',
    },
    {
      key: 'three',
      title: 'Christ World',
      text: 'Christ World is a platform dedicated to fostering a community centered around faith, love, and the teachings of Jesus Christ. Creating a space for fellowship, support, and encouragement among believers is a wonderful way to share the message of love and find strength in one is faith. If there is anything specific you did like to discuss or explore regarding this platform or its purpose, feel free to ask!',
      logo: require('../assets/Img/newlogo.jpeg'),
      image:require('../assets/Img/Conference-amico.png'),
      backgroundColor: '#fff',
    }
  ];

 const[showRealApp,setShowRealApp] =useState(false)

 useEffect(()=>{
  AsyncStorage.getItem('@viewedOnborading').then(data=>setShowRealApp(data))
 },[])


const  _onDone =async () => {
    try {
      await AsyncStorage.setItem('@viewedOnborading', 'true');
      setShowRealApp('true')
    } catch (e) {
      console.log('Error', e);
    } finally{
      setShowRealApp('true')
    }
  }

  
const  _onSkip =async () => {
    try {
      await AsyncStorage.setItem('@viewedOnborading', 'true');
      setShowRealApp( 'true')
    } catch (e) {
      console.log('Error', e);
    } finally{
      setShowRealApp('true')
    }
  }

 const _renderItem = ({ item }) => {
    return (
      <View  style={{backgroundColor:item.backgroundColor,flex:1,justifyContent:"center",alignItems:"center"}}>
       
        <Image source={item.logo} style={{width:100,height:100,borderRadius:100,marginBottom:30}} />
        <Text style={{marginBottom:10,color:"#000", fontFamily: "Poppins-Bold"}}>* {item.title} *</Text>
        <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <View style={{width:"80%",marginTop:15,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <Text style={{textAlign:"center",color:"#000"}} >{item.text}</Text>
            <Image source={item.image} style={{width:150,height:150,borderRadius:100,marginBottom:30}} />
            </View>

        </View>
       
      </View>
    );
  }

  const  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  const buttonLabel =(label)=>{
    return(
      <View style={{padding:12}}>
        <Text style={{color:"#000",fontWeight:"600",fontSize:18}}>{label}</Text>
      </View>
    )
  }

  
  const handleOnBoard = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnborading', 'true');
      setViewOnBoard(true)
      
    } catch (e) {
      console.log('Error', e);
    } finally{
       
    }
  };


  if(!showRealApp){
    return(
      <AppIntroSlider renderItem={_renderItem} data={slides} 
      activeDotStyle={{
        backgroundColor:"#0097e6",
        width:30
      }}
      onSkip={_onDone}
      onDone={_onDone}
      showSkipButton
       renderNextButton={()=>buttonLabel("Next")}
       renderSkipButton={()=>buttonLabel("Skip")}
       renderDoneButton={()=>buttonLabel("Done")
        


       }
      />
    )
  }



  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
        <Image source={christ}  style={{width:150,height:150,borderRadius:100}}/>

        <Text style={{ fontSize: 18, color: "#000", fontFamily: "Poppins-SemiBold" }}>Sign In Now</Text>
        <View style={{ width: "90%", marginTop: 10 }}>
          <Text style={{ color: "#000", fontFamily: "Poppins-Medium", fontSize: 13, textAlign: "center" }}>Please Enter Your Information Below In Order To Login To Your Account</Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
          <Feather name="user" size={25} style={{ margin: 7, color: "#000" }} />
          <TextInput placeholder='Enter Email Id' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setEmail(e)} value={email} />
        </View>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
          <Feather name="lock" size={25} style={{ margin: 7, color: "#000" }} />
          <TextInput placeholder='Enter Password' style={{ color: "#000", width: "73%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" secureTextEntry={checkpass} onChangeText={(e) => setPassword(e)} value={password} />
          {
            checkpass === true ?
              <TouchableOpacity onPress={() => setCheckPass(false)}>
                <Feather name="eye" size={25} style={{ marginTop:12, color: "#000",marginLeft:5 }} />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => setCheckPass(true)}>
                <Feather name="eye-off" size={25} style={{marginTop:12, color: "#000",marginLeft:5 }} />
              </TouchableOpacity>
          }
        </View>
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <View style={{ width: "90%", height: 50, backgroundColor: "#3498db", borderRadius: 10, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {
            userLoginLoading ?
              <>
                <ActivityIndicator size="small" color="#fff" />
              </>
              :
              <>
                <View style={{ width: "100%" }}>
                  <TouchableOpacity onPress={() => loginHandel(email, password)}>
                    <View style={{ width: "100%", height: 50, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 20, color: "#fff", fontFamily: "Poppins-SemiBold" }}>Sign In</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
          }
        </View>
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 15 }}>
        <TouchableOpacity  onPress={()=>navigation.navigate("EmailValidationForgetPass")}>
        <Text style={{ fontWeight: "600", color: "#3498db", fontFamily: "Poppins-Medium" }}>Forgot Password</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
          <Text style={{ color: "#000", fontFamily: "Poppins-Medium" }}>Don`t Have An Account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={{ marginLeft: 5, fontWeight: "600", color: "#3498db", fontFamily: "Poppins-Medium" }}>Create Now</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate("Policy")}>
         <View style={{width:"90%",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:10}}>
        <Text style={{color:"#000",fontFamily: "Poppins-Medium",fontSize:12}}>Privacy Policy </Text>
        </View>
        </TouchableOpacity>
      </View>
      {
        loginError ?
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <Text style={{ color: "red" }}>Login failed not match email and Password!!</Text>
          </View>
          :
          <></>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});