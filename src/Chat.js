import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION_CHAT_UPDATE, MUTATION_CREATE_CHAT, MUTATION_CREATE_CONVERSATION, MUTATION_DELETE_CHAT, MUTATION_NOTIFICATION, MUTATION_UPDATE_CHAT_BY_ID } from '../GraphqlOperation/Mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUERY_GET_POST_BY_ID, QUERY_GET_USER_BY_ID, QUERY_GET_CHAT_BY_USER_ID_AND_SENDER_ID, QUERY_GET_CHAT_SEND_BY_SEND_TO } from '../GraphqlOperation/Query';
export default function ({ navigation, route }) {
  const { userIdChat, userFirst, userLast, userAvatar } = route.params;
  const [userId, setUserId] = useState()
  const [stop, setStop] = useState(false)
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  //query fetch user  by user id  
  const { data: userData, loading: userLoading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })


  const { data: userDataChat, loading: userLoadingChat } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userIdChat}`
    }
  })

  const[deviceToken ,setDeviceToken] =useState("")

  useEffect(()=>{
    setDeviceToken(userDataChat && userDataChat.getUserById.deviceToken)
  },[userDataChat])

 
  console.log("deviceToken",deviceToken)
  console.log("userDataChat",userDataChat)


  const [messages, setMessages] = useState([])

  //user all chat by Id both send and resiver
  const { data: userChatData, loading: userChatLoading } = useQuery(QUERY_GET_CHAT_SEND_BY_SEND_TO, {
    variables: {
      "userIdA": `${userId}`,
      "userIdB": `${userIdChat}`
    },
    pollInterval: 500
  })


   const[pushNotificationToAssignNewDbOrder] = useMutation(MUTATION_NOTIFICATION)

  const getUpdate = async () => {
    if (userChatData && userChatData.getChatBySendBySendTo === null) {
      setMessages(messages => [...messages, {
        sender: `${userId}`,
        message: "Say hi",
        time: '6:01 PM'
      }])

    }

  }

  //  fetch a data  store in state
  useEffect(() => {
    getUpdate()
  }, [userChatData])


  console.log("userChatData", userChatData)

  // const [messages, setMessages] = useState([

  //   { sender: `${userId}`, 
  //     message: 'Hey there!', 
  //     time: '6:01 PM' 
  //   },
  // ]);

  console.log("messages", messages)

  const [inputMessage, setInputMessage] = useState('');

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

  //concat first name and last name user 

  let firstName = userData && userData.getUserById.firstName;
  let lastName = userData && userData.getUserById.lastName;

  let fullName = firstName + " " + lastName
  console.log("fullName", fullName)


  let chatUserFullName = userFirst + " " + userLast
  console.log("chatUserFullName", chatUserFullName)


  //mutation first time message not exist user chat 

  const [createChat, { data: createData, loading: createLoading }] = useMutation(MUTATION_CREATE_CHAT, {
    refetchQueries: [
      QUERY_GET_CHAT_SEND_BY_SEND_TO,
      "getChatBySendBySendTo"
    ]
  })


  //first time message not exist user chat 

  function sendMessageUpdate() {
    let t = getTime(new Date());
    createChat({
      variables: {
        "chatInput": {
          "message": [
            {
              "createAt": `${t}`,
              "sentBy": `${userData && userData.getUserById.id}`,
              "sentTo": `${userIdChat}`,
              "status": "pending",
              "text": `${inputMessage}`,
              "userId": `${userData && userData.getUserById.id}`
            }
          ],
          "userIdA": `${userData && userData.getUserById.id}`,
          "userIdB": `${userIdChat}`,
          "userNameA": `${fullName}`,
          "userNameB": `${chatUserFullName}`,
          "userProfileAvatarA": userData && userData.getUserById.avatar === null ? null : `${userData && userData.getUserById.avatar}`,
          "userProfileAvatarB": userAvatar === null ? null : `${userAvatar}`
        }

      }
    })

    if(deviceToken === "") {
   
    }else{
      pushNotificationToAssignNewDbOrder({
        variables:{
          "deviceToken": `${deviceToken}`,
          "title": "message",
          "body": `${fullName} Send Message ${inputMessage}`
         
        }
        })
    }
  

  }


  // mutation second time user already exist user chat

  const [updateChatById, { loading: updateChatLoading }] = useMutation(MUTATION_UPDATE_CHAT_BY_ID, {
    refetchQueries: [
      QUERY_GET_CHAT_SEND_BY_SEND_TO,
      "getChatBySendBySendTo"
    ]
  })


  //second time user already exist user chat
  function sendMessage() {
    if (inputMessage === '') {
      return setInputMessage('');
    }
    let t = getTime(new Date());
    updateChatById({
      variables: {
        "updateChatInput": {
          "message": [
            {
              "createAt": `${t}`,
              "sentBy": `${userId}`,
              "sentTo": `${userIdChat}`,
              "status": "pending",
              "text": `${inputMessage}`,
              "userId": `${userId}`
            }
          ],
          "chatId": `${userChatData && userChatData.getChatBySendBySendTo.id}`
        },

      }

    })

   if(deviceToken === " "){
   
   }else{
    pushNotificationToAssignNewDbOrder({
      variables:{
        "deviceToken": `${deviceToken}`,
        "title": "message",
        "body": `${fullName} Send Message ${inputMessage}`
      }
      })
   }
  
  
  
    setInputMessage('');


  }

  console.log("messages", messages)

  const[showId,setShowId] = useState()
  const[show,setShow] =useState(false)

  const handleShow =(id)=>{
    setShowId(id)
    setShow(!show)
  }

  console.log("showId",showId)

  //Mutation delete one chat 
  const[deleteChat,{loading:deleteLoading}] = useMutation(MUTATION_DELETE_CHAT)


  //delete one chat 
  function handleDelete(){
    deleteChat({
      variables:{
        "chatId": `${userChatData && userChatData.getChatBySendBySendTo.id}`,
        "currentChatId": `${showId}`
      }

    })
  }



  return (
    <>
      {
        userChatLoading && loadingData ?
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" ,marginTop:50}}>
            <ActivityIndicator color="#000" size="large" />
            <Text style={{color:"#000",fontFamily:"Poppins-SemiBold",fontSize:12}}> Please wait loading</Text>
          </View>
          :
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", height: 80,width:"100%" }}>
             
                <View style={{ marginTop: 20,width:"10%" ,}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                  <View style={{width:"100%"}}>
                  <View style={{width:"100%"}}>
                  <Feather name="chevron-left" style={{ color: "#000", marginLeft: 10, marginTop: 10 }} size={25} />
                  </View>
                  </View>
                  </TouchableOpacity>
                </View>
             

              <View style={{ flexDirection: "row", marginTop: 15,width:"70%" ,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity onPress={()=>navigation.navigate("UserProfileDetail", { userId:userIdChat })}>
                <View style={{flexDirection:"row",width:"100%",justifyContent:"center",alignItems:"center"}}>
                {
                  userAvatar === null ?
                    <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 30, height: 30,  marginLeft: 10, borderRadius: 100, }} />
                    :
                    <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${userAvatar}` }} style={{ width: 30, height: 30, marginLeft: 10, borderRadius: 100, }} />
                }

                <Text style={{ fontWeight: "700", marginLeft: 10, fontWeight: "700", color: "#000" }}>{userFirst} {userLast}</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={{width:"10%",}}>
                {/* <Feather name="more-vertical" style={{ color: "#000", marginTop: 30, marginRight: 10 }} size={25} /> */}
              </View>
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                {
                  userChatData && userChatData.getChatBySendBySendTo === null ?
                    <FlatList
                      style={{ backgroundColor: '#f2f2ff' }}
                      inverted={true}
                      data={JSON.parse(JSON.stringify(messages)).reverse()}
                      renderItem={({ item }) => (
                        <TouchableWithoutFeedback>
                          <View style={{ marginTop: 6 }}>
                            <View
                              style={{
                                maxWidth: Dimensions.get('screen').width * 0.8,
                                backgroundColor: '#3a6ee8',
                                alignSelf:
                                  item.sender === userId
                                    ? 'flex-end'
                                    : 'flex-start',
                                marginHorizontal: 10,
                                padding: 10,
                                borderRadius: 8,
                                borderBottomLeftRadius:
                                  item.sender === userId ? 8 : 0,
                                borderBottomRightRadius:
                                  item.sender === userId ? 0 : 8,
                              }}
                            >
                              
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                }}>
                                {item.message}
                              </Text>
                              <Text
                                style={{
                                  color: '#dfe4ea',
                                  fontSize: 14,
                                  alignSelf: 'flex-end',
                                }}>
                                {item.time}
                              </Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    />
                    :
                    <FlatList
                      style={{ backgroundColor: '#f2f2ff' }}
                      inverted={true}
                      data={userChatData && userChatData.getChatBySendBySendTo.message.slice().reverse()}
                      renderItem={({ item }) => (
                        <TouchableWithoutFeedback>
                          <View style={{ marginTop: 6 }}>
                            {
                                  item.userId === userId  ?                                    
                                <TouchableOpacity onPress={()=>handleShow(item.id)}>
                                <View
                              style={{
                                maxWidth: Dimensions.get('screen').width * 0.8,
                                backgroundColor:  item.userId === userId ?'#5352ed': '#fff',
                                alignSelf:
                                  item.userId === userId
                                    ? 'flex-end'
                                    : 'flex-start',
                                marginHorizontal: 10,
                                padding: 10,
                                borderRadius: 8,
                                borderBottomLeftRadius:
                                  item.userId === userId ? 8 : 0,
                                borderBottomRightRadius:
                                  item.userId === userId ? 0 : 8,
                              }}
                            >
                              <Text
                                style={{
                                  color: item.userId === userId ?'#fff':"#000",
                                  fontSize: 13,
                                  fontFamily:"Poppins-Medium"
                                }}>
                                {item.text}
                              </Text>
                              <Text
                                style={{
                                  color: item.userId === userId ?'#dfe4ea':"#000",
                                  fontSize: 8,
                                  alignSelf: 'flex-end',
                                  fontFamily:"Poppins-Medium"
                                }}>
                                {item.createAt}
                              </Text>
                              {
                                     showId === item.id && show  ?
                                     
                                     <View style={{backgroundColor:"#fff",height:30,width:30,borderRadius:5,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                      {  
                                         deleteLoading ?
                                         <ActivityIndicator color="#000" size="small" />
                                         :
                                         <TouchableOpacity onPress={()=>handleDelete(item.id)}>
                                         <Feather name="trash-2"  size={15} style={{color:"#000"}}/>
                                       </TouchableOpacity>

                                      }
                                    
                                       </View>
                                     :
                                     <></>

                              }                          
                                   
                            </View>
                            </TouchableOpacity>
                           
                          
                        
                                  :
                                  <View
                              style={{
                                maxWidth: Dimensions.get('screen').width * 0.8,
                                backgroundColor:  item.userId === userId ?'#5352ed': '#fff',
                                alignSelf:
                                  item.userId === userId
                                    ? 'flex-end'
                                    : 'flex-start',
                                marginHorizontal: 10,
                                padding: 10,
                                borderRadius: 8,
                                borderBottomLeftRadius:
                                  item.userId === userId ? 8 : 0,
                                borderBottomRightRadius:
                                  item.userId === userId ? 0 : 8,
                              }}
                            >
                              <Text
                                style={{
                                  color: item.userId === userId ?'#fff':"#000",
                                  fontSize: 13,
                                  fontFamily:"Poppins-Medium"
                                }}>
                                {item.text}
                              </Text>
                              <Text
                                style={{
                                  color: item.userId === userId ?'#dfe4ea':"#000",
                                  fontSize: 8,
                                  alignSelf: 'flex-end',
                                  fontFamily:"Poppins-Medium"
                                }}>
                                {item.createAt}
                              </Text>
                              
                            
                               
                               
                            
                            
                            </View>
                           
                         
                            }
                           
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    />

                }
                <View style={{ paddingVertical: 10 }}>
                  <View style={styles.messageInputView}>
                    <TextInput
                      defaultValue={inputMessage}
                      style={styles.messageInput}
                      placeholder='Message'
                      placeholderTextColor="gray"
                      onChangeText={(text) => setInputMessage(text)}

                      onSubmitEditing={() => {
                        userChatData && userChatData.getChatBySendBySendTo === null ?
                          sendMessageUpdate()
                          :
                          sendMessage()
                      }}
                    />
                    {
                      userChatData && userChatData.getChatBySendBySendTo === null ?
                        <TouchableOpacity
                          style={styles.messageSendView}
                          onPress={() => {
                            sendMessageUpdate();

                          }}
                        >
                          <Feather name='send' type='material' style={{ color: "#000" }} size={20} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          style={styles.messageSendView}
                          onPress={() => {
                            sendMessage();
                          }}>
                          <Feather name='send' type='material' style={{ color: "#000" }} size={20} />
                        </TouchableOpacity>

                    }
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </>
      }

    </>
  )
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: { height: '100%', aspectRatio: 1, borderRadius: 100 },
  container: {
    flex: 1,
    backgroundColor: '#f2f2ff',
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    color:"#000"
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});