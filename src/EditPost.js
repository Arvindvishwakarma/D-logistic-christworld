import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'react-moment';
import { useState, useRef } from 'react';
import
MediaControls, { PLAYER_STATES }
  from 'react-native-media-controls';
import Video from 'react-native-video';
import { useMutation } from '@apollo/client';
import { mUTATION_UPDATE_POST } from '../GraphqlOperation/Mutation';
import { QUERY_ALL_POST } from '../GraphqlOperation/Query';

export default function EditPost({ navigation, route }) {

  const { storeData } = route.params;
  console.log("storeData2", storeData)

  const [caption, setCaption] = useState(storeData && storeData.caption)

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

  const [updatePost] = useMutation(mUTATION_UPDATE_POST, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost"
    ]
  })


  const handleSubmit = () => {
    updatePost({
      variables: {
        "postUpdateInput": {
          "caption": `${caption}`,
          "id": `${storeData && storeData.id}`
        }
      }
    }).then(() => {
      navigation.navigate("BottomNavigation")
    })
  }

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 2 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" style={{ fontSize: 25, color: "#000", marginTop: 2 }} />
            </TouchableOpacity>
            <Text style={{ fontFamily: "Poppins-SemiBold", marginLeft: 5, fontSize: 20, color: "#000", marginLeft: 10 }}>Edit Post</Text>
          </View>

          <View>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Feather name="check" style={{ fontSize: 25, color: "#3498db", marginTop: 2, marginRight: 10 }} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: "95%" }}>
            <View style={{ flexDirection: "row" }}>
              {
                storeData && storeData.avatar === null ?
                  <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                  :
                  <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${storeData && storeData.avatar}` }} style={{ width: 50, height: 50, borderRadius: 50 }} />

              }
              <View>
                <Text style={{ marginTop: 5, marginLeft: 5, fontFamily: "Poppins-SemiBold", color: "#000" }}>{storeData && storeData.firstName} {storeData && storeData.lastName}</Text>
                <Text style={{ color: "gray", fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 5 }}>Create Date: <Moment element={Text} format='DD-MM-YYYY hh:mm:ss'>{storeData && storeData.createDateTime}</Moment></Text>
              </View>
            </View>

            {
              storeData && storeData.fileDetails.map(List => {
                return (
                  <>
                    {
                      List.filetype === "video" ?
                        <>
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
                                uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
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
                        </>
                        :

                        <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}` }} style={{ width: "100%", height: 350 }} />
                    }

                  </>
                )
              })

            }
            <View style={{ width: "100%", borderBottomWidth: 2, borderBottomColor: "#000" }}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder='Write Caption..'
                placeholderTextColor="gray"
                style={{ color: "#000" }}
                value={caption}
                onChangeText={(e) => setCaption(e)}
              />
            </View>
            <View>
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