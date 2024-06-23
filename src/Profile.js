import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useRef, useContext } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FbGrid from "react-native-fb-image-grid";
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_GET_POST_BY_USER_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './context/Authcontext';
import ImagePicker from 'react-native-image-crop-picker';
import { decode } from "base64-arraybuffer";
import fs from "react-native-fs";
import Modal from "react-native-modal";
import blank from "../assets/Img/Blank.png"
import { MUTATION_UPDATE_USER_PROFILE } from '../GraphqlOperation/Mutation';
import { showMessage } from 'react-native-flash-message';
import Video from 'react-native-video';



export default function Profile({ navigation }) {


  const [userId, setUserId] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])


  const [isModalVisible, setModalVisible] = useState(false);
  const [getImage, setGetImage] = useState()

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { data: dataPost, loading: loadingPost } = useQuery(QUERY_GET_POST_BY_USER_ID, {
    variables: {
      "userId": `${userId}`
    },
    pollInterval: 500,

  })

  console.log("dataPost",dataPost)

  const [editUserProfile,{loading:profileImgLoading}] = useMutation(MUTATION_UPDATE_USER_PROFILE, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })

  const [profileImg, setProfileImg] = useState('')
  const handleProfilePick = async() => {
    ImagePicker.openPicker({
      width: 320,
      height: 350,
      cropping: true
    }).then(async(image) => {
      console.log(image);
      setProfileImg(image.path)
      // function call
      var S3 = require("aws-sdk/clients/s3");
    const BUCKET_NAME = "byaahlagan-profile-image";
    const IAM_USER_KEY = "AKIA6GB4RFKTDTDA6E2O";
    const IAM_USER_SECRET = "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";

    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    const uniqueName = result + ".jpg"

    const s3bucket = new S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
      signatureVersion: "v4"
    });

    let contentType = "image/jpeg";
    let contentDeposition = 'inline;filename="' + image.path + '"';
    const fPath = image.path;

    const base64 = await fs.readFile(fPath, "base64");
    const arrayBuffer = decode(base64);

    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: uniqueName,
        Body: arrayBuffer,
        ContentDisposition: contentDeposition,
        ContentType: contentType
      };
      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log("error in callback");
        } else {
          editUserProfile({
            variables: {
              "userEditProfileInput": {
                "avatar": `${uniqueName}`,
                "userId": `${userId}`
              }
            }
          })
          showMessage({
            message: "Upload Successfully Please Wait",
            type: "success",
          });

        }
      })
    });

    });
  }

  const handleProfileUpload = async () => {
    var S3 = require("aws-sdk/clients/s3");
    const BUCKET_NAME = "byaahlagan-profile-image";
    const IAM_USER_KEY = "AKIA6GB4RFKTDTDA6E2O";
    const IAM_USER_SECRET = "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";

    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    const uniqueName = result + ".jpg"

    const s3bucket = new S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
      signatureVersion: "v4"
    });

    let contentType = "image/jpeg";
    let contentDeposition = 'inline;filename="' + profileImg + '"';
    const fPath = profileImg;

    const base64 = await fs.readFile(fPath, "base64");
    const arrayBuffer = decode(base64);

    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: uniqueName,
        Body: arrayBuffer,
        ContentDisposition: contentDeposition,
        ContentType: contentType
      };
      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log("error in callback");
        } else {
          editUserProfile({
            variables: {
              "userEditProfileInput": {
                "avatar": `${uniqueName}`,
                "userId": `${userId}`
              }
            }
          })
          showMessage({
            message: "Upload Successfully Please Wait",
            type: "success",
          });

        }
      })
    });
  }

  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })


  console.log("data", data)

  const [screenType, setScreenType] = useState('content');
  const onSeek = (seek) => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = (playerState) => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = (data) => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };



  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == 'content') setScreenType('cover');
    else setScreenType('content');
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = (currentTime) => setCurrentTime(currentTime);
  const onPress = (url, index, event) => {
    setGetImage(url)
    toggleModal()

  }

  const { logOut } = useContext(AuthContext)
  const [search, setSearch] = useState("active")
  const [coverImg, setCoverImg] = useState("")

  
  const handleCoverBg = () => {
    ImagePicker.openPicker({
      width: 480,
      height: 200,
      cropping: true
    }).then(async(image) => {
      console.log(image);
      setCoverImg(image.path)
      // function call
      // handleCoverPicUpload()
      var S3 = require("aws-sdk/clients/s3");
      const BUCKET_NAME = "byaahlagan-profile-image";
      const IAM_USER_KEY = "AKIA6GB4RFKTDTDA6E2O";
      const IAM_USER_SECRET = "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";
  
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 5; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      const uniqueName = result + ".jpg"
  
      const s3bucket = new S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
        signatureVersion: "v4"
      });
  
      let contentType = "image/jpeg";
      let contentDeposition = 'inline;filename="' + image.path + '"';
      const fPath = image.path;
  
      const base64 = await fs.readFile(fPath, "base64");
      const arrayBuffer = decode(base64);
  
      s3bucket.createBucket(() => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: uniqueName,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType
        };
        s3bucket.upload(params, (err, data) => {
          if (err) {
            console.log("error in callback");
          } else {
            editUserProfile({
              variables: {
                "userEditProfileInput": {
                  "coverPic": `${uniqueName}`,
                  "userId": `${userId}`
                }
              }
            })
            showMessage({
              message: "Upload Successfully Please Wait",
              type: "success",
            });
  
          }
        })
      });
    });
  }

  const handleCoverPicUpload = async () => {
    var S3 = require("aws-sdk/clients/s3");
    const BUCKET_NAME = "byaahlagan-profile-image";
    const IAM_USER_KEY = "AKIA6GB4RFKTDTDA6E2O";
    const IAM_USER_SECRET = "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";

    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    const uniqueName = result + ".jpg"

    const s3bucket = new S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
      signatureVersion: "v4"
    });

    let contentType = "image/jpeg";
    let contentDeposition = 'inline;filename="' + coverImg + '"';
    const fPath = coverImg;

    const base64 = await fs.readFile(fPath, "base64");
    const arrayBuffer = decode(base64);

    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: uniqueName,
        Body: arrayBuffer,
        ContentDisposition: contentDeposition,
        ContentType: contentType
      };
      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log("error in callback");
        } else {
          editUserProfile({
            variables: {
              "userEditProfileInput": {
                "coverPic": `${uniqueName}`,
                "userId": `${userId}`
              }
            }
          })
          showMessage({
            message: "Upload Successfully Please Wait",
            type: "success",
          });

        }
      })
    });
  }
  console.log("dataPost", dataPost)
  let numColumns = 3;



  return (
    <View style={{ backgroundColor: "#fff", height: "91%" }}>
      {
        loading ?
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 100 }}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ color: "#000",fontSize:10 }}>Please Wait Loading</Text>
          </View>
          :
          <View>
            <ScrollView>
              <View>
                <View style={{ width: "100%", height: 150 }}>
                  {
                    data && data.getUserById.coverPic === null ?
                      <Image source={{ uri: "https://i.pinimg.com/originals/bc/b4/5f/bcb45f1a18be7f17c9d13d81878f72ef.jpg" }} style={{ width: "100%", height: 150, borderRadius: 10 }} />
                      :
                      <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${data && data.getUserById.coverPic}` }} style={{ width: "100%", height: 150 }} />
                  }
                  <View style={{ position: "absolute", bottom: 0 }}>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                      <TouchableOpacity onPress={() => handleCoverBg()}>
                        <View style={{ width: 30, height: 30, backgroundColor: "#fff", marginBottom: 10, borderRadius: 5, marginRight: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                          <Feather name="edit" color="#000" size={20} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ width: "100%", position: "absolute", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <View style={{ backgroundColor: "#fff", height: 120, width: 120, marginTop: 90, borderRadius: 100, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {
                      data && data.getUserById.avatar === null ?
                        <TouchableOpacity onPress={() => handleProfilePick()}>
                          <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} style={{ height: 110, width: 110, borderRadius: 100, backgroundColor: "#fff" }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => handleProfilePick()}>
                          <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${data && data.getUserById.avatar}` }} style={{ height: 110, width: 110, borderRadius: 100, backgroundColor: "#fff" }} />
                        </TouchableOpacity>
                    }
                    <View style={{ position: "absolute", bottom: 0 }}>
                      <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={{ width: 20, height: 20, marginBottom: 10, borderRadius: 20, marginRight: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                          <TouchableOpacity>
                            <Feather name="plus-circle" color="#000" size={16} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 60 }}>
                <Text style={{ fontSize: 20, fontWeight: "600", color: "#000", fontFamily: "Poppins-SemiBold" }}>{data && data.getUserById.firstName} {data && data.getUserById.lastName}</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "gray", fontFamily: "Poppins-Medium" }}>@{data && data.getUserById.username}</Text>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {
                  data && data.getUserById.bio === null ?
                    <></>
                    :
                    <View style={{ backgroundColor: "#ecf0f1", width: "80%", borderRadius: 10, marginTop: 10 }}>
                      <Text style={{ padding: 7, color: "#000", fontSize: 12, fontFamily: "Poppins-Medium", textAlign: "center" }}>{data && data.getUserById.bio}</Text>
                    </View>
                }

                {
                  profileImgLoading ?
                  <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#2980b9", fontFamily: "Poppins-Medium" }}>Loading...</Text>
                </View>
                  :
                  <></>
                }
           

                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                  <View style={{ width: "20%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("UserPost", { userPostData: dataPost })}>
                      <View style={{ width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#000", fontSize: 18, fontFamily: "Poppins-SemiBold" }}>{dataPost && dataPost.getPostByUserId.length}</Text>
                        <Text style={{ color: "#000", fontSize: 12, fontFamily: "Poppins-Medium" }}>Posts</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "20%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("UserGallery", { userPostData: dataPost })}>
                      <View style={{ width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                       
                                <Text style={{ color: "#000", fontSize: 18, fontFamily: "Poppins-SemiBold" }}>{dataPost && dataPost.getPostByUserId.filter((getAllPost)=>getAllPost.fileDetails.length !== 0).length}</Text>

                       
                        <Text style={{ color: "#000", fontSize: 12, fontFamily: "Poppins-Medium" }}>Photos</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "20%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("MyAllFriend", { friends: data && data.getUserById.friends })}>
                      <View style={{ width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#000", fontSize: 18, fontFamily: "Poppins-SemiBold" }}>{data && data.getUserById.friends.filter((getAllUsers) => getAllUsers.status.includes(search)).length}</Text>
                        <Text style={{ color: "#000", fontSize: 12, fontFamily: "Poppins-Medium" }}>Friends</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                  <View style={{ width: "60%", borderWidth: 1, borderColor: "#000", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("EditProfile", { userid: data && data.getUserById.id })}>
                      <View style={{ flexDirection: "row", width: "100%" }}>
                        <Text style={{ padding: 10, color: "#000", fontFamily: "Poppins-SemiBold" }}>Edit Profile</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "20%", borderWidth: 1, borderColor: "#000", borderRadius: 10, alignItems: "center", justifyContent: "center" }}  >
                    <Feather name="settings" size={25} style={{ color: "#000" }} onPress={() => navigation.navigate("Setting")} />
                  </View>
                </View>
              </View>

              {
                dataPost && dataPost.getPostByUserId.length === 0?
                <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:30}}>
                  <Image source={blank} style={{width:200,height:180}} />
     
                </View>

                :
                <>
                <Text style={{ marginLeft: 10, marginTop: 10, color: "#000", fontFamily: "Poppins-Medium" }}>Photos</Text>
                 <View>
                {
                  loadingPost ?
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <ActivityIndicator size="large" color="#000" />
                    </View>
                    :
                    <FlatList
                      data={dataPost && dataPost.getPostByUserId}
                      renderItem={({ item }) => (
                        <>
                          {
                             item.fileDetails.length === 0 ?
                             <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:30,width:"100%"}}>
                             <Image source={blank} style={{width:200,height:180}} />
                
                           </View>
                             :
                             <>
                             <View style={{ width: "30%", backgroundColor: "#000", marginLeft: 10, height: 100, marginTop: 10 }}>
                              <TouchableOpacity onPress={() => navigation.navigate("UserPost", { userPostData: dataPost })} >
                            <View style={{ width: "100%", height: "100%" }}>
                              {
                                item.fileDetails[0].filetype === "image" ?
                                  <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}` }} style={{ width: "100%", height: 100 }} />
                                  :
                                  <View>
                                    <Video
                                      source={{
                                        uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`
                                      }}
                                      // }}
                                      // source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                      style={{
                                        aspectRatio: 1,
                                        width: "100%"
                                      }}
                                      paused={true}
                                      onFullScreen="content"
                                      resizeMode='cover' />
                                    <View style={{ position: "absolute", height: "100%", width: "100%" }}>
                                      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                        <AntDesign name="caretright" color="#fff" size={15} style={{ marginRight: 5, marginTop: 5 }} />
                                      </View>
                                    </View>
                                  </View>
                              }
                            </View>
                          </TouchableOpacity>
                          </View>
                             </>
                          }
                         </>
                       
                      )}
                      //Setting the number of column
                      numColumns={numColumns}
                      keyExtractor={(item) => item.id}
                    />
                }
              </View>
                
                </>


              }




              
             
            </ScrollView>
          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});