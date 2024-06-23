import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler, } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_ALL_USER, QUERY_GET_SEARCH_USER, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { MUTATION_CANCEL_REQUEST_USER, MUTATION_CONFIRM_REQUEST_USER, MUTATION_CREATE_POST_USER, MUTATION_NOTIFICATION, MUTATION_SEND_REQUEST } from '../GraphqlOperation/Mutation';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { identity4 } from 'react-native-redash';
import img from "../assets/Img/cuate.png"

export default function AddFriend({navigation}) {
  const { data, loading } = useQuery(QUERY_GET_ALL_USER)
  const [search, setSearch] = useState()
  const [userId, setUserId] = useState()
  const [loadingId, setLoadingId] = useState("")

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
      "getAllUsers",
      QUERY_GET_USER_BY_ID,
      
    ]
  })


  const[confirmRequestUser, { loading: loadingActive }] = useMutation(MUTATION_CONFIRM_REQUEST_USER,{
    refetchQueries:[
      QUERY_GET_ALL_USER,
      "getAllUsers",
      QUERY_GET_USER_BY_ID
    ]
  })



  const [cancelRequestUser, { loading: cancelLoading }] = useMutation(MUTATION_CANCEL_REQUEST_USER, {
    refetchQueries: [
      QUERY_GET_ALL_USER,
      "getAllUsers",
      QUERY_GET_USER_BY_ID
    ]
  })


   const[pushNotificationToAssignNewDbOrder] =  useMutation(MUTATION_NOTIFICATION)

   const first =useData && useData.getUserById.firstName;
   const last = useData && useData.getUserById.lastName;
   const fullName = first+" "+last;

  const handleSend = (id, username, firstName, lastName, church, contact, email, avatar,deviceToken) => {
    console.log()
    setLoadingId(id)
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
    })

    confirmRequestUser({
      variables: {
        "sendRequestFriendInput": {
          "friends": [
            {
              "avatar": avatar === null ? null : `${avatar}`,
              "churchName": `${church}`,
              "contact": `${contact}`,
              "email": `${email}`,
              "firstName": `${firstName}`,
              "friendsId": `${id}`,
              "lastName": `${lastName}`,
              "status": "request",
              "username": `${username}`
            }
          ],
          "userId": `${userId}`
        },
      }
    })
    pushNotificationToAssignNewDbOrder({
      variables:{
        "deviceToken": `${deviceToken}`,
        "title": "Friend Request",
        "body": `${fullName} Send You Friend Request`
      }
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

  console.log("dataSearch", dataSearch)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])



  return (
    <View style={{ backgroundColor: "#fff", height:"100%" }}>
    <ScrollView>
      <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between" }}>
        {
            useData && useData.getUserById.friends.length > 4?
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Feather name='arrow-left' style={{marginLeft:10,color:"#3498db"}}  size={22}/>
            </TouchableOpacity>
            :
            <>
            <View style={{marginLeft:20}}>
              <Text style={{color:"#3498db",fontFamily:"Poppins-SemiBold",marginRight:10}}>{ useData && useData.getUserById.friends.length}</Text>
            </View>
            </>

        }
      
       <View>
        <Text style={{color:"#3498db",fontFamily:"Poppins-SemiBold",marginRight:10}}>Add Friend(5)</Text>
       </View>
      </View>

      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        {
          loadingSearch ?
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
                  data && data.getAllUsers.map((item) => {
                    return (
                       <>
                   
                      {
                        useData && useData.getUserById.id === item.id ? 
                        <></>
                        :
                        <>
                         <Card style={{ width: "95%", elevation: 4, marginTop: 10, borderRadius: 10, marginBottom: 5, height: 80 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", height: "100%" }}>
                          <View style={{ width: "65%" }}>
                            <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetail", { userId: item.id })}>
                              <View style={{ flexDirection: "row", width: "100%" }}>
                                <View style={{ width: "36%" }}>
                                  <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderColor: "#000", borderWidth: 2 }} />
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
                                sendLoading && item.id === loadingId ?
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