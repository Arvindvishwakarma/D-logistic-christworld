/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { View, Text,TouchableOpacity,TextInput,Image, ScrollView, ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import Feather from 'react-native-vector-icons/Feather';
import forgetImg from "../assets/Img/Security-pana.png"
import { useMutation } from '@apollo/client';
import { MUTATION_RESET_PASSWORD, MUTATION_UPDATE_USER_PROFILE, MUTATION_USER_LOGIN, MUTATION_USER_UPDATE } from '../GraphqlOperation/Mutation';
import { QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { showMessage, hideMessage } from "react-native-flash-message";

export default function NewPassword({navigation,route}) {

  const{data} = route.params;

  console.log("data",data)

    const [password, setPassword] = useState("")
    const [passwordCon, setPasswordCon] = useState("")

    const [checkpass, setCheckPass] = useState(true)
    const [checkConpass, setCheckConpass] = useState(true)

    const [resetPassword, { loading: updateLoading }]=   useMutation(MUTATION_RESET_PASSWORD,{
      refetchQueries:[
        QUERY_GET_USER_BY_ID,
        "getUserById"
      ]
    })
    
    function  handleClick(){
        if(password === passwordCon){
          resetPassword({
            variables:{
              "resetPasswordInput": {
                "userId": `${data && data.getEmailvalidation.id}`,
                "password": `${passwordCon}`,
              },
            }
          }).then(()=>{
            showMessage({
              message: "Reset Password Successfully",
              backgroundColor: "green",
              type: "success",
            });
            navigation.navigate("Login")
          }
          )
            
        }else{
          showMessage({
            message: "Confirm Password not match",
            backgroundColor: "red",
            type: "warning",
          });
        }
    }



  return (
    <View style={{backgroundColor:"#fff",height:"100%"}}>
      <ScrollView>
      
        <TouchableOpacity onPress={()=>navigation.goBaCk()}>
     <Feather name="arrow-left" size={25} style={{marginTop:10,marginLeft:10,color:"#000"}} />
     </TouchableOpacity>
     <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <Text style={{color:"#000",fontSize:18,fontFamily:"Poppins-SemiBold"}}>Reset Password</Text>
      <Image source={forgetImg} style={{width:260,height:250}} />
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20,width:"99%" }}>
        <View style={{width:"85%",marginBottom:10}}>
         

        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="lock" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter New Password' style={{ color: "#000", width: "73%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" secureTextEntry={checkpass} onChangeText={(e) => setPassword(e)} value={password} />

            {
              checkpass === true ?
                <TouchableOpacity onPress={() => setCheckPass(false)}>
                  <Feather name="eye" size={25} style={{ margin: 7, color: "#000" }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setCheckPass(true)}>
                  <Feather name="eye-off" size={25} style={{ margin: 7, color: "#000" }} />
                </TouchableOpacity>
            }
          </View>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="lock" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Confirm New Password' style={{ color: "#000", width: "73%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" secureTextEntry={checkConpass} onChangeText={(e) => setPasswordCon(e)} value={passwordCon} />

            {
              checkConpass === true ?
                <TouchableOpacity onPress={() => setCheckConpass(false)}>
                  <Feather name="eye" size={25} style={{ margin: 7, color: "#000" }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setCheckConpass(true)}>
                  <Feather name="eye-off" size={25} style={{ margin: 7, color: "#000" }} />
                </TouchableOpacity>

            }
          </View>
        </View>
      </View>
     </View>
     
     <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:20}}>
   {
            password === "" ?
            <>
            <View style={{width:"90%"}}>
      
            {
              updateLoading ?
              <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
             <ActivityIndicator   size="large" color="#fff" />
            </View>
              :
              <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <Text  style={{color:"#fff",fontFamily:"Poppins-SemiBold",fontSize:15}}>Change</Text>
              </View>
          
            }
    
           </View>
           </>
            :
            <>
     <View style={{width:"90%"}}>
      
     {
       updateLoading ?
       <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <ActivityIndicator   size="large" color="#fff" />
     </View>
       :

       <TouchableOpacity onPress={()=>handleClick()}>
       <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
         <Text  style={{color:"#fff",fontFamily:"Poppins-SemiBold",fontSize:15}}>Change</Text>
       </View>
       </TouchableOpacity>

     }



    </View>
    </>


   }

     </View>
     </ScrollView>
    </View>
  )
}