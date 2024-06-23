import { View, Text, StatusBar, TouchableOpacity, ScrollView, TextInput, ActivityIndicator,Image } from 'react-native'
import React, { useState } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { useMutation } from '@apollo/client';
import christ from "../assets/Img/newlogo.jpeg"
import { showMessage, hideMessage } from "react-native-flash-message";
import { MUTATION_CREATE_USER } from '../GraphqlOperation/Mutation';
import DropDownPicker from 'react-native-dropdown-picker';


export default function Registration({ navigation }) {

  const [firstName, setfirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contact, setContact] = useState("")
  const [email, setEmail] = useState("")
  const [churchName, setChurchName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCon, setPasswordCon] = useState("")

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Male");
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ]);
  let controller;

  const [checkpass, setCheckPass] = useState(true)
  const [checkConpass, setCheckConpass] = useState(true)

  const [createUser, { loading, error }] = useMutation(MUTATION_CREATE_USER)

  console.log("error", error)

  const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

  const handleSubmit = () => {
    if (firstName === "" || lastName === "" || contact === "" || email === ""  || password === "" || passwordCon === "") {
      showMessage({
        message: "All Field is Required",
        backgroundColor: "red",
        type: "warning",
      });

    } else if (contact.length < 10 || contact.length > 10) {
      showMessage({
        message: "Mobile number is not correct",
        backgroundColor: "red",
        type: "warning",
      });
    } else if (!email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
      showMessage({
        message: "Email id is not correct",
        backgroundColor: "red",
        type: "warning",
      });
    } else if (password === passwordCon) {
      createUser({
        variables: {
          "userInput": {
            "contact": `${contact}`,
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "password": `${password}`,
            "email": `${email}`,
            
          }

        }

      }).then(() => {
        showMessage({
          message: "upload Successfully",
          backgroundColor: "green",
          type: "success",
        });
        navigation.navigate("Login");
      })


    } else {
      showMessage({
        message: "not match Confirm Password",
        backgroundColor: "red",
        type: "warning",
      });
    }




  }


  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={25} style={{ marginTop: 15, marginLeft: 10, color: "#000" }} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Image source={christ}  style={{width:80,height:80,borderRadius:100}}/>
          <Text style={{ fontSize: 18, color: "#000", fontFamily: "Poppins-SemiBold" }}>Sign Up</Text>
          <View style={{ width: "90%", marginTop: 10 }}>
            <Text style={{ color: "#000", fontFamily: "Poppins-Medium", fontSize: 13, textAlign: "center" }}>Please Enter Your Information Below In Order To Login To Your Account</Text>
          </View>
        </View>


        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="user" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Firstname' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setfirstName(e)} value={firstName} />
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="user" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Lastname' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setLastName(e)} value={lastName} />
          </View>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>

          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="phone" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Contact' keyboardType='numeric' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setContact(e)} value={contact} />
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="mail" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Email' style={{ color: "#000", width: "100%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" onChangeText={(e) => setEmail(e)} value={email} />
          </View>
        </View>

     

     
      



        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="lock" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Password' style={{ color: "#000", width: "73%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" secureTextEntry={checkpass} onChangeText={(e) => setPassword(e)} value={password} />

            {
              checkpass === true ?
                <TouchableOpacity onPress={() => setCheckPass(false)}>
                  <Feather name="eye" size={25} style={{  color: "#000",marginTop:12,marginLeft:5 }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setCheckPass(true)}>
                  <Feather name="eye-off" size={25} style={{  color: "#000",marginTop:12,marginLeft:5 }} />
                </TouchableOpacity>
            }
          </View>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "90%", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
            <Feather name="lock" size={25} style={{ margin: 7, color: "#000" }} />
            <TextInput placeholder='Enter Confirm Password' style={{ color: "#000", width: "73%", fontFamily: "Poppins-Medium" }} placeholderTextColor="gray" secureTextEntry={checkConpass} onChangeText={(e) => setPasswordCon(e)} value={passwordCon} />

            {
              checkConpass === true ?
                <TouchableOpacity onPress={() => setCheckConpass(false)}>
                  <Feather name="eye" size={25} style={{  color: "#000",marginTop:12,marginLeft:5 }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setCheckConpass(true)}>
                  <Feather name="eye-off" size={25} style={{  color: "#000",marginTop:12,marginLeft:5 }} />
                </TouchableOpacity>

            }
          </View>
        </View>
      
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 20 }}>
          {
            loading ?
              <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color="#000" size="large" />
              </View>

              :
              <>
                <View style={{ flexDirection: "row", width: "90%", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 50, backgroundColor: "#00a8ff" }}>
                  <View style={{ width: "100%" }}>
                    <TouchableOpacity onPress={() => handleSubmit()}>
                      <View style={{ width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 50 }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontFamily: "Poppins-SemiBold" }}>Sign Up</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
          }

  {
     error ?
<View style={{width:"100%",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:10}}>
            <View style={{marginBottom:20,width:"90%",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <Text style={{fontSize: 13, fontFamily: "Poppins-SemiMedium",color:"red"}}>this mobile number & email already exist</Text>
            </View>
            </View>
     :
  <>
  </>


  }
  
            

      

      
        </View>
      </ScrollView>
    </View>
  )
}