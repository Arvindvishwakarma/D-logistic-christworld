import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Video from 'react-native-video';
import
MediaControls, { PLAYER_STATES }
  from 'react-native-media-controls';

export default function File({ navigation, route }) {

  const { imageUri, filetype, setImgType } = route.params;
  console.log("filetype", filetype)
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


  return (
    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", backgroundColor: "#fff" }}>
      {
        filetype === "Image" ?
          <Image source={{ uri: imageUri }} style={{ width: 315, height: 315, borderRadius: 20 }} />
          :
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
                  uri: `${imageUri}`,
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
      }
      <TouchableOpacity onPress={() => navigation.navigate("AddPostCamera", { filetype: filetype, imageUri: imageUri, setImgType: setImgType })}>
        <View style={{ width: 120, height: 40, backgroundColor: "#3498db", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, color: "#fff" }}>Done</Text>
        </View>
      </TouchableOpacity>
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