import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import friendImg from "../assets/Img/Accept.png"
import { MUTATION_CANCEL_REQUEST_USER, MUTATION_CONFIRM_REQUEST_USER, MUTATION_CONFIRM_REQUEST_USER_ACTIVE } from '../GraphqlOperation/Mutation';

export default function FriendRquest({ navigation }) {

  const [userId, setUserId] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    },
    pollInterval: 500,
  })

  console.log("data", data)
  const [search, setSearch] = useState("pending")


  const [confirmSendRequestUser] = useMutation(MUTATION_CONFIRM_REQUEST_USER_ACTIVE, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })
  const [confirmRequestUser, { loading: loadingActive }] = useMutation(MUTATION_CONFIRM_REQUEST_USER, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })


  const [loadinId, setLoadingId] = useState()
  function handleConfirm(friendId, id) {
    setLoadingId(id)
    confirmRequestUser({
      variables: {
        "sendRequestFriendInput": {
          "friends": [
            {
              "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
              "churchName": `${data && data.getUserById.churchName}`,
              "contact": `${data && data.getUserById.contact}`,
              "email": `${data && data.getUserById.email}`,
              "firstName": `${data && data.getUserById.firstName}`,
              "friendsId": `${data && data.getUserById.id}`,
              "lastName": `${data && data.getUserById.lastName}`,
              "status": "active",
              "username": `${data && data.getUserById.username}`
            }
          ],
          "userId": `${friendId}`
        },
      }
    })


    confirmSendRequestUser({
      variables: {
        "userId": `${userId}`,
        "friendId": `${id}`,
        "status": "active",
      }

    })
  }

  const [cancelRequestUser, { laoding: CancelLoading }] = useMutation(MUTATION_CANCEL_REQUEST_USER, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })

  function handleCancel(friendId) {
    setLoadingId(friendId)
    cancelRequestUser({
      variables: {
        "userId": `${userId}`,
        "friendId": `${friendId}`
      }
    })

  }

  return (

    <View style={{ backgroundColor: "#fff", height: "90%" }}>
      <ScrollView>
        <Text style={{ marginLeft: 10, marginTop: 10, color: "gray" }}>({data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).length}) Requests</Text>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
         {
            data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).length === 0 ?
           <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:70}}>
          <Image source={friendImg}  style={{width:200,height:200}} />
           </View>
            :
            <>
               {
            data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).slice().reverse().map((item) => {

              return (
                <>
                  <Card style={{ width: "95%", marginTop: 20, borderRadius: 20, height: 80, marginBottom: 5 }}>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetail", { userId: item.friendsId })}>
                          <View style={{ flexDirection: "row" }}>
                            {
                              item.avatar === null ?
                                <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 15, marginLeft: 7 }} />
                                :
                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 15, marginLeft: 7 }} />
                            }
                            <View style={{ flexDirection: "column", marginLeft: 5, width: "35%" }}>
                              <Text style={{ marginTop: 20, fontWeight: "800", color: "#000" }} numberOfLines={1} ellipsizeMode='tail' >{item.firstName} {item.lastName} adsadsafsdf</Text>
                              <Text style={{ color: "gray", fontSize: 8 }}>request to follow you</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", marginRight: 50 }}>
                          <View style={{ marginRight: 15, marginTop: 28, marginLeft: 10 }}>
                            {
                              CancelLoading && item.id === loadinId ?
                                <ActivityIndicator color="#000" size="small" />
                                :
                                <TouchableOpacity onPress={() => handleCancel(item.id)}>
                                  <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>Delete</Text>
                                </TouchableOpacity>
                            }
                          </View>
                          {
                            loadingActive && item.id === loadinId ?
                              <View style={{ marginTop: 20, width: 90, height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                <ActivityIndicator color="#000" size="small" />
                              </View>

                              :
                              <TouchableOpacity onPress={() => handleConfirm(item.friendsId, item.id)}>
                                <View style={{ marginTop: 20, backgroundColor: "#3498db", width: 90, height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                  <Text style={{ color: "#fff" }}>confirm</Text>
                                </View>
                              </TouchableOpacity>
                          }
                        </View>
                      </View>
                    </View>
                  </Card>
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