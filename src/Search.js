import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_ALL_USER, QUERY_GET_SEARCH_USER, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { MUTATION_CANCEL_REQUEST_USER, MUTATION_CREATE_POST_USER, MUTATION_NOTIFICATION, MUTATION_SEND_REQUEST } from '../GraphqlOperation/Mutation';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { identity4 } from 'react-native-redash';
import img from "../assets/Img/cuate.png"


export default function Search({ navigation }) {


  const { data, loading } = useQuery(QUERY_GET_ALL_USER)
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState()
  const [loadingId, setLoadingId] = useState("")
 

  console.log("search",search)

  console.log("data",data)

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])


  const { data: useData, loading: userLoading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  console.log("useData", useData)



  console.log("data", data)

  const [sendRequestUser, { loading: sendLoading }] = useMutation(MUTATION_SEND_REQUEST, {
    refetchQueries: [
      QUERY_GET_ALL_USER,
      "getAllUsers"
    ]
  })



  const [cancelRequestUser, { loading: cancelLoading }] = useMutation(MUTATION_CANCEL_REQUEST_USER, {
    refetchQueries: [
      QUERY_GET_ALL_USER,
      "getAllUsers"
    ]
  })

  const[state,setState] =useState(false)


   const[pushNotificationToAssignNewDbOrder] =  useMutation(MUTATION_NOTIFICATION)

   const first =useData && useData.getUserById.firstName;
   const last = useData && useData.getUserById.lastName;
   const fullName = first+" "+last;

  const handleSend = (id, username, firstName, lastName, church, contact, email, avatar,deviceToken) => {
    setLoadingId(id)
    setState(true)
    sendRequestUser({
      variables: {
        // "sendRequestFriendInput": {
        //   "userId": `${id}`,
        //   "friends": [
        //     {
        //       "avatar": `${useData && useData.getUserById.avatar}`,
        //       "churchName": `${useData && useData.getUserById.churchName}`,
        //       "contact": `${useData && useData.getUserById.contact}`,
        //       "email": `${useData && useData.getUserById.email}`,
        //       "firstName": `${useData && useData.getUserById.firstName}`,
        //       "friendsId": `${userId}`,
        //       "lastName": `${useData && useData.getUserById.lastName}`,
        //       "username": `${useData && useData.getUserById.userType}`,
        //       "status": "pending"
        //     }
        //   ],

        // }
        "sendRequestFriendInput": {
          "friends": [
            {
              "avatar": useData && useData.getUserById.avatar === null ? null : `${useData && useData.getUserById.avatar}`,
              "churchName": `${useData && useData.getUserById.churchName}`,
              "email": `${useData && useData.getUserById.email}`,
              "contact": `${useData && useData.getUserById.contact}`,
              "firstName": `${useData && useData.getUserById.firstName}`,
              "friendsId": `${useData && useData.getUserById.id}`,
              "lastName": `${useData && useData.getUserById.lastName}`,
              "status": "pending",
              "username": `${useData && useData.getUserById.username}`
            }
          ],
          "userId": `${id}`
        },
      }
    }).then(()=>{
      setState(false)
      pushNotificationToAssignNewDbOrder({
        variables:{
          "deviceToken": `${deviceToken}`,
          "title": "Friend Request",
          "body": `${fullName} Send You Friend Request`
        }
      })
    })
    



  }



  function handleCancel(id, itemData) {
    const userfilter = itemData.friends.filter(uId => {
      return uId.friendsId === userId
    })
    setLoadingId(id)
    console.log("id", id)
    console.log("friendId", userfilter[0].id)

    cancelRequestUser({
      variables: {
        "userId": `${id}`,
        "friendId": `${userfilter[0].id}`
      }

    })
  }


  const [getAllSearch, { data: dataSearch, loading: loadingSearch }] = useLazyQuery(QUERY_GET_SEARCH_USER)
  function handleSearch() {
    getAllSearch({
      variables: {
        "userName":   `${search}`
      }
    })

  }

  // console.log("dataSearch", dataSearch)





  return (
    <View style={{ backgroundColor: "#fff", height: "91%" }}>
      <ScrollView>
        <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between" }}>
          <View style={{ width: "80%", flexDirection: "row", borderWidth: 2, borderColor: "#000", borderRadius: 10, marginLeft: 10 }}>
            <TextInput placeholder='Search...' style={{ color: "#000", paddingLeft: 10, fontFamily: "Poppins-Medium", width: "100%" }} placeholderTextColor="#000" onChangeText={(e) => setSearch(e)} />
          </View>
          <View style={{ width: "15%", height: 55, backgroundColor: "#0097e6", marginRight: 5, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
            <View style={{ width: "100%" }}>
              <TouchableOpacity  onPress={()=>handleSearch()}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <Feather name="search" size={20} style={{ margin: 8, color: "#fff" }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            {
              loading ?
                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <ActivityIndicator color="#000" size="large" />
                  <Text style={{ fontFamily: "Poppins-SemiBold", color: "gray" }}>Please wait loading</Text>
                </View>
                :
                dataSearch && dataSearch.getAllSearch.length === 0 ?
                  <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <Image source={img} style={{ width: 150, height: 150 }} />
                    <Text style={{ color: "gray", fontFamily: "Poppins-SemiBold" }}>User Not Found !!!</Text>
                  </View>
                  :
                  <>
                    {
                      dataSearch && dataSearch.getAllSearch.slice().reverse().map((item) => {
                        return (
                            <>
                            {
                                 userId === item.id  ?
                                 <></>
                                 :
                                 <>
                                     <Card style={{ width: "95%", elevation: 4, marginTop: 10, borderRadius: 10, marginBottom: 5, height: 80 }}>
  
  <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", height: "100%" }}>
    <View style={{ width: "65%" }}>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetail", { userId: item.id })}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "36%" }}>
            {
                    item.avatar === null ?
                    <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderColor: "#000", borderWidth: 2 }} />
                    :
                    <Image source={{  uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}`  }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderColor: "#000", borderWidth: 2 }} />
            }
           
          </View>
          <View style={{ flexDirection: "column", width: "60%" }}>
            <Text style={{ color: "#000", fontFamily: "Poppins-SemiBold", marginTop: 15 }} numberOfLines={1}>{item.firstName} {item.lastName}</Text>
            <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium" }} numberOfLines={1}>Occuption</Text>
            <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium" }} numberOfLines={1}>Private</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
    <View style={{ width: "35%", height: "100%" }}>
      {
        cancelLoading && item.id === loadingId ?
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <ActivityIndicator color="#000" size="small" />
          </View>
          :
          state && item.id === loadingId ?
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <ActivityIndicator color="#000" size="small" />
            </View>
            :
            <>
              {
                item.friends.some(obj => obj.friendsId === userId) ?
                  <TouchableOpacity onPress={() => handleCancel(item.id, item)}>
                    <View style={{ backgroundColor: "#00a8ff", padding: 10, height: 35, marginTop: 21, marginRight: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Poppins-SemiBold" }}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  :

                  <TouchableOpacity onPress={() => handleSend(item.id, item.username, item.firstName, item.lastName, item.churchName, item.contact, item.email, item.avatar,item.deviceToken)}>
                    <View style={{ backgroundColor: "#00a8ff", padding: 10, height: 35, marginTop: 21, marginRight: 10, borderRadius: 10 }}>
                      <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Poppins-SemiBold" }}>Send Request</Text>
                    </View>
                  </TouchableOpacity>
              }
            </>
      }
    </View>
  </View>
</Card>
                                 
                                 </>



                            }

                      
                          </>
                        )
  
                      })
                    }
  
                  </>
            }
          </View>
      </ScrollView>
    </View>
  )
}