import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useQuery } from '@apollo/client';
import { QUERY_CHAT_USER_BY_ID, QUERY_GET_ALL_USER } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import message from "../assets/Img/Messages-cuate.png"

export default function ChatUserList({ navigation }) {

    const [toggle, setToggle] = useState(false)

    const [userId, setUserId] = useState()

    useEffect(() => {
        AsyncStorage.getItem("userId").then((id) => setUserId(id))
    }, [])

    const { data, loading } = useQuery(QUERY_GET_ALL_USER)
    console.log("userId", userId)


    const [search, setSearch] = useState("")

    const { data: chatListData, loading: chatListLoading } = useQuery(QUERY_CHAT_USER_BY_ID, {
        pollInterval:300,
        variables: {
            "userId": `${userId}`
        },
    })

    console.log("chatListData", chatListData)


    return (
        <View style={{ backgroundColor: "#fff", height: "100%" }}>
            {
                chatListLoading ?
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center",marginTop:50 }}>
                        <ActivityIndicator color="#000" size="large" />
                        <Text style={{ color: "#000", fontSize: 10, fontFamily: "Poppins-SemiBold" }}>Please Wait Loading</Text>
                    </View>
                    :
                    <>
                        <ScrollView>
                            {
                                toggle === true ?
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                        <View style={{ width: "90%", flexDirection: "row", borderColor: "#000", borderWidth: 2, borderRadius: 10 }}>
                                            <Feather name="search" size={25} color="gray" style={{ marginTop: 10, marginLeft: 10 }} />
                                            <TextInput placeholder='Serach Here...' placeholderTextColor="#000" style={{ color: "#000", width: "70%" }} onChangeText={(e) => setSearch(e)} value={search} />
                                            <TouchableOpacity onPress={() => setToggle(false)}>
                                                <Feather name="x" size={25} color="gray" style={{ marginTop: 10, marginLeft: 10 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
                                        <View>
                                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                                <Feather name="chevron-left" style={{ marginLeft: 20, color: "#000" }} size={25} />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: "500", color: "#000" }}>Message</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => setToggle(true)}>
                                                <Feather name="search" style={{ color: "#000", marginRight: 20 }} size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            }

                            {
                                  chatListData && chatListData.getAllChatByUserId.length === 0 ?
                                 <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:100}}>
                                    <Image source={message}  style={{width:200,height:200}}/>

                                 </View>

                                  :
                                  <>
                                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20, }}>
                                {
                                    search === " " ?
                                        <>
                                            {
                                                chatListData && chatListData.getAllChatByUserId.filter((obj) => obj.userNameB.includes(search) || obj.userNameA.includes(search)).slice().reverse().map(item => {
                                                    return (
                                                        <>
                                                            {
                                                                item.userIdA === userId ?
                                                                    <Card style={{ width: "90%", borderRadius: 10, marginTop: 20, elevation: 5, marginBottom: 5 }}>
                                                                        <TouchableOpacity onPress={() => navigation.navigate("Chat", { userIdChat: item.userIdB, userFirst: item.userNameB, userAvatar: item.userProfileAvatarB })}>
                                                                            <View style={{ width: "100%" }}>
                                                                                <View style={{ flexDirection: "row" }}>
                                                                                    <View>
                                                                                        {
                                                                                            item.userProfileAvatarB === null ?
                                                                                                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />
                                                                                                :
                                                                                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.userProfileAvatarB}` }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />
                                                                                        }
                                                                                    </View>
                                                                                    <View style={{ flexDirection: "column" }}>
                                                                                        <Text style={{ marginTop: 15, marginLeft: 10, fontWeight: "700", color: "#000" }}>{item.userNameB}</Text>
                                                                                        <Text style={{ fontSize: 12, marginLeft: 10, color: "gray", width: 150 }} numberOfLines={1} >message </Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </Card>
                                                                    :
                                                                    item.userIdB === userId ?
                                                                        <Card style={{ width: "90%", borderRadius: 10, marginTop: 20, elevation: 5, marginBottom: 5 }}>
                                                                            <TouchableOpacity onPress={() => navigation.navigate("Chat", { userIdChat: item.userIdA, userFirst: item.userNameA, userAvatar: item.userProfileAvatarA })}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <View style={{ flexDirection: "row" }}>
                                                                                        <View>
                                                                                            {
                                                                                                item.userProfileAvatarA === null ?
                                                                                                    <Image source={{ uri: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-3.jpg" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />
                                                                                                    :
                                                                                                    <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.userProfileAvatarA}` }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />

                                                                                            }
                                                                                        </View>
                                                                                        <View style={{ flexDirection: "column" }}>
                                                                                            <Text style={{ marginTop: 15, marginLeft: 10, fontWeight: "700", color: "#000" }}>{item.userNameA}</Text>
                                                                                            <Text style={{ fontSize: 12, marginLeft: 10, color: "gray", width: 150 }} numberOfLines={1} >message </Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </Card>
                                                                        :
                                                                        <></>
                                                            }
                                                        </>
                                                    )
                                                })

                                            }
                                        </>
                                        :
                                        <>
                                            {
                                                chatListData && chatListData.getAllChatByUserId.filter((obj) => obj.userNameB.includes(search) || obj.userNameA.includes(search)).slice().reverse().map(item => {
                                                    return (
                                                        <>
                                                            {
                                                                item.userIdA === userId ?
                                                                    <Card style={{ width: "90%", borderRadius: 10, marginTop: 20, elevation: 5, marginBottom: 5 }}>
                                                                        <TouchableOpacity onPress={() => navigation.navigate("Chat", { userIdChat: item.userIdB, userFirst: item.userNameB, userAvatar: item.userProfileAvatarB })}>
                                                                            <View style={{ width: "100%" }}>
                                                                                <View style={{ flexDirection: "row" }}>
                                                                                    <View>
                                                                                        {
                                                                                            item.userProfileAvatarB === null ?
                                                                                                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />
                                                                                                :
                                                                                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.userProfileAvatarB}` }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />

                                                                                        }
                                                                                    </View>
                                                                                    <View style={{ flexDirection: "column" }}>
                                                                                        <Text style={{ marginTop: 15, marginLeft: 10, fontWeight: "700", color: "#000" }}>{item.userNameB}</Text>
                                                                                        <Text style={{ fontSize: 12, marginLeft: 10, color: "gray", width: 150 }} numberOfLines={1} >message </Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </Card>
                                                                    :
                                                                    item.userIdB === userId ?
                                                                        <Card style={{ width: "90%", borderRadius: 10, marginTop: 20, elevation: 5, marginBottom: 5 }}>
                                                                            <TouchableOpacity onPress={() => navigation.navigate("Chat", { userIdChat: item.userIdA, userFirst: item.userNameA, userAvatar: item.userProfileAvatarA })}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <View style={{ flexDirection: "row" }}>
                                                                                        <View>
                                                                                            {
                                                                                                item.userProfileAvatarA === null ?
                                                                                                    <Image source={{ uri: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-3.jpg" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />
                                                                                                    :
                                                                                                    <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.userProfileAvatarA}` }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderWidth: 1, borderColor: "#000" }} />

                                                                                            }
                                                                                        </View>
                                                                                        <View style={{ flexDirection: "column" }}>
                                                                                            <Text style={{ marginTop: 15, marginLeft: 10, fontWeight: "700", color: "#000" }}>{item.userNameA}</Text>
                                                                                            <Text style={{ fontSize: 12, marginLeft: 10, color: "gray", width: 150 }} numberOfLines={1} >message </Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </Card>
                                                                        :
                                                                        <></>

                                                            }

                                                        </>
                                                    )
                                                })

                                            }

                                        </>
                                }
                            </View>
                                  
                                  </>

                            }
                          
                        </ScrollView>
                    </>
            }
        </View>
    )
}