import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION_CREATE_POST_USER } from '../GraphqlOperation/Mutation';
import { QUERY_ALL_POST, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import { useState } from 'react';
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import Video from 'react-native-video';
import
MediaControls, { PLAYER_STATES }
  from 'react-native-media-controls';

export default function AddPostCamera({ navigation, route }) {

  const { filetype, imageUri, setImgType } = route.params;

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

  const [userId, setUserId] = useState()
  const [caption, setCaption] = useState()



  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])



  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })



  console.log("data", data)

  const [createPost, { loading: loadingDataPost }] = useMutation(MUTATION_CREATE_POST_USER, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost"
    ]
  })


  const [profileImg, setProfileImg] = useState(imageUri)
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 320,
      height: 350,
      cropping: true
    }).then(image => {
      console.log(image);
      setProfileImg(image.path)
      setImgType("Image")

    });
  }





  const handlePostImageUpload = async () => {
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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          createPost({
            variables: {
              "postInput": {
                "userId": `${userId}`,
                "firstName": `${data && data.getUserById.firstName}`,
                "email": `${data && data.getUserById.email}`,
                "contact": `${data && data.getUserById.contact}`,
                "lastName": `${data && data.getUserById.lastName}`,
                "churchName": `${data && data.getUserById.churchName}`,
                "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
                "caption": `${caption}`,
                "fileDetails": [
                  {
                    "file": `${uniqueName}`,
                    "filetype": "image",

                  }
                ]
              }

            }
          }).then(() => {
            showMessage({
              message: "Share Post Successfully!!!",
              type: "success",
            });
            navigation.navigate("BottomNavigation")
          })

        }
      })
    });
  }


  const handlePostVideoUpload = async () => {

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
      s3bucket.upload(params, (err) => {
        if (err) {
          console.log("error in callback");

        } else {
          createPost({
            variables: {
              "postInput": {
                "userId": `${userId}`,
                "firstName": `${data && data.getUserById.firstName}`,
                "email": `${data && data.getUserById.email}`,
                "contact": `${data && data.getUserById.contact}`,
                "lastName": `${data && data.getUserById.lastName}`,
                "churchName": `${data && data.getUserById.churchName}`,
                "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
                "caption": `${caption}`,
                "fileDetails": [
                  {
                    "file": `${uniqueName}`,
                    "filetype": "video",

                  }
                ]
              }

            }
          }).then(() => {
            showMessage({
              message: "Share Post Successfully!!!",
              type: "success",
            });
            navigation.navigate("BottomNavigation")
          })

        }
      })
    });

  }

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <Feather name="chevron-left" style={{ marginLeft: 10 }} size={25} />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18, color: "#000", fontFamily: "Poppins-SemiBold" }}>Create Post</Text>
        </View>
        {

          filetype === "Image" ?
            <TouchableOpacity onPress={() => handlePostImageUpload()}>
              <View style={{ marginRight: 10 }}>
                {
                  loadingDataPost ?
                    <ActivityIndicator size="small" color="#0000ff" />
                    :
                    <Text style={{ color: "#3498db", fontFamily: "Poppins-Medium" }}>Share</Text>

                }

              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => handlePostVideoUpload()}>
              <View style={{ marginRight: 10 }}>
                {
                  loadingDataPost ?
                    <ActivityIndicator size="small" color="#0000ff" />
                    :
                    <Text style={{ color: "#3498db", fontFamily: "Poppins-Medium" }}>Share</Text>

                }

              </View>
            </TouchableOpacity>
        }

      </View>

      <View style={{ flexDirection: "column", marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          {
            data && data.getUserById.avatar === null ?
              <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />
              :
              <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${data && data.getUserById.avatar}` }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />
          }

          <View style={{ flexDirection: "column" }}>
            <Text style={{ marginTop: 10, marginLeft: 10, fontWeight: "600", fontSize: 16, color: "#000" }}>{data && data.getUserById.firstName} {data && data.getUserById.lastName}</Text>

            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              <Text style={{ color: "gray" }}>Public </Text>
              <Feather name="chevron-down" style={{ color: "#000", marginTop: 2 }} size={20} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%" }}>
          <TextInput placeholder={`What on your mind ${data && data.getUserById.firstName} ?`} multiline={true} style={{ color: "#000" }} placeholderTextColor="#000" onChangeText={(e) => setCaption(e)} />
        </View>
        <View>

          {
            filetype === "Image" ?
              <Image source={{ uri: profileImg }} style={{ width: 320, height: 350, borderRadius: 20 }} />
              :
              <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: 350, height: 250, marginTop: 30 }}>
                <Video
                  onEnd={onEnd}
                  onLoad={onLoad}
                  onLoadStart={onLoadStart}
                  onProgress={onProgress}
                  paused={paused}
                  ref={videoPlayer}
                  resizeMode={screenType}
                  onFullScreen={isFullScreen}
                  source={{
                    uri: `${profileImg}`,
                  }}
                  style={styles.mediaPlayer}
                  volume={10}
                />
                <MediaControls
                  duration={duration}
                  isLoading={isLoading}
                  mainColor="#333"
                  onFullScreen={onFullScreen}
                  onPaused={onPaused}
                  onReplay={onReplay}
                  onSeek={onSeek}
                  onSeeking={onSeeking}
                  playerState={playerState}
                  progress={currentTime}
                  toolbar={renderToolbar()}
                />
              </View>
          }
        </View>
      </View>

      <View style={{ width: "100%", height: 110, backgroundColor: "#fff", position: "absolute", bottom: 0 }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => handleImagePicker()}>
            <Card style={{ marginLeft: 20, width: 150 }}>
              <View style={{ flexDirection: "row", margin: 10 }}>
                <Feather name="image" size={20} style={{ color: "#000" }} />
                <Text style={{ marginLeft: 5, color: "#000" }}>Gallery</Text>

              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
            <Card style={{ marginRight: 20, width: 150 }}>
              <View style={{ flexDirection: "row", margin: 10 }}>
                <Feather name="disc" size={20} style={{ color: "#000" }} />
                <Text style={{ marginLeft: 5, color: "#000" }}>Click Picture</Text>

              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <Card style={{ marginLeft: 20, width: 150 }}>
            <View style={{ flexDirection: "row", margin: 10 }}>
              <Feather name="map-pin" size={20} style={{ color: "#000" }} />
              <Text style={{ marginLeft: 5, color: "#000" }}>Location</Text>

            </View>
          </Card>
          <Card style={{ marginRight: 20, width: 150 }}>
            <View style={{ flexDirection: "row", margin: 10 }}>
              <Feather name="user-plus" size={20} style={{ color: "#000" }} />
              <Text style={{ marginLeft: 5, color: "#000" }}>Add someone</Text>

            </View>
          </Card>
        </View>
      </View>
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