import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { MUTATION_UPDATE_USER_PROFILE } from '../GraphqlOperation/Mutation';

export default function EditProfile({ navigation, route }) {

  const { userid } = route.params;
  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userid}`
    }
  })

  console.log("data", data)

  const [firstN, setFirstN] = useState(data && data.getUserById.firstName)
  const [lastN, setLastN] = useState(data && data.getUserById.lastName)
  const [bio, setBio] = useState(data && data.getUserById.bio)

  const [editUserProfile, { loading: updateLoading }] = useMutation(MUTATION_UPDATE_USER_PROFILE, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })


  function handleUpdate() {
    editUserProfile({
      variables: {
        "userEditProfileInput": {
          "userId": `${userid}`,
          "firstName": `${firstN}`,
          "lastName": `${lastN}`,
          "bio": `${bio}`
        }
      }
    }).then(() => {
      navigation.navigate("BottomNavigation")
    })

  }

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>

      <View style={{ backgroundColor: "#fff", height: 60, width: "100%", flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={20} color="#000" style={{ marginTop: 4, marginLeft: 5 }} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 13, fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#000" }}>Edit Profile</Text>
      </View>
      <Text style={{ marginLeft: 20, color: "grey" }}>* Indicater required</Text>
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
        <View style={{ width: "90%" }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", color: "#000" }}>* First Name</Text>
          <View style={{ borderBottomColor: "#000", borderBottomWidth: 2 }}>
            <TextInput placeholder='Enter First Name' placeholderTextColor="gray" style={{ color: "#000" }} onChangeText={(e) => setFirstN(e)} value={firstN} />
          </View>
        </View>

        <View style={{ width: "90%", marginTop: 10 }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", color: "#000" }}>* Last Name</Text>
          <View style={{ borderBottomColor: "#000", borderBottomWidth: 2 }}>
            <TextInput placeholder='Enter Last Name' placeholderTextColor="gray" style={{ color: "#000" }} onChangeText={(e) => setLastN(e)} value={lastN} />
          </View>
        </View>
        <View style={{ width: "90%", marginTop: 15 }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", color: "#000" }}>Bio</Text>
          <TextInput multiline={true}
            numberOfLines={4} placeholder='Enter here Bio ...' placeholderTextColor="gray" style={{ borderBottomColor: "#000", borderBottomWidth: 2, color: "#000" }} onChangeText={(e) => setBio(e)} value={bio} />
        </View>
      </View>
      <View style={{ position: "absolute", backgroundColor: "#fff", bottom: 0, width: "100%", height: 50 }}>
        <View style={{ width: "100%", height: 60, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", height: 50, backgroundColor: "#1e90ff", marginBottom: 20, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {
              updateLoading ?
                <ActivityIndicator color="#fff" size="large" />
                :
                <TouchableOpacity onPress={() => handleUpdate()}>
                  <View style={{ width: "100%", height: 50, backgroundColor: "#1e90ff", borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 19, fontFamily: "Poppins-SemiBold", color: "#fff" }}>Save</Text>
                  </View>
                </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    </View>
  )
}