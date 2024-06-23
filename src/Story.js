import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import Video from 'react-native-video';
import
MediaControls, { PLAYER_STATES }
  from 'react-native-media-controls';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_POST, QUERY_GET_ALL_USER, QUERY_GET_STATUS_BY_USER_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import { MUTATION_ADD_MORE_STATUS, MUTATION_CREATE_STATUS } from '../GraphqlOperation/Mutation';
const { width, height } = Dimensions.get('window');


export default function Story({ navigation, route }) {

  const { fileType, file } = route.params;

  console.log("fileType", fileType)
  console.log("file", file)

  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [
    playerState, setPlayerState
  ] = useState(PLAYER_STATES.PLAYING);
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

  const [userId, setUserId] = useState()
  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  const { data: userData } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  console.log("userData", userData)



  const { data: dataStatusUser } = useQuery(QUERY_GET_STATUS_BY_USER_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  console.log("dataStatusUser", dataStatusUser)

  const[statusId,setStatusId] = useState('')

 useEffect(()=>{
  if(dataStatusUser && dataStatusUser.getStatusByUserId === null){
    setStatusId("null")
  }else{
    setStatusId(dataStatusUser && dataStatusUser.getStatusByUserId.id)
  }
 
 
 },[dataStatusUser])

 console.log("statusId",statusId)

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

  const enterFullScreen = () => { };

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

  const [title, setTitle] = useState()


  let first = userData && userData.getUserById.firstName
  let last = userData && userData.getUserById.lastName

  let fullname = first + " " + last

  console.log("fullname", fullname)

  const [createStatus, { loading }] = useMutation(MUTATION_CREATE_STATUS)

  var currentdate = new Date();


  const [addMoreStatus] = useMutation(MUTATION_ADD_MORE_STATUS)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async () => {
    setUploading(true)

    let nextDate = new Date(Date.now() - 60 * 60 * 24 * 1000)
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
    let contentDeposition = 'inline;filename="' + file + '"';
    const fPath = file;

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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          createStatus({
            variables: {
              "statusInput": {
                "profile": userData && userData.getUserById === null ? "null" : `${userData && userData.getUserById.avatar}`,
                "stories": [
                  {
                    "fileType": "image",
                    "isReadMore": "true",
                    "url": `${uniqueName}`,
                    "title": `${title}`
                  }
                ],
                "userId": `${userData && userData.getUserById.id}`,
                "username": `${userData && userData.getUserById.username}`
              }

              // "statusInput": {
              //   "profile": userData && userData.getUserById === null ? "null" : `${userData && userData.getUserById.avatar}`,
              //   "stories": [
              //     {
              //       "fileType": "image",
              //       "createDateTime": `${currentdate}`,
              //       "isReadMore": "true",
              //       "url": `${uniqueName}`,
              //       "epxireDateTime":`${nextDate}`
              //     }
              //   ],
              //   "title": `${title}`,
              //   "userId": `${userData && userData.getUserById.id}`,
              //   "username": `${userData && userData.getUserById.username}`
              // }

            }
          }).then(() => {
            showMessage({
              message: "Share Status Successfully!!!",
              type: "success",
            });
            navigation.navigate("BottomNavigation")
            setUploading(false)
          })

        }
      })
    });
  }


  const handleImageUpload1 = async () => {
    setUploading(true)

    let nextDate = new Date(Date.now() - 60 * 60 * 24 * 1000)
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
    let contentDeposition = 'inline;filename="' + file + '"';
    const fPath = file;

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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          addMoreStatus({
            variables: {
              "addMoreStatusInput": {
                "statusId": `${statusId}`,
                "stories": [
                  {

                    "fileType": "image",
                    "isReadMore": "true",
                    "url": `${uniqueName}`,
                    "title": `${title}`,
                  }
                ]
              }

              // "addMoreStatusInput": {
              //   "statusId": `${dataStatusUser && dataStatusUser.getStatusByUserId.id}`,
              //   "stories": [
              //     {
              //       "createDateTime": `${currentdate}`,
              //       "fileType": "image",
              //       "isReadMore": "true",
              //       "url": `${uniqueName}`,
              //       "epxireDateTime":`${nextDate}`
              //     }
              //   ]
              // }
            }
          }).then(() => {
            showMessage({
              message: "Share Status Successfully!!!",
              type: "success",
            });
            setUploading(false)
            navigation.navigate("BottomNavigation")
          })

        }
      })
    });
  }




  const handleVideoUpload = async () => {
    setUploading(true)


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
    const uniqueName = result + ".mp4"

    const s3bucket = new S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
      signatureVersion: "v4"
    });

    let contentType = "video/mp4";
    let contentDeposition = 'inline;filename="' + file + '"';
    const fPath = file;

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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          createStatus({
            variables: {

              "statusInput": {
                "profile": userData && userData.getUserById === null ? "null" : `${userData && userData.getUserById.avatar}`,
                "stories": [
                  {

                    "fileType": "video",
                    "isReadMore": "true",
                    "url": `${uniqueName}`,
                    "title": `${title}`,
                  }
                ],

                "userId": `${userData && userData.getUserById.id}`,
                "username": `${userData && userData.getUserById.username}`
              }



              // "statusInput": {
              //   "profile": userData && userData.getUserById === null ? "null" : `${userData && userData.getUserById.avatar}`,
              //   "stories": [
              //     {
              //       "fileType": "video",
              //       "createDateTime": `${currentdate}`,
              //       "isReadMore": "true",
              //       "url": `${uniqueName}`,
              //       "epxireDateTime":`${nextDate}`
              //     }
              //   ],
              //   "title": `${title}`,
              //   "userId": `${userId}`,
              //   "username": `${userData && userData.getUserById.username}`
              // }

            }
          }).then(() => {
            showMessage({
              message: "Share Status Successfully!!!",
              type: "success",
            });
            setUploading(false)
            navigation.navigate("BottomNavigation")
          })

        }
      })
    });
  }


  const handleVideoUpload1 = async () => {
    setUploading(true)



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
    const uniqueName = result + ".mp4"

    const s3bucket = new S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
      signatureVersion: "v4"
    });

    let contentType = "video/mp4";
    let contentDeposition = 'inline;filename="' + file + '"';
    const fPath = file;

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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          addMoreStatus({
            variables: {
              "addMoreStatusInput": {
                "statusId": `${statusId}`,
                "stories": [
                  {

                    "fileType": "video",
                    "isReadMore": "true",
                    "url": `${uniqueName}`,
                    "title": `${title}`,
                  }
                ]
              }


              // "addMoreStatusInput": {
              //   "statusId": `${dataStatusUser && dataStatusUser.getStatusByUserId.id}`,
              //   "stories": [
              //     {
              //       "createDateTime": `${currentdate}`,
              //       "fileType": "video",
              //       "isReadMore": "true",
              //       "url": `${uniqueName}`,
              //       "expireDateTime":`${nextDate}`
              //     }
              //   ]
              // }
            }
          }).then(() => {
            showMessage({
              message: "Share Status Successfully!!!",
              type: "success",
            });
            setUploading(false)
            navigation.navigate("BottomNavigation")
          })

        }
      })
    });
  }


  return (
    <View style={{ backgroundColor: "#000", height: "100%" }}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="x" style={{ fontSize: 25, color: "#fff", marginTop: 10, marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#000", height: "90%", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>

          {
            fileType === "image" ?
              <>
                <Image source={{ uri: file }} style={{ width: 350, height: 500 }} />
                <View style={{ backgroundColor: "#fff", marginBottom: 10 }}>
                  <Text style={{ color: "#000", padding: 5, textAlign: "center" }}>{title}</Text>
                </View>
              </>
              :
              <>
                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: 350, height: 550, marginTop: 30 }}>
                  <Video
                    source={{
                      uri: file,
                    }}
                    rate={1.0}
                    volume={1.0}
                    resizeMode="cover"
                    shouldPlay={true}
                    positionMillis={0}
                    paused={false}
                    style={{ height: height, width: width }}
                  />
                </View>
                <View style={{ backgroundColor: "#fff", marginBottom: 10 }}>
                  <Text style={{ color: "#000", padding: 5, textAlign: "center" }}>{title}</Text>
                </View>

              </>
          }
          <View style={{ flexDirection: "row", borderBottomWidth: 2, width: "95%", justifyContent: "space-between", height: 50, }}>
            <View style={{ padding: 5, width: "85%", backgroundColor: "#fff" }}>

              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder='Write title..'
                placeholderTextColor="#000"
                style={{ color: "#000" }}

                onChangeText={(e) => setTitle(e)}
              />
            </View>
            <View style={{ width: "15%", backgroundColor: "#3498db", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 50 }}>
              <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", height: 50, justifyContent: "center" }}>
                  {
                    uploading ?
                      <ActivityIndicator color="#fff" size="small" />
                      :
                      dataStatusUser && dataStatusUser.getStatusByUserId === null ?
                        <>
                          {
                            fileType === "image" ?
                              <FontAwesome name="paper-plane" style={{ color: "#000", }} size={20} onPress={() => handleImageUpload()} />
                              :
                              <FontAwesome name="paper-plane" style={{ color: "#000", }} size={20} onPress={() => handleVideoUpload()} />
                          }
                        </>
                        :
                        fileType === "image" ?
                          <FontAwesome name="paper-plane" style={{ color: "#fff", }} size={20} onPress={() => handleImageUpload1()} />
                          :
                          <FontAwesome name="paper-plane" style={{ color: "#fff", }} size={20} onPress={() => handleVideoUpload1()} />
                  }
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});