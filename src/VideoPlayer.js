import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';

export default function VideoPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
      setIsPlaying(true);
    };
  
    const handlePause = () => {
      setIsPlaying(false);
    };
  return (
    <View style={styles.container}>
    <Video
      source={{ uri: video.url }}
      style={styles.video}
      controls
      resizeMode="contain"
      paused={!isPlaying}
    />
    <Text style={styles.title}>{video.title}</Text>
    {!isPlaying ? (
      <Button title="Play" onPress={handlePlay} />
    ) : (
      <Button title="Pause" onPress={handlePause} />
    )}
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      flex: 1,
      width: '100%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });