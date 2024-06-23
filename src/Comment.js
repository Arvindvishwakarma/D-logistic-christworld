import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION_COMMET_USER, MUTATION_CREATE_NOTIFICATION } from '../GraphqlOperation/Mutation';
import { QUERY_ALL_POST, QUERY_GET_POST_BY_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'react-moment';
import status from "../assets/Img/Statusbro.png"
export default function Comment({ navigation, route }) {


  const { comment, postId, avatarData, fistNm, lastNm, captionData } = route.params;

    const[createNotifaction] = useMutation(MUTATION_CREATE_NOTIFICATION)

  console.log("captionData", captionData)

  const { data: dataComment, loading: loadingComment } = useQuery(QUERY_GET_POST_BY_ID, {
    variables: {
      "postId": `${postId}`
    }
  })

  console.log("dataComment", dataComment)

  const currentUser = "Lorem Ipsum "


  const [userId, setUserId] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  })

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })


  console.log("data", data)

  const [inputComment, setInputComment] = useState('');

  console.log("comment", comment)


  function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const [createCommentPost, { data: Datacomment, loading: commentLoading }] = useMutation(MUTATION_COMMET_USER, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost",
      QUERY_GET_POST_BY_ID,
      "getPostById"

    ]
  })

  const firstName = data && data.getUserById.firstName;
  const lastName = data && data.getUserById.lastName

  const fullName = firstName +" "+lastName

  function sendMessage() {
    createCommentPost({
      variables: {
        "userPostCommentInput": {
          "postId": `${postId}`,
          "postComment": [
            {
              "userId": `${data && data.getUserById.id}`,
              "firstName": `${data && data.getUserById.firstName}`,
              "lastName": `${data && data.getUserById.lastName}`,
              "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
              "comment": `${inputComment}`,
              "createdDateTime": "afsdsaf",
              "status": "pending"
            }
          ]
        }
      }
    })

    if(dataComment && dataComment.getPostById.userId === userId){

    }else{
      createNotifaction({
        variables:{
          "notificationSendInput": {
            "avatar": data && data.getUserById.avatar === null ? null  :`${data && data.getUserById.avatar}`,
            "notificationType": "Comment",
            "postId":`${postId}`,
            "userName": `${fullName}`,
            "notifyUserId": `${userId}`,
            "title": "Comment on Your Post",
            "titleCaption": `${inputComment}`,
            "userId": `${dataComment && dataComment.getPostById.userId}`
          }
        }
      })
    }
    setInputComment('');
  }


  return (
    <>
      <View style={{ backgroundColor: "#fff", height: "91%" }}>
        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View>
                <Feather name="chevron-left" style={{ marginLeft: 10 }} size={25} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ color: "#000", marginTop: 5, fontWeight: "800", fontSize: 16 }}>{data && data.getUserById.firstName} Post Comments</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View>
                <Feather name="x" style={{ marginRight: 10, color: "#000" }} size={25} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 10, marginLeft: 10, color: "gray" }}>comment ({dataComment && dataComment.getPostById.comment.length})</Text>
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <View style={{ width: "90%", flexDirection: "row", marginBottom: 2, }}>
              <View style={{ flexDirection: "row" }}>
                <View>
                  {
                   avatarData === null ?
                      <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 60, height: 60, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 ,marginBottom:10}} />
                      :
                      <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${avatarData}` }} style={{ width: 60, height: 60, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 ,marginBottom:10}} />
                  }

                </View>
                <View style={{ width: "80%", marginLeft: 10, marginTop: 10 }}>
                  <Text style={{ color: "#000", marginTop: 5, fontWeight: "700" }}>{fistNm} {lastNm}  </Text>
                  {
                    captionData === "undefined" || captionData === null || captionData === ""  ?
                      <></>
                      :
                      <Text style={{ width: "80%", color: "#000", fontSize: 13, marginBottom: 10 }}>{captionData}</Text>
                  }
                  <Text style={{ width: "80%", color: "#000", fontSize: 11, marginBottom: 10 }}>Create Date: <Moment element={Text} format='DD-MM-YYYY hh:mm:ss'>{dataComment && dataComment.getPostById.createdDateTime}</Moment></Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: "gray", width: "100%", height: 1, marginTop: 2, marginBottom: 2 }}></View>
          </View>
          {
              dataComment && dataComment.getPostById.comment.length === 0 ?
              <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:100}}>
                <Image source={status} style={{width:150,height:150}} />
                <Text style={{color:"gray",fontFamily:"Poppins-SemiBold"}}>Be the first to comment</Text>
                

              </View>

              :
              <>
                {
            loadingComment ?
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color="#000" size="small" />
              </View>
              :
              <>
                {
                  dataComment && dataComment.getPostById.comment.slice().reverse().map(item => {
                    return (
                      <View style={{ width: "90%", marginTop: 10, marginBottom: 5 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                          <View style={{ flexDirection: "row" }}>
                            {
                              item.avatar === null ?
                                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />
                                :
                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />

                            }
                          </View>
                          <View style={{ marginLeft: 10, width: "80%", backgroundColor: "#ecf0f1", marginTop: 12, borderRadius: 10 }}>
                            <Text style={{ marginTop: 15, fontWeight: "700", color: "#000", marginLeft: 10 }}>{item.firstName} {item.lastName}</Text>
                            <Text style={{ width: "70%", color: "#000", fontSize: 12, marginLeft: 10, marginBottom: 10 }}>{item.comment}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })
                }
              </>
          }
              </>

          }
        
        </ScrollView>
      </View>
      <View style={{ width: "100%", height: 60, backgroundColor: "#fff", position: "absolute", bottom: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#000", marginLeft: 10, marginRight: 10, borderRadius: 10 }}>

          <View style={{ width: "10%" }}>
            {
              data && data.getUserById.avatar === null ?
                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 35, height: 35, borderRadius: 50, marginTop: 7, marginLeft: 2, marginRight: 5 }} />
                :
                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${data && data.getUserById.avatar}` }} style={{ width: 35, height: 35, borderRadius: 50, marginTop: 7, marginLeft: 2, marginRight: 5 }} />
            }
          </View>
          
          <View style={{ width: "70%" }}>
            <TextInput placeholder='What Your Comment' onChangeText={(e) => setInputComment(e)} value={inputComment} style={{ color: "#000" }} placeholderTextColor="gray" />
          </View>
          <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            {
              commentLoading ?
                <ActivityIndicator color="#000" size="small" />
                :
                <TouchableOpacity onPress={() => sendMessage()}>
                  <View style={{ width: 50, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", height: 40, marginTop: 5, borderRadius: 10 }}>
                    <Feather name="send" size={20} color="#000" />
                  </View>
                </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    </>
  )
}