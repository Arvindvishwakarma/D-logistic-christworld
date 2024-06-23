import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { useMutation, useQuery } from '@apollo/client'
import { QUERY_GET_USER_BY_ID_NOTIFICATION } from '../GraphqlOperation/Query'
import { useEffect } from 'react'
import { useState,useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'react-moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import push from "../assets/Img/Push.gif"
import { MUTATION_DELETE_NOTIFITION, MUTATION_UPDATE_NOTIFICATION } from '../GraphqlOperation/Mutation'


export default function Activity({navigation}) {

  const [userId, setUserId] = useState()
  const refRBSheet = useRef();

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  console.log("userId", userId)


  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID_NOTIFICATION, {
    variables: {
      "userId": `${userId}`
    }
  })

  console.log("data", data)
  
  const[notificationId,setNotificationId] =useState();

  const[updateNotificationSend] = useMutation(MUTATION_UPDATE_NOTIFICATION,{
    refetchQueries:[
      QUERY_GET_USER_BY_ID_NOTIFICATION,
      "getNoticationByUserId"
    ]
  })

  const[deleteNotification] = useMutation(MUTATION_DELETE_NOTIFITION,{
    refetchQueries:[
      QUERY_GET_USER_BY_ID_NOTIFICATION,
      "getNoticationByUserId"
    ]
  })

    const handleNotification =(id) =>{
      refRBSheet.current.open()
      setNotificationId(id)
    }

 const handleNotificationNav=(postId,id)=>{
  updateNotificationSend({
    variables:{
      "updateNotificationInput": {
        "notificationId": `${id}`,
        "status": "active"
      }
    }
  })
  navigation.navigate("SinglePost",{postId:postId})
 }


    const handleDelete =() =>{
      deleteNotification({
        variables:{
          "notificationId": `${notificationId}`
        }
      })
      refRBSheet.current.close()
    }


console.log("data",data)

  return (
    <View style={{ backgroundColor: "#fff", height: "90%" }}>
      <ScrollView>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {
            data && data.getNoticationByUserId.length === 0 ?
            <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:100}}>
              <Image   source={push}  style={{width:200,height:200}}/>

            </View>

            :
            <>
              {
            loading ?
              <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size="large"  color="#000" />
                <Text style={{color:"#000",fontSize:10}}>Please Wait Loading</Text>
              </View>

              :
              <>
                {
                  data && data.getNoticationByUserId.slice().reverse().map(item => {
                    return (
                      <TouchableOpacity onPress={()=>handleNotificationNav(item.postId,item.id)}>
                      <View style={{ backgroundColor:item.status === "pending"? "rgba(202, 220, 243, 0.8)":"#fff", height: 75, width: "100%", marginTop: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ width: "95%", flexDirection: "row", height: 75, }}>
                          <View style={{ width: "17%", height: 75, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            {
                              item.avatar === null ?
                                <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 50, height: 50, borderRadius: 100, borderColor: "#000", borderWidth: 1 }} />
                                :
                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 50, height: 50, borderRadius: 100, borderColor: "#000", borderWidth: 1 }} />
                            }
                          </View>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "83%", height: 75 }}>
                            <View style={{ flexDirection: "column", height: 75, width: "80%" }}>
                              <View style={{ flexDirection: "row", }}>
                                <Text style={{ color: "#000", marginLeft: 5, fontFamily: "Poppins-SemiBold", marginTop: 12 }}>{item.userName}</Text>
                                {
                                  item.notificationType === "Comment" ?
                                    <Text style={{ color: "gray", marginTop: 16, marginLeft: 15, fontFamily: "Poppins-Medium", fontSize: 12 }}>Comment</Text>
                                    :
                                    <Text style={{ color: "gray", marginTop: 16, marginLeft: 15, fontFamily: "Poppins-Medium", fontSize: 12 }}>Like</Text>
                                }
                              </View>
                              <View>
                                {
                                  item.notificationType === "Comment" ?
                                    <Text style={{ fontSize: 11, marginLeft: 5, color: "#000", marginTop: -3 }} numberOfLines={1} >{item.title}   {item.titleCaption}</Text>
                                    :
                                    <Text style={{ fontSize: 11, marginLeft: 5, color: "#000", marginTop: -3 }} numberOfLines={1} >{item.titleCaption}</Text>
                                }
                                <Text style={{ fontSize: 9, marginLeft: 5, color: "gray" }}>Date <Moment element={Text} format='DD-MM-YYYY hh:mm:ss'>{item.createdDateTime}</Moment></Text>
                              </View>
                            </View>

                            <View style={{ height: 75, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <TouchableOpacity  onPress={()=>handleNotification(item.id)}>
                              <Feather name="more-vertical" size={23}  color="gray"/>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View>
                        </View>
                      </View>
                      </TouchableOpacity>
                    )
                  })
                }

              </>
          }
        
            
            </>
          }
          </View>
        
      </ScrollView>

      
      < RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={300}
        openDuration={250}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          container: {
            backgroundColor: "#ecf0f1",
            borderTopStartRadius: 50,
            borderTopRightRadius: 50
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
        

          <View style={{ flexDirection: "row", width: "90%", marginTop: 15 }}>
            <TouchableOpacity onPress={()=>handleDelete()}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Feather name="trash-2" size={20} color="#000" />
                <Text style={{ color: "#000", fontFamily: "Poppins-Medium", marginLeft: 10, fontSize: 16 }}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>



          {/* <View style={{width:"90%",borderBottomWidth:2,borderBottomColor:"#000"}}>
          <Text style={{fontFamily:"Poppins-SemiBold",color:"#000"}}>Edit Caption</Text>
         <TextInput
         multiline={true}
         numberOfLines={4}
         placeholder='Write Caption..'
         placeholderTextColor="gray"
          style={{color:"#000"}}
         onChangeText={(e)=>setCaption(e)}
        />
         </View>
         <View>

         </View> */}


        </View>
      </RBSheet >
    </View>
  )
}