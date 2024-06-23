import { View, Text, ScrollView, TouchableOpacity, Image,ActivityIndicator } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import React ,{useState,useEffect}from 'react'
import { Card } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { MUTATION_CANCEL_REQUEST_USER, MUTATION_CONFIRM_REQUEST_USER, MUTATION_CONFIRM_REQUEST_USER_ACTIVE } from '../GraphqlOperation/Mutation';
import friendImg from "../assets/Img/FriendsSing.png"


export default function MyAllFriend({ navigation, route }) {


    const { friends } = route.params;

    const [userId, setUserId] = useState()

    const [loadinId, setLoadingId] = useState()

    useEffect(() => {
      AsyncStorage.getItem("userId").then(id => setUserId(id))
    }, [])
  
    console.log("friends", friends)

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

      const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
        variables: {
          "userId": `${userId}`
        }
      })


      console.log("data",data)

      const [search, setSearch] = useState("active")

    return (
        <View style={{ backgroundColor: "#fff", height: "100%" }}>
            <ScrollView>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" style={{ marginLeft: 12, color: "#3498db" }} size={25} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 18, color: "#3498db", fontFamily: "Poppins-SemiBold", marginTop: 5 }}>Friends ({data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).length})</Text>
                    </View>
                </View>
                {
                     data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).length === 0 ?
                     <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:100}}>
                        <Image source={friendImg} style={{width:180,height:180}} />
                        <Text style={{color:"gray",fontFamily:"Poppins-Medium"}}>No Friend Available</Text>

                     </View>

                     :
                     <>
                       <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    {
                        data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).map(item => {
                            return (
                                <Card style={{ width: "90%", elevation: 4, marginTop: 10, borderRadius: 10, marginBottom: 5 ,height:85}}>
                                    <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetail", { userId: item.friendsId })}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", }}>
                                            <View style={{ flexDirection: "row", width: "65%" }}>
                                                {
                                                    item.avatar === null ?
                                                        <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderColor: "#000", borderWidth: 2 }} />
                                                        :
                                                        <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 60, height: 60, borderRadius: 100, margin: 10, borderColor: "#000", borderWidth: 2 }} />
                                                }
                                                <View style={{ flexDirection: "column", width: 90 }}>
                                                    <Text numberOfLines={1} style={{ color: "#000", fontFamily: "Poppins-SemiBold", marginTop: 15 }} ellipsizeMode='tail'>{item.firstName} {item.lastName}  </Text>
                                                    <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium",color:"gray" }}>Occuption</Text>
                                                    <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium" ,color:"gray"}}>Private</Text>
                                                </View>
                                            </View>
                                            <View style={{width:"35%",}}>
                                                {
                                                      item.id === loadinId || CancelLoading ?
                                                      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"}}>
                                                    <ActivityIndicator  size="small" color="#000"  />
                                                      </View>
                                                      :
                                                <TouchableOpacity onPress={() => handleCancel(item.id)}>
                                                    <View style={{ backgroundColor: "#00a8ff", padding: 10, height: 35, marginTop: 21, marginRight: 10, borderRadius: 10, width: 100, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Poppins-SemiBold" }}>Cancel</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            )
                        })
                    }
                </View>
                     </>


                }

              
            </ScrollView>
        </View>
    )
}