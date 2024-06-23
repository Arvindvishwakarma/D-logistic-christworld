
import React, { useEffect, useState, useRef } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { Card } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StatusBar, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, TextInput, Dimensions, FlatList, Modal, Pressable } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import Stories from 'react-native-stories-instagram';
import { QUERY_ALL_POST, QUERY_ALL_STATUS, QUERY_GET_ALL_USER, QUERY_GET_USER_BY_ID_NOTIFICATION, QUERY_GET_POST_BY_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { MUTATION_COMMET_USER, MUTATION_CREATE_DISLIKE_POST, MUTATION_CREATE_LIKE_POST, MUTATION_CREATE_NOTIFICATION, MUTATION_DELETE_POST, MUTATION_NOTIFICATION, MUTATION_UPDATE_USER_PROFILE, MUTATION_USER_UPDATE } from '../GraphqlOperation/Mutation';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'react-moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-crop-picker';
import logo from "../assets/Img/Picture1.png"
import PostNot from "../assets/Img/PostNot.png"
import messaging from '@react-native-firebase/messaging';
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;

let limit = 10;

export default function SinglePost({ navigation, route }) {

  const { postId } = route.params;

  const [userId, setUserId] = useState()

  useEffect(() => {
    AsyncStorage.getItem("userId").then(id => setUserId(id))
  })

  const { data, loading } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  const [inputComment, setInputComment] = useState('');

  function handleOpen(data, id) {
    refRBSheet.current.open()
    setStoreData(data)
    setPostUpdateId(id)
  }

  const { data: DataPost, loading: LoadingPost } = useQuery(QUERY_GET_POST_BY_ID, {
    variables: {
      "postId": `${postId}`
    }
  })

  console.log("DataPost", DataPost)

  const [state, setState] = useState(false)
  const [skip, setSkip] = useState(0)

  const ITEM_HEIGHT = width * 1.2;

  const { data: Postdata, loading: postLoading } = useQuery(QUERY_ALL_POST, {
    pollInterval: 300
  })

  console.log("Postdata", Postdata)


  const { data: dataStatus } = useQuery(QUERY_ALL_STATUS, {
    pollInterval: 300
  })

  const refRBSheet = useRef();
  const refRBAssetSheet = useRef();

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



  const { data: userData } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userId}`
    }
  })

  console.log("userData", userData)




  const [stateLoading, seStateLoading] = useState(false)

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onBuffer = ({ isBuffering }) => {
    seStateLoading(isBuffering ? 1 : 0);
  }


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


  const carouseItems = [
    {

      image: "https://media.gettyimages.com/photos/modern-hospital-building-picture-id1312706413?s=612x612"

    },

    {

      image: "https://thumbs.dreamstime.com/z/hospital-building-modern-parking-lot-59693686.jpg"
    },

    {

      image: "https://ivyhospital.com/Content/images/png/Hoshiarpur_home.png"
    }

  ]

  // const renderItem = ({ item }) => {
  //   return (
  //     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", marginTop: 5 }}>
  //       <Image source={{ uri: item.image }} style={{ width: "100%", height: 100, marginBottom: 10, borderRadius: 5 }} />
  //     </View>
  //   )
  // }

  const [createLikePost, { loading: likePostLoading }] = useMutation(MUTATION_CREATE_LIKE_POST, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost"
    ]
  })


  const [disLikePost, { loading: dislikePostLoading }] = useMutation(MUTATION_CREATE_DISLIKE_POST, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost"
    ]
  })

  const [createNotifaction] = useMutation(MUTATION_CREATE_NOTIFICATION)
  const [pushNotificationToAssignNewDbOrder] = useMutation(MUTATION_NOTIFICATION)

  const firstName = userData && userData.getUserById.firstName;
  const lastName = userData && userData.getUserById.lastName;

  const fullName = firstName + "" + lastName;

  const [userPostId, setUserPostId] = useState("")

  console.log("userPostId", userPostId)


  //user data
  const { data: dataUser } = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      "userId": `${userPostId}`
    }
  })

  console.log("dataUser", dataUser)

  const handleLike = (id, userIdPost) => {
    setUserPostId(userIdPost)
    createLikePost({
      variables: {
        "userLikePostInput": {
          "postId": `${id}`,
          "likes": [
            {
              "userId": `${userId}`,
              "firstName": `${userData && userData.getUserById.firstName}`,
              "lastName": `${userData && userData.getUserById.lastName}`,
              "avatar": `${userData && userData.getUserById.avatar}`,
              "createdDateTime": "null",
              "status": "pending"
            }
          ]
        }
      }
    })


    if (userId === userIdPost) {

    } else {
      createNotifaction({
        variables: {
          "notificationSendInput": {
            "avatar": userData && userData.getUserById.avatar === null ? null : `${userData && userData.getUserById.avatar}`,
            "notificationType": "Like",
            "postId": `${id}`,
            "userName": `${fullName}`,
            "notifyUserId": `${userId}`,
            "title": "Like Post",
            "titleCaption": "Like Your Post ❤️",
            "userId": `${userIdPost}`
          }
        }
      })
    }



  }

  // const { data: userDataSend, loading: userLoading } = useQuery(QUERY_GET_USER_BY_ID, {
  //   variables: {
  //     "userId": `${userPostId}`
  //   }
  // })


  // function handleNotication(){
  //   pushNotificationToAssignNewDbOrder({
  //     variables:{
  //       "deviceToken": `${userDataSend && userDataSend.getUserById.deviceToken}`,
  //       "title": "Like Post",
  //       "body": `Your Post Like By ${userData && userData.getUserById.firstName}" "${userData && userData.getUserById.lastName} `

  //     }
  //     })
  // }


  const [postIdState, setPostId] = useState('')

  const handleDislike = (id) => {
    setPostId(id)
    const userIdFilter = DataPost && DataPost.getPostById.like.filter(uId => {
      return uId.userId === userId
    });
    disLikePost({
      variables: {
        "postId": `${id}`,
        "likeId": `${userIdFilter[0].id}`
      }
    })
  }


  // download image
  const checkPermission = async (url) => {

    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage(url);
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const [getImgUri, setGetImgUri] = useState("")

  const downloadImage = (url) => {
    setGetImgUri(url)

    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = getImgUri;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
      /[^.]+$/.exec(filename) : undefined;
  };

  const [storeData, setStoreData] = useState()
  const [postUpdateId, setPostUpdateId] = useState("")

  function handleOpen(data, id) {
    refRBSheet.current.open()
    setStoreData(data)
    setPostUpdateId(id)
  }

  const [deletePost] = useMutation(MUTATION_DELETE_POST, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost"
    ]
  })

  const handleDelete = () => {
    deletePost({
      variables: {
        "postId": `${postUpdateId}`
      }
    })
    refRBSheet.current.close()

  }




  const [file, setFile] = useState("")
  const [fileType, setFileType] = useState("")

  const handleVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(image => {
      setFile(image.path)
      setFileType("video")
      setCheck(true)
      navigation.navigate("Story", { fileType: "video", file: image.path })
    });
  }

  const handleImage = () => {
    ImagePicker.openPicker({
      width: 320,
      height: 500,
      cropping: true
    }).then(image => {
      setFile(image.path)
      setFileType("image")
      setCheck(true)
      navigation.navigate("Story", { fileType: "image", file: image.path })

    });
  }

  const handleUpload = () => {
    navigation.navigate("Story", { fileType: fileType, file: file })
  }

  const [check, setCheck] = useState(false)
  const handleCancel = () => {
    setCheck(false)
  }

  var unitlist = ["", "K", "M", "G"];
  function formatnumber(number) {
    let sign = Math.sign(number);
    let unit = 0;

    while (Math.abs(number) >= 1000) {
      unit = unit + 1;
      number = Math.floor(Math.abs(number) / 100) / 10;
    }
    return (
      sign * Math.abs(number) + unitlist[unit]
    )

  }


  function formatnumberComment(number) {
    let sign = Math.sign(number);
    let unit = 0;

    while (Math.abs(number) >= 1000) {
      unit = unit + 1;
      number = Math.floor(Math.abs(number) / 100) / 10;
    }
    return (
      sign * Math.abs(number) + unitlist[unit]
    )

  }

  const [click, setClick] = useState(false)

  const [getId, setGetId] = useState("")
  const [pause, setPause] = useState(true)


  const handlePlay = (id) => {
    setGetId(id)
    setPause(false)

  }

  const handlePause = (id) => {
    setGetId(id)
    setPause(true)
  }

  const ref = useRef()

  const onEnd = () => {
    ref.current.seek(0)
  };

  const [clickId, setClickId] = useState()
  function handleClick(id) {
    setClickId(id)
    setClick(false)
  }

  const [deviceToken, setDeviceToken] = useState("")

  useEffect(() => {
    getDeviceToken()
  })

  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    console.log(token)
    setDeviceToken(token)
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived in foreground mode', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);



  const [modalVisible, setModalVisible] = useState();



  useEffect(() => {
    if (userData && userData.getUserById.deviceToken === null) {
      setModalVisible(true)
    } else {
      setModalVisible(false)
    }
  }, [userData])

  const [updateUser] = useMutation(MUTATION_USER_UPDATE, {
    refetchQueries: [
      QUERY_GET_USER_BY_ID,
      "getUserById"
    ]
  })

  const handleNofication = () => {
    updateUser({
      variables: {
        "userUpdateInput": {
          "id": `${userId}`,
          "deviceToken": `${deviceToken}`,
        }
      }
    })
    setModalVisible(false)

  }

  const [createCommentPost, { data: Datacomment, loading: commentLoading }] = useMutation(MUTATION_COMMET_USER, {
    refetchQueries: [
      QUERY_ALL_POST,
      "getAllPost",
      QUERY_GET_POST_BY_ID,
      "getPostById"

    ]
  })

  function sendMessage() {
    createCommentPost({
      variables: {
        "userPostCommentInput": {
          "postId": `${DataPost && DataPost.getPostById.id}`,
          "postComment": [
            {
              "userId": `${data && data.getUserById.id}`,
              "firstName": `${data && data.getUserById.firstName}`,
              "lastName": `${data && data.getUserById.lastName}`,
              "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
              "comment": `${inputComment}`,
              "createdDateTime": "afsdsaf",
              "status": "pending"
            }
          ]
        }
      }
    })

    if (DataPost && DataPost.getPostById.userId === userId) {

    } else {
      createNotifaction({
        variables: {
          "notificationSendInput": {
            "avatar": data && data.getUserById.avatar === null ? null : `${data && data.getUserById.avatar}`,
            "notificationType": "Comment",
            "postId": `${postId}`,
            "userName": `${fullName}`,
            "notifyUserId": `${userId}`,
            "title": "Comment on Your Post",
            "titleCaption": `${inputComment}`,
            "userId": `${DataPost && DataPost.getPostById.userId}`
          }
        }
      })
    }
    setInputComment('');
  }




  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      {
        LoadingPost ?
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ color: "gray", fontFamily: "Poppins-Medium", }}>Please Wait Loading</Text>
          </View>
          :
          DataPost && DataPost.getPostById === null ?
            <>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" style={{ marginTop: 10, marginLeft: 10, fontSize: 25, color: "#3498db" }} />
              </TouchableOpacity>
              <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Image source={PostNot} style={{ width: 200, height: 200 }} />
                <Text style={{ color: "gray", fontFamily: "Poppins-Medium" }}>Post Not Available</Text>
              </View>
            </>
            :
            DataPost === undefined ?
              <>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" style={{ marginTop: 10, marginLeft: 10, fontSize: 25, color: "#3498db" }} />
                </TouchableOpacity>
                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                  <Image source={PostNot} style={{ width: 200, height: 200 }} />
                  <Text style={{ color: "gray", fontFamily: "Poppins-Medium" }}>Post Not Available</Text>
                </View>
              </>
              :
              <>
                <ScrollView>
                  <View style={{ height: "39%" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Feather name="arrow-left" style={{ marginTop: 10, marginLeft: 10, fontSize: 25, color: "#3498db" }} />
                    </TouchableOpacity>

                    <View style={{ width: "100%", marginBottom: 30, }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetail", { userId: DataPost && DataPost.getPostById.userId })}>
                          <View style={{ flexDirection: "row" }}>
                            {
                              DataPost && DataPost.getPostById.avatar === null ?
                                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 10, marginLeft: 10, borderWidth: 1, borderColor: "#000" }} />
                                :
                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${DataPost && DataPost.getPostById.avatar}` }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 10, marginLeft: 10, borderWidth: 1, borderColor: "#000" }} />
                            }

                            <View style={{ flexDirection: "column", marginTop: 15, marginLeft: 10, }}>
                              <Text style={{ fontWeight: "700", color: "#000", }}>{DataPost && DataPost.getPostById.firstName} {DataPost && DataPost.getPostById.lastName}</Text>
                              <Text style={{ color: "gray", fontFamily: "Poppins-Medium", fontSize: 12 }}>Create Date: <Moment element={Text} format='DD-MM-YYYY hh:mm:ss'>{DataPost && DataPost.getPostById.createdDateTime}</Moment></Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View>
                          {
                            DataPost && DataPost.getPostById.userId === userId ?
                              <TouchableOpacity onPress={() => handleOpen(DataPost && DataPost.getPostById, DataPost && DataPost.getPostById.id)}>
                                <Feather name="more-horizontal" style={{ marginRight: 20, marginTop: 20, color: "#000" }} size={25} />
                              </TouchableOpacity>
                              :
                              <></>

                          }
                        </View>
                      </View>
                      <View style={{ width: "90%", marginLeft: 10, marginTop: 5 }}>
                        {
                          DataPost && DataPost.getPostById.caption === "undefined" ?
                            <></>
                            :
                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#000" }}>{DataPost && DataPost.getPostById.caption}</Text>
                        }

                      </View>
                      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 10 }}>

                        {
                          DataPost && DataPost.getPostById.fileDetails.map(List => {
                            return (
                              <>
                                {
                                  List.filetype === "video" ?
                                    <>
                                      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", aspectRatio: 1, marginTop: 30 }}>
                                        <TouchableOpacity onPress={() => setClick(DataPost && DataPost.getPostById.id)}>
                                          <View style={{ width: "100%", height: "100%" }}>
                                            {

                                              DataPost && DataPost.getPostById.id === getId && pause === false ?
                                                <>
                                                  <Video
                                                    source={{
                                                      uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                                                    }}
                                                    //source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                                    style={{
                                                      aspectRatio: 1,
                                                      width: "100%"
                                                    }}
                                                    paused={pause}
                                                    onFullScreen="content"
                                                    resizeMode='cover'
                                                    onBuffer={onBuffer}
                                                    onLoadStart={onLoadStart}
                                                    onLoad={() => seStateLoading(true)}
                                                    onEnd={() => seStateLoading(false)}
                                                  />
                                                  {
                                                    isLoading ?
                                                      <View style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0 }}>
                                                        <ActivityIndicator color="#3498db" size="large" />
                                                      </View>
                                                      :
                                                      <></>
                                                  }

                                                  {
                                                    DataPost && DataPost.getPostById.id === clickId && click === true ?
                                                      <TouchableOpacity style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0 }} onPress={() => handleClick(item.id)}>
                                                        <TouchableOpacity onPress={() => handlePause(DataPost && DataPost.getPostById.id)}>
                                                          <AntDesign name="pausecircle" color="#fff" size={35} />
                                                        </TouchableOpacity>
                                                      </TouchableOpacity>
                                                      :
                                                      <></>
                                                  }
                                                </>
                                                :
                                                <>
                                                  <Video
                                                    source={{
                                                      uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`
                                                    }}
                                                    // }}
                                                    // source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                                    style={{
                                                      aspectRatio: 1,
                                                      width: "100%"
                                                    }}
                                                    paused={true}
                                                    onBuffer={onBuffer}
                                                    onLoadStart={onLoadStart}
                                                    onLoad={onLoad}
                                                    onFullScreen="content"
                                                    resizeMode='cover'
                                                  />
                                                  {
                                                    click ?
                                                      <TouchableOpacity style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0 }} onPress={() => handleClick(DataPost && DataPost.getPostById.id)}>
                                                        <TouchableOpacity onPress={() => handlePlay(DataPost && DataPost.getPostById.id)}>

                                                          <AntDesign name="play" color="#fff" size={35} />
                                                        </TouchableOpacity>
                                                      </TouchableOpacity>

                                                      :
                                                      <>
                                                        <View style={{ backgroundColor: "#000", height: "100%", width: "100%", position: "absolute", top: 0, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                          <AntDesign name="play" color="#fff" size={35} />
                                                        </View>
                                                      </>

                                                  }
                                                </>
                                            }

                                            {/* <View style={{width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"center",alignItems:"center",position:"absolute",top:0}}>

                              {
                                 item.id === getId && pause  === true?
                                <TouchableOpacity onPress={()=>handlePlay(item.id)}>
                                   <AntDesign name="play"  color="#fff" size={35}/>
                                  </TouchableOpacity>
                                 :
                                   pause  === true ?
                                 <TouchableOpacity onPress={()=>handlePlay(item.id)}>
                                   <AntDesign name="play"  color="#fff" size={35}/>
                                  </TouchableOpacity>
                                  :
                                  item.id === getId && pause  === false ?
                                  <TouchableOpacity  onPress={()=>handlePause(item.id)}>
                                  <AntDesign name="pausecircle"  color="#fff" size={35}/>
                                  </TouchableOpacity>
                                  : 
                                  pause  === false ?
                                  <TouchableOpacity  onPress={()=>handlePause(item.id)}>
                                  <AntDesign name="pausecircle"  color="#fff" size={35}/>
                                  </TouchableOpacity>
                                  :

                                  <TouchableOpacity  onPress={()=>handlePause(item.id)}>
                                  <AntDesign name="pausecircle"  color="#fff" size={35}/>
                                  </TouchableOpacity>


                              }
                             
                             </View> */}

                                          </View>
                                        </TouchableOpacity>
                                        {/* <Video
                                         onEnd={onEnd}
                                         onLoad={onLoad}
                                         onLoadStart={onLoadStart}
                                         onProgress={onProgress}
                                         repeat={true}
                                         ref={videoPlayer}
                                         onFullscreenPlayerWillPresent={self.fullScreenPlayerWillPresent}
                                         onFullscreenPlayerDidPresent={self.fullScreenPlayerDidPresent}
                                         onFullscreenPlayerWillDismiss={self.fullScreenPlayerWillDismiss}
                                         onFullscreenPlayerDidDismiss={self.fullScreenPlayerDidDissmiss}
                                         resizeMode={screenType}
                                         onFullScreen={isFullScreen}
                                         source={{
                                           uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                                         }}
                                         style={{
                                           aspectRatio: 1,
                                           width: "100%"
                                       }}
                                         volume={10}
                                       />
                                       <MediaControls
                                         duration={duration}
                                         isLoading={isLoading}
                                         mainColor="#000"
                                         onFullScreen={onFullScreen}
                                          onPaused={onPaused}
                                         onReplay={onReplay}
                                         onSeek={onSeek}
                                         onSeeking={onSeeking}
                                          playerState={playerState}
                                         progress={currentTime}
                                          toolbar={renderToolbar()}
                                       /> */}
                                      </View>
                                    </>
                                    :
                                    <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}` }} style={{ width: width, height: ITEM_HEIGHT, resizeMode: 'cover' }} />
                                }

                              </>
                            )
                          })
                        }
                        <View style={{ flexDirection: "row", width: "90%", marginTop: 10, marginBottom: 10, justifyContent: "space-between" }}>

                          <View style={{ flexDirection: "row" }}>

                            {
                              DataPost && DataPost.getPostById.id === postIdState ?
                                likePostLoading ?
                                  <ActivityIndicator color="#000" size="small" /> :
                                  dislikePostLoading ?
                                    <ActivityIndicator color="#000" size="small" /> :
                                    <View style={{ flexDirection: "row" }}>
                                      {

                                        DataPost && DataPost.getPostById.like.some(obj => obj.userId === userId) ?
                                          <TouchableOpacity onPress={() => handleDislike(DataPost && DataPost.getPostById.id, DataPost && DataPost.getPostById)}>
                                            <FontAwesome name="heart" size={25} color="#e74c3c" />
                                          </TouchableOpacity>
                                          :
                                          <TouchableOpacity onPress={() => handleLike(DataPost && DataPost.getPostById.id, DataPost && DataPost.getPostById.userId)}>
                                            <Feather name="heart" size={25} color="#000" />
                                          </TouchableOpacity>
                                      }
                                      <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }}>{formatnumber(DataPost && DataPost.getPostById.like.length)}</Text>
                                    </View> :
                                <View style={{ flexDirection: "row" }}>
                                  {

                                    DataPost && DataPost.getPostById.like.some(obj => obj.userId === userId) ?
                                      <TouchableOpacity onPress={() => handleDislike(DataPost && DataPost.getPostById.id, DataPost && DataPost.getPostById)}>
                                        <FontAwesome name="heart" size={25} color="#e74c3c" />
                                      </TouchableOpacity>
                                      :
                                      <TouchableOpacity onPress={() => handleLike(DataPost && DataPost.getPostById.id, DataPost && DataPost.getPostById.userId)}>
                                        <Feather name="heart" size={25} color="#000" />
                                      </TouchableOpacity>
                                  }
                                  <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }} >{formatnumber(DataPost && DataPost.getPostById.like.length)}</Text>
                                </View>
                            }
                            <TouchableOpacity onPress={() => navigation.navigate("Comment", { comment: DataPost && DataPost.getPostById.comment, postId: DataPost && DataPost.getPostById.id, captionData: DataPost && DataPost.getPostById.caption, avatarData: DataPost && DataPost.getPostById.avatar, fistNm: DataPost && DataPost.getPostById.firstName, lastNm: DataPost && DataPost.getPostById.lastName })}>
                              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                                <Feather name="message-circle" size={25} color="#000" />
                                <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }}>{formatnumberComment(DataPost && DataPost.getPostById.comment.length)}</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection: "row", marginLeft: 10 }}>
                            <TouchableOpacity onPress={() => checkPermission(`https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${DataPost && DataPost.getPostById.fileDetails[0].file}`)}>
                              <Feather name="download" size={25} color="#000" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>






                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 60 }}>
                      <View style={{ width: "90%" }}>
                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#777" }}>Comments</Text>
                      </View>
                    </View>

                    {
                      DataPost && DataPost.getPostById.comment.slice().reverse().map(item => {
                        return (
                          <View style={{ width: "90%", marginTop: 10, marginBottom: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                              <View style={{ flexDirection: "row" }}>
                                {
                                  item.avatar === null ?
                                    <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />
                                    :
                                    <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 100, borderColor: "#000", borderWidth: 2 }} />

                                }
                              </View>
                              <View style={{ marginLeft: 10, width: "80%", backgroundColor: "#ecf0f1", marginTop: 12, borderRadius: 10 }}>
                                <Text style={{ marginTop: 15, fontWeight: "700", color: "#000", marginLeft: 10 }}>{item.firstName} {item.lastName}</Text>
                                <Text style={{ width: "70%", color: "#000", fontSize: 12, marginLeft: 10, marginBottom: 10 }}>{item.comment}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      })
                    }
                  </View>
                </ScrollView>


                <View style={{ width: "100%", height: 60, backgroundColor: "#fff", position: "absolute", bottom: 0 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#000", marginLeft: 10, marginRight: 10, borderRadius: 10 }}>

                    <View style={{ width: "10%" }}>
                      {
                        data && data.getUserById.avatar === null ?
                          <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 35, height: 35, borderRadius: 50, marginTop: 7, marginLeft: 2, marginRight: 5 }} />
                          :
                          <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${data && data.getUserById.avatar}` }} style={{ width: 35, height: 35, borderRadius: 50, marginTop: 7, marginLeft: 2, marginRight: 5 }} />
                      }
                    </View>

                    <View style={{ width: "70%" }}>
                      <TextInput placeholder='What Your Comment' onChangeText={(e) => setInputComment(e)} value={inputComment} style={{ color: "#000" }} placeholderTextColor="gray" />
                    </View>
                    <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      {
                        commentLoading ?
                          <ActivityIndicator color="#000" size="small" />
                          :
                          <TouchableOpacity onPress={() => sendMessage()}>
                            <View style={{ width: 50, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", height: 40, marginTop: 5, borderRadius: 10 }}>
                              <Feather name="send" size={20} color="#000" />
                            </View>
                          </TouchableOpacity>
                      }

                    </View>
                  </View>
                </View>
              </>


      }

    </View>

  )
}