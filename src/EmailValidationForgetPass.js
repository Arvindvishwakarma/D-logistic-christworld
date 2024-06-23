import { View, Text, TouchableOpacity,Image ,TextInput, ActivityIndicator, ScrollView} from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import forgetImg from "../assets/Img/forgot1.png"
import { useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { QUERY_GET_EMAIL_VALIDATION } from '../GraphqlOperation/Query';
import { showMessage, hideMessage } from "react-native-flash-message";

export default function EmailValidationForgetPass({navigation}) {
const[email,setEmail] =useState('')

  // const{data,loading} =  useQuery(QUERY_GET_EMAIL_VALIDATION,{
  //   variables:{
  //     "email": `${email}`

  //   }
  // })

  const[getEmailvalidation,{data,loading}] =  useLazyQuery(QUERY_GET_EMAIL_VALIDATION)
  console.log("data",data)
  const handleClick =() =>{
    getEmailvalidation({
      variables:{
        "email": `${email}`
      }
    }).then(()=>{
      
    })
   
  }

  const[state,setState] =useState(false)

  if(data && data.getEmailvalidation !== null){
    navigation.navigate("NewPassword",{data:data})
  }
 



  return (
    <View style={{backgroundColor:"#fff",height:"100%"}}>
      <ScrollView>
        <TouchableOpacity onPress={()=>navigation.goBaCk()}>
     <Feather name="arrow-left" size={25} style={{marginTop:10,marginLeft:10,color:"#000"}} />
     </TouchableOpacity>
     <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <Text style={{color:"#000",fontSize:18,fontFamily:"Poppins-SemiBold"}}>Forgot Password</Text>
      <Image source={forgetImg} style={{width:260,height:250}} />
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20,width:"99%" }}>
        <View style={{width:"85%",marginBottom:10}}>
            <Text style={{color:"#000",fontFamily:"Poppins-SemiBold"}}>Email Id</Text>

        </View>
        <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
          <Feather name="mail" size={25} style={{ margin: 7, color: "#000" }} />
          <TextInput placeholder='Enter Email Id' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setEmail(e)} value={email} />
        </View>
      </View>
     </View>

     {
               data && data.getEmailvalidation === null ?
               <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:20}}>
                <Text style={{color:"red",fontFamily:"Poppins-SemiBold",fontSize:10}}>Please Enter Registered email address</Text>
                </View>

               :
               <></>



     }
     
     <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:20}}>

     <View style={{width:"90%"}}>
      {
         loading ?
         <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
         <ActivityIndicator size="small" color="#fff" />

         </View>

         :
         email === "" ?
         <View style={{width:"100%",backgroundColor:"#dfe6e9",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
         <Text  style={{color:"#000",fontFamily:"Poppins-SemiBold",fontSize:15}}>Reset Password</Text>
       </View>
         :
         <>
           <TouchableOpacity onPress={()=>handleClick()}>
        <View style={{width:"100%",backgroundColor:"#3498db",height:50,borderRadius:10,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <Text  style={{color:"#fff",fontFamily:"Poppins-SemiBold",fontSize:15}}>Reset Password</Text>
        </View>
        </TouchableOpacity>
         
         </>



      }
      

     </View>
    
     </View>
     </ScrollView>
    </View>
  )
}