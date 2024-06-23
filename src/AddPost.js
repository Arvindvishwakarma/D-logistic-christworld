import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useRef,useContext } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Card } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION_CREATE_POST_USER } from '../GraphqlOperation/Mutation';
import { QUERY_ALL_POST, QUERY_GET_STATUS_BY_ID, QUERY_GET_STATUS_BY_USER_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import { useState } from 'react';
import fs from "react-native-fs";
import Video from 'react-native-video';
import { decode } from "base64-arraybuffer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import { AuthContext } from './context/Authcontext';
import VideoPlayer from 'react-native-video-controls';
import RNFS from 'react-native-fs';




export default function AddPost({ navigation }) {

  const{Progress,uploadProgress,setUploadProgress,uploading,setUploading} =  useContext(AuthContext)

  const [userId, setUserId] = useState()
  const [caption, setCaption] = useState("")

  const refRBSheet = useRef();

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  }, [])

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })


  const { data: userDataStatus } = useQuery(QUERY_GET_STATUS_BY_USER_ID, {
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


  const [profileImg, setProfileImg] = useState('')
  const [galleryClick, setGalleryClick] = useState(false)
  const [assestType, setAssetType] = useState("")
  const [cameraClick, setCameraClick] = useState(false)
  const [pathVideo, setPathVideo] = useState('')

  console.log("assestType", assestType)

  const handleImagePicker = () => {

    ImagePicker.openPicker({
      width: 320,
      height: 350,
      cropping: true,
    }).then(image => {
      console.log(image);
      setProfileImg(image.path)
      setGalleryClick(false)
      setAssetType("Image")

    });
  }


  const handleVideoPicker = async() => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      console.log(video);
      setGalleryClick(false)
      setAssetType("Video")
      setPathVideo(video.path)
      setProfileImg("")
    });
  
  }

  function handleClickImage() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setProfileImg(image.path)
      setAssetType("Image")
      setPathVideo("")
      setCameraClick(false)

    });
  }


 async function handleClickVideo() {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then(video => {
      console.log(video);
      setAssetType("Video")
      setPathVideo(video.path)
      setProfileImg("")
      setCameraClick(false)
      
    });
    try {
      const fileUri =video.path; // Replace with the URI of your video file
      const fileInfo = await RNFS.stat(fileUri);
      const fileSizeInBytes = fileInfo.size;
      const fileSizeInMb = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB
      console.log('File Size:', fileSizeInMb, 'MB');
    } catch (error) {
      console.error('Error checking file size:', error);
    }
  }
 


  const handleProfileUpload = async () => {

 
  
    navigation.goBack();
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
      s3bucket.upload(params).on('httpUploadProgress', (evt) => {
        const progress = evt.loaded / evt.total;
        setUploadProgress(progress);
      }).send((err) => {
        if (err) {
          showMessage({
            message: "Upload Failed",
            type: "danger",
          });
          setUploading(false);

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
            setUploading(false)
            setUploadProgress(0)
          })

        }
      })
    });
  }

  const ref = useRef()
  const [pause, setPause] = useState(true)


  const[fileSize ,setFileSize] =useState()

  const handlePostVideoUpload = async () => {
    try {
      const fileUri =pathVideo; // Replace with the URI of your video file
      const fileInfo = await RNFS.stat(fileUri);
      const fileSizeInBytes = fileInfo.size;
      const fileSizeInMb = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB
      setFileSize(fileSizeInMb)
      console.log('File Size:', fileSizeInMb, 'MB');

    if (fileSizeInMb > 40) {
      alert("Video more than 50 MB cannot be uploaded");
      return;
    }
    } catch (error) {
      console.error('Error checking file size:', error);
      return;
    }

    try {
    navigation.goBack();
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
    let contentDeposition = 'inline;filename="' + pathVideo + '"';
    const fPath = pathVideo;

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
      s3bucket.upload(params).on('httpUploadProgress', (evt) => {
        const progress = evt.loaded / evt.total;
        setUploadProgress(progress);
      }).send((err) => {
        if (err) {
          showMessage({
            message: "Upload Failed",
            type: "danger",
          });
          setUploading(false);

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
            setUploading(false)
            setUploadProgress(0)
          })

        }
      })
    });
    }catch{
      console.error('Error during upload:', error);
      setUploading(false);
    }
    

  }

  
 const[initialPartPause,setInitialPartPause] =useState(false)

  const handlePostUpload = async () => {
    setUploading(true)
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
              }
            }
          }).then(() => {
            showMessage({
              message: "Share Post Successfully!!!",
              type: "success",
            });
            navigation.navigate("BottomNavigation")
            setUploading(false)
          })
  }

  const videoRef =useRef()

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <ScrollView>
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
                profileImg === "" && pathVideo === "" && caption === "" ?
                <>
                <View style={{ marginRight: 10, width: 60, height: 30, backgroundColor: "#dcdde1", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  <Text style={{ color: "#000", fontFamily: "Poppins-Medium", fontSize: 11 }}>Share </Text>
                </View>
                </>
                :
                <>
                   {
            assestType === "Video" ?
              <TouchableOpacity onPress={() => handlePostVideoUpload()}>
                <View style={{ marginRight: 10, width: 60, height: 30, backgroundColor: "#3498db", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  {
                    uploading ?
                      <ActivityIndicator color="#fff" size="small" />
                      :
                      <>
                        {
                          loadingDataPost ?
                            <ActivityIndicator size="small" color="#fff" />
                            :
                            <Text style={{ color: "#fff", fontFamily: "Poppins-Medium" }}>Share </Text>
                        }
                      </>
                  }
                </View>
              </TouchableOpacity>
              :
              assestType === "Image" ?
              <TouchableOpacity onPress={() => handleProfileUpload()}>
                <View style={{ marginRight: 10, width: 60, height: 30, backgroundColor: "#3498db", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  {
                    uploading ?
                      <ActivityIndicator color="#fff" size="small" />
                      :
                      loadingDataPost ?
                        <ActivityIndicator size="small" color="#fff" />
                        :
                        <Text style={{ color: "#fff", fontFamily: "Poppins-Medium", fontSize: 11 }}>Share </Text>
                  }
                </View>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => handlePostUpload()}>
                <View style={{ marginRight: 10, width: 60, height: 30, backgroundColor: "#3498db", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  {
                    uploading ?
                      <ActivityIndicator color="#fff" size="small" />
                      :
                      loadingDataPost ?
                        <ActivityIndicator size="small" color="#fff" />
                        :
                        <Text style={{ color: "#fff", fontFamily: "Poppins-Medium", fontSize: 11 }}>Share </Text>
                  }
                </View>
              </TouchableOpacity>
          }
                </>



          }
       
        </View>
        <View style={{ flexDirection: "column", marginTop: 10, height: 80 }}>
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
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 5 }}>
          <View style={{ width: "90%" }}>
            <TextInput placeholder={`What on your mind  ${data && data.getUserById.firstName} ?`} multiline={true} style={{ color: "#000" }} placeholderTextColor="#000" onChangeText={(e) => setCaption(e)} />
          </View>
          <View>
            <View style={{ width: "100%", height: "100%" }}>
              {
                assestType === "Image" ?
                  <Image source={{ uri: profileImg }} style={{ width: 320, height: 350, borderRadius: 20 }} />
                  :
                  assestType === "Video" ?
                    <TouchableOpacity style={{ backgroundColor: "rgba(0, 0, 0, 0.2);" }} onPress={() => setPause(!pause)}>
                   
                      <Video source={{
                        uri: pathVideo,
                      }}
                        //source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                        style={{
                          aspectRatio: 1,
                          width: "100%"
                        }}
                        resizeMode='cover'
                        paused={pause} 
                        ref={videoRef}
                        
                        onProgress={(data) => {
                          // Stop the video at 5 seconds
                          if (data.currentTime >= 2) {
                            setInitialPartPause(true)
                          }
                        }}
                        />
                
                    </TouchableOpacity>
                    :
                    <></>
              }
             
            </View>
           
          </View>
        
        </View>
      
      </ScrollView>
      {
        galleryClick === true ?
          <View style={{ flexDirection: "column", justifyContent: "space-between", width: "100%", bottom: 0, position: "absolute", }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#3498db", marginLeft: 10, borderRadius: 5 }}>
                <TouchableOpacity onPress={() => handleImagePicker()} >
                  <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Feather name="image" size={18} color="#fff" />
                      <Text style={{ fontFamily: "Poppins-SemiBold", color: "#fff", marginLeft: 5 }}>Image</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#3498db", marginRight: 10 }}>
                <TouchableOpacity onPress={() => handleVideoPicker()}>
                  <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Feather name="play-circle" size={18} color="#fff" />
                      <Text style={{ fontFamily: "Poppins-SemiBold", color: "#fff", marginLeft: 5 }}>Video</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <TouchableOpacity onPress={() => setGalleryClick(false)}>
                  <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                      <AntDesign name="close" size={25} color="#000" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          cameraClick ?

            <View style={{ flexDirection: "column", justifyContent: "space-between", width: "100%", bottom: 0, position: "absolute", }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#3498db", marginLeft: 10, borderRadius: 5 }}>
                  <TouchableOpacity onPress={() => handleClickImage()} >
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Feather name="image" size={18} color="#fff" />
                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#fff", marginLeft: 5 }}>Image</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#3498db", marginRight: 10 }}>
                  <TouchableOpacity onPress={() => handleClickVideo()}>
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Feather name="play-circle" size={18} color="#fff" />
                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#fff", marginLeft: 5 }}>Video</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <View style={{ width: "40%", height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                  <TouchableOpacity onPress={() => setCameraClick(false)}>
                    <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                        <AntDesign name="close" size={25} color="#000" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <>
              <View style={{ width: "100%", height: 110, backgroundColor: "#fff", position: "absolute", bottom: 0 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity onPress={() => setGalleryClick(true)}>
                    <Card style={{ marginLeft: 20, width: 150 }}>
                      <View style={{ flexDirection: "row", margin: 10 }}>
                        <Feather name="image" size={20} style={{ color: "#000" }} />
                        <Text style={{ marginLeft: 5, color: "#000" }}>Gallery</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setCameraClick(true)}>
                    <Card style={{ marginRight: 20, width: 150 }}>
                      <View style={{ flexDirection: "row", margin: 10 }}>
                        <Feather name="disc" size={20} style={{ color: "#000" }} />
                        <Text style={{ marginLeft: 5, color: "#000" }}>Click Picture</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
                {/* 
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                  <TouchableOpacity onPress={() => navigation.navigate("AddSomeone")}>
                    <Card style={{ marginLeft: 20, width: 150 }}>
                      <View style={{ flexDirection: "row", margin: 10 }}>
                        <Feather name="map-pin" size={20} style={{ color: "#000" }} />
                        <Text style={{ marginLeft: 5, color: "#000" }}>Location</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("AddSomeone")}>
                    <Card style={{ marginRight: 20, width: 150 }}>
                      <View style={{ flexDirection: "row", margin: 10 }}>
                        <Feather name="user-plus" size={20} style={{ color: "#000" }} />
                        <Text style={{ marginLeft: 5, color: "#000" }}>Add someone</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View> */}
              </View>
            </>
      }

      < RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={150}
        openDuration={250}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          container: {
            backgroundColor: "#fff",
            borderTopStartRadius: 50,
            borderTopRightRadius: 50
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 50 }}>

          <View style={{ width: "90%", backgroundColor: "#3498db", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 10 }}>
            <TouchableOpacity onPress={() => handleImagePicker()}>
              <View style={{ width: "100%", backgroundColor: "#3498db", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 10 }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" }}>Select Image</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: "90%", backgroundColor: "#3498db", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 10, marginTop: 20 }}>
            <TouchableOpacity onPress={() => handleVideoPicker()}>
              <View style={{ width: "100%", backgroundColor: "#3498db", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 10 }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" }}>Select Video</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* <View style={{width:"90%",borderBottomWidth:2,borderBottomColor:"#000"}}>
          <Text style={{fontFamily:"Poppins-SemiBold",color:"#000"}}>Edit Caption</Text>
         <TextInput
         multiline={true}
         numberOfLines={4}
         placeholder='Write Caption..'
         placeholderTextColor="gray"
          style={{color:"#000"}}
         onChangeText={(e)=>setCaption(e)}
        />
         </View>
         <View>
         </View> */}
        </View>
      </RBSheet >
    </View>
  )
}