import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { RNCamera } from 'react-native-camera';
import { useCamera } from "react-native-camera-hooks"
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-crop-picker';


export default function Camera({ navigation }) {

  const [toggle, setToggle] = useState("")
  const [checkVideo, setCheckVideo] = useState(true)
  const [flash, setFlash] = useState(true)
  const [rotate, setRotate] = useState(true)

  const [profileImg, setProfileImg] = useState('')
  const [imgType, setImgType] = useState('')
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 320,
      height: 250,
      cropping: true
    }).then(image => {
      console.log(image);
      setProfileImg(image.path)
      setImgType("Image")
      navigation.navigate("File", { imageUri: profileImg, filetype: imgType, setImgType: setImgType })

    });
  }

  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  )

  const takePicture = async function (camera) {
    const options = { quality: 0.5, base64: true, width: 400 };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
    setProfileImg(data.uri);
    setImgType("Image")
    navigation.navigate("File", { imageUri: profileImg, filetype: imgType, setImgType: setImgType })

  };

  const takeVideo = async function (camera) {
    const options = { quality: 0.5, base64: true, width: 400, height: 350 };
    const data = await camera.recordAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
    setProfileImg(data.uri);
    setImgType("Video")
    navigation.navigate("File", { imageUri: profileImg, filetype: imgType, setImgType: setImgType })
  };

  const stopVideo = async function (camera) {
    camera.stopRecording()
  }

  const pausePreview = async function (camera) {
    camera.pausePreview()
  }

  const resumePreview = async function (camera) {
    camera.resumePreview()
  }



  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" style={{ color: "#fff", marginTop: 10, marginLeft: 10 }} size={25} />
          </TouchableOpacity>
        </View>
        <View>
          {
            flash === true ?
              <Feather name="zap-off" style={{ color: "#fff", marginTop: 10, marginLeft: 10 }} size={25} onPress={() => setFlash(false)} />
              :
              <Feather name="zap" style={{ color: "#fff", marginTop: 10, marginLeft: 10 }} size={25} onPress={() => setFlash(true)} />
          }
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("File", { imageUri: profileImg, filetype: imgType, setImgType: setImgType })}>
          <View>
            <Text style={{ color: "#fff", fontSize: 16, marginRight: 10, marginTop: 10 }}>Done</Text>
          </View>
        </TouchableOpacity>
      </View>
      <RNCamera
        style={styles.preview}
        type={
          rotate === true ?
            RNCamera.Constants.Type.back
            :
            RNCamera.Constants.Type.front
        }
        flashMode={
          flash === true ?
            RNCamera.Constants.FlashMode.off
            :
            RNCamera.Constants.FlashMode.on
        }
        defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
        captureAudio={true}
        ratio="16:9"
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: "space-between", borderRadius: 100 }}>
              {
                toggle === "camera" ?
                  <>
                    <View>
                      <TouchableOpacity onPress={() => handleImagePicker()} style={styles.capture}>
                        <Feather name="image" size={20} style={{ color: "#000", borderRadius: 100 }} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                        <Feather name="stop-circle" size={30} style={{ color: "#000", borderRadius: 100 }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setToggle("video")} style={styles.capture}>
                        <Feather name="video" size={30} style={{ color: "#000", borderRadius: 100 }} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      {
                        rotate === true ?
                          <TouchableOpacity onPress={() => setRotate(false)} style={styles.capture}>
                            <Feather name="rotate-cw" size={20} style={{ color: "#000", borderRadius: 100 }} />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => setRotate(true)} style={styles.capture}>
                            <Feather name="rotate-ccw" size={20} style={{ color: "#000", borderRadius: 100 }} />
                          </TouchableOpacity>
                      }
                    </View>
                  </>
                  :
                  toggle === "video" ?
                    <>
                      <View>
                        <TouchableOpacity onPress={() => stopVideo(camera)} style={styles.capture}>
                          <Feather name="image" size={20} style={{ color: "#000", borderRadius: 100 }} />
                        </TouchableOpacity>
                      </View>
                      {
                        checkVideo === true ?
                          <View>
                            <TouchableOpacity onPress={() => { takeVideo(camera), setCheckVideo(false) }} style={styles.capture}>
                              <Feather name="play-circle" size={30} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToggle("camera")} style={styles.capture}>
                              <Feather name="camera" size={30} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                          </View>
                          :
                          <View>
                            <TouchableOpacity onPress={() => { stopVideo(camera), setCheckVideo(true) }} style={styles.capture}>
                              <Feather name="pause-circle" size={30} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToggle("camera")} style={styles.capture}>
                              <Feather name="camera" size={30} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                          </View>
                      }
                      <View>
                        {
                          rotate === true ?
                            <TouchableOpacity onPress={() => setRotate(false)} style={styles.capture}>
                              <Feather name="rotate-cw" size={20} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setRotate(true)} style={styles.capture}>
                              <Feather name="rotate-ccw" size={20} style={{ color: "#000", borderRadius: 100 }} />
                            </TouchableOpacity>
                        }
                      </View>
                    </>
                    :
                    <>
                      <View>
                        <View>
                          <TouchableOpacity onPress={() => setToggle("camera")} style={styles.capture}>
                            <Feather name="camera" size={30} style={{ color: "#000", borderRadius: 100 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <View>
                          <TouchableOpacity onPress={() => setToggle("video")} style={styles.capture}>
                            <Feather name="video" size={30} style={{ color: "#000", borderRadius: 100 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
              }
            </View>
          );
        }}
      </RNCamera>
    </View>

  )


}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    borderRadius: 100,
  },
});
