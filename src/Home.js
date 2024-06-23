/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  TextInput,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import React, {useRef} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Stories from 'react-native-stories-instagram';
import {useQuery, useMutation} from '@apollo/client';
import ImageBlurLoading from 'react-native-image-blur-loading'
import {
  QUERY_ALL_POST,
  QUERY_ALL_STATUS,
  QUERY_FRIEND_POST,
  QUERY_FRIEND_STORY,
  QUERY_GET_ALL_BANNER,
  QUERY_GET_ALL_USER,
  QUERY_GET_USER_BY_ID,
  QUERY_GET_USER_BY_ID_NOTIFICATION,
} from '../GraphqlOperation/Query';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MUTATION_CREATE_DISLIKE_POST,
  MUTATION_CREATE_LIKE_POST,
  MUTATION_CREATE_NOTIFICATION,
  MUTATION_DELETE_POST,
  MUTATION_NOTIFICATION,
  MUTATION_UPDATE_USER_PROFILE,
  MUTATION_USER_UPDATE,
} from '../GraphqlOperation/Mutation';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'react-moment';

import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-crop-picker';
import logo from '../assets/Img/Picture1.png';
import messaging from '@react-native-firebase/messaging';
import { useContext } from 'react';
import { AuthContext } from './context/Authcontext';
const {width, height} = Dimensions.get('window');
const screenRatio = height / width;

let limit = 10;

export default function Home({navigation}) {

 const{Progress,uploadProgress,setUploadProgress,uploading,setUploading} =  useContext(AuthContext)
 
 const [userId, setUserId] = useState();
 useEffect(() => {
   AsyncStorage.getItem('userId').then(id => setUserId(id));
 }, []);


  const [state, setState] = useState(false);
  const [skip, setSkip] = useState(0);

  const ITEM_HEIGHT = width * 1.2;

  const {data: Postdata, loading: postLoading} = useQuery(QUERY_ALL_POST, {
    pollInterval: 300,
  });

  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
 const [increaselimit,setIncreaselimit] =useState(5)

  const{data:PostFriendData,loading:PostFriendLoading,error,fetchMore} = useQuery(QUERY_FRIEND_POST,{
    variables: { userId: `${userId}`, commonId: "65d072325e3f305060411388" },
    pollInterval: 300,
   
   
  })
 
  const handleEndReached =()=>{

  }




  // if (PostFriendLoading) return <ActivityIndicator size="large" color="#000" />;
  // if (error) return <Text>Error: {error.message}</Text>;



 
  const{data:dataStroy,loading:loadingStroy}=useQuery(QUERY_FRIEND_STORY)
  

  const {data: dataStatus} = useQuery(QUERY_ALL_STATUS, {
    pollInterval: 300,
  });

  const{data:dataStory} =  useQuery(QUERY_FRIEND_STORY,{
    variables: { userId: `${userId}` },
    pollInterval: 300,
    
  })

  console.log("dataStory",dataStory)

  const refRBSheet = useRef();
  const refRBAssetSheet = useRef();

  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');

  const onSeek = seek => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };



  const {data: userData} = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      userId: `${userId}`,
    },
  });

  console.log('userData', userData);

  const [stateLoading, seStateLoading] = useState(false);

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = data => setIsLoading(true);

  const onBuffer = ({isBuffering}) => {
    seStateLoading(isBuffering ? 1 : 0);
  };

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };

  const enterFullScreen = () => {};

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

  const onSeeking = currentTime => setCurrentTime(currentTime);

  const [createLikePost, {loading: likePostLoading}] = useMutation(
    MUTATION_CREATE_LIKE_POST,
    {
      refetchQueries: [QUERY_ALL_POST, 'getAllPost'],
    },
  );

  const [disLikePost, {loading: dislikePostLoading}] = useMutation(
    MUTATION_CREATE_DISLIKE_POST,
    {
      refetchQueries: [QUERY_ALL_POST, 'getAllPost'],
    },
  );

  const [createNotifaction] = useMutation(MUTATION_CREATE_NOTIFICATION);
  const [pushNotificationToAssignNewDbOrder] = useMutation(
    MUTATION_NOTIFICATION,
  );

  const firstName = userData && userData.getUserById.firstName;
  const lastName = userData && userData.getUserById.lastName;

  const fullName = firstName + '' + lastName;

  const [userPostId, setUserPostId] = useState('');

  console.log('userPostId', userPostId);

  //user data
  const {data: dataUser} = useQuery(QUERY_GET_USER_BY_ID, {
    variables: {
      userId: `${userPostId}`,
    },
  });

  console.log('dataUser', dataUser);

  const handleLike = (id, userIdPost) => {
    setUserPostId(userIdPost);
    createLikePost({
      variables: {
        userLikePostInput: {
          postId: `${id}`,
          likes: [
            {
              userId: `${userId}`,
              firstName: `${userData && userData.getUserById.firstName}`,
              lastName: `${userData && userData.getUserById.lastName}`,
              avatar: `${userData && userData.getUserById.avatar}`,
              createdDateTime: 'null',
              status: 'pending',
            },
          ],
        },
      },
    });

    if (userId === userIdPost) {
    } else {
      createNotifaction({
        variables: {
          notificationSendInput: {
            avatar:
              userData && userData.getUserById.avatar === null
                ? null
                : `${userData && userData.getUserById.avatar}`,
            notificationType: 'Like',
            postId: `${id}`,
            userName: `${fullName}`,
            notifyUserId: `${userId}`,
            title: 'Like Post',
            titleCaption: 'Like Your Post ❤️',
            userId: `${userIdPost}`,
          },
        },
      });
    }
  };

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

  const [postIdState, setPostId] = useState('');

  const handleDislike = (id, itemData) => {
    setPostId(id);
    const userIdFilter = itemData.like.filter(uId => {
      return uId.userId === userId;
    });
    disLikePost({
      variables: {
        postId: `${id}`,
        likeId: `${userIdFilter[0].id}`,
      },
    });
  };

  // download image
  const checkPermission = async url => {
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
            message: 'App needs access to your storage to download Photos',
          },
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

  const [getImgUri, setGetImgUri] = useState('');

  const downloadImage = url => {
    setGetImgUri(url);

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
    const {config, fs} = RNFetchBlob;
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
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const [storeData, setStoreData] = useState();
  const [postUpdateId, setPostUpdateId] = useState('');

  function handleOpen(data, id) {
    refRBSheet.current.open();
    setStoreData(data);
    setPostUpdateId(id);
  }

  const [deletePost] = useMutation(MUTATION_DELETE_POST, {
    refetchQueries: [QUERY_ALL_POST, 'getAllPost'],
  });

  const handleDelete = () => {
    deletePost({
      variables: {
        postId: `${postUpdateId}`,
      },
    });
    refRBSheet.current.close();
  };

  const [file, setFile] = useState('');
  const [fileType, setFileType] = useState('');

  const handleVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'image/video',
    }).then(image => {
      setFile(image.path);
      setFileType('video');
      setCheck(true);
      console.log('image', image);
      const typeAsset = image.mime.split('', 5).join('');
      console.log('typeAsset', typeAsset);
      navigation.navigate('Story', {fileType: typeAsset, file: image.path});
    });
  };

  const handleImage = () => {
    ImagePicker.openPicker({
      width: 320,
      height: 500,
      cropping: true,
      multiple: true,
    }).then(image => {
      setFile(image.path);
      setFileType('image');
      setCheck(true);
      navigation.navigate('Story', {fileType: 'image', file: image.path});
    });
  };

  const handleUpload = () => {
    navigation.navigate('Story', {fileType: fileType, file: file});
  };

  const [check, setCheck] = useState(false);
  const handleCancel = () => {
    setCheck(false);
  };

  var unitlist = ['', 'K', 'M', 'G'];
  function formatnumber(number) {
    let sign = Math.sign(number);
    let unit = 0;

    while (Math.abs(number) >= 1000) {
      unit = unit + 1;
      number = Math.floor(Math.abs(number) / 100) / 10;
    }
    return sign * Math.abs(number) + unitlist[unit];
  }

  function formatnumberComment(number) {
    let sign = Math.sign(number);
    let unit = 0;

    while (Math.abs(number) >= 1000) {
      unit = unit + 1;
      number = Math.floor(Math.abs(number) / 100) / 10;
    }
    return sign * Math.abs(number) + unitlist[unit];
  }

  const [click, setClick] = useState(false);

  const [getId, setGetId] = useState('');
  const [pause, setPause] = useState(true);

  const handlePlay = id => {
    setGetId(id);
    setPause(false);
  };

  const handlePause = id => {
    setGetId(id);
    setPause(true);
  };

  const ref = useRef();

  const onEnd = () => {
    ref.current.seek(0);
  };

  const [clickId, setClickId] = useState();
  function handleClick(id) {
    setClickId(id);
    setClick(false);
  }

  const [deviceToken, setDeviceToken] = useState('');

  useEffect(() => {
    getDeviceToken();
  });

  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    console.log(token);
    setDeviceToken(token);
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'A new FCM message arrived in foreground mode',
        JSON.stringify(remoteMessage),
      );
    });

    return unsubscribe;
  }, []);

  const [modalVisible, setModalVisible] = useState();

  useEffect(() => {
    if (userData && userData.getUserById.deviceToken === null) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [userData]);

  const [updateUser] = useMutation(MUTATION_USER_UPDATE, {
    refetchQueries: [QUERY_GET_USER_BY_ID, 'getUserById'],
  });

  const handleNofication = () => {
    updateUser({
      variables: {
        userUpdateInput: {
          id: `${userId}`,
          deviceToken: `${deviceToken}`,
        },
      },
    });
    setModalVisible(false);
  };
  const{data:dataUserAll} =  useQuery(QUERY_GET_ALL_USER)
  const[getUserData,setUserData] =useState()

 useEffect(()=>{
  setUserData(dataUserAll)
 },[dataUserAll])


 const getUserImage=(id)=>{
  const img = getUserData && getUserData.getAllUsers.filter((getAllUsers) => getAllUsers.id.includes(id))
  return img
 }



 const videoRef = useRef(null);

 const startVideoFromBeginning = () => {
   if (videoRef.current) {
     videoRef.current.seek(0); // Start the video from the beginning
   }
 }
  

 const[initialPartPause,setInitialPartPause] =useState(false)
  





  const renderItem = ({item}) => {
    return (
      <>
        {(userData &&
          userData.getUserById.friends.some(
            obj => obj.friendsId === item.userId,
          )) ||
        userId === item.userId ? (
          <>
            <View style={{width: '100%', marginBottom: 30}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserProfileDetail', {
                      userId: item.userId,
                    })
                  }>
                  <View style={{flexDirection: 'row'}}>
                    {item.avatar === null ? (
                      <Image
                        source={{
                          uri: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
                        }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 100,
                          marginTop: 10,
                          marginLeft: 10,
                          borderWidth: 1,
                          borderColor: '#000',
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}`,
                        }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 100,
                          marginTop: 10,
                          marginLeft: 10,
                          borderWidth: 1,
                          borderColor: '#000',
                        }}
                      />
                    )}

                    <View
                      style={{
                        flexDirection: 'column',
                        marginTop: 15,
                        marginLeft: 10,
                      }}>
                      <Text style={{fontWeight: '700', color: '#000'}}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontFamily: 'Poppins-Medium',
                          fontSize: 12,
                        }}>
                        Create Date:{' '}
                        <Moment element={Text} format="DD-MM-YYYY hh:mm:ss">
                          {item.createdDateTime}
                        </Moment>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View>
                  {item.userId === userId ? (
                    <TouchableOpacity onPress={() => handleOpen(item, item.id)}>
                      <Feather
                        name="more-horizontal"
                        style={{marginRight: 20, marginTop: 20, color: '#000'}}
                        size={25}
                      />
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
              {
                  item.caption === '' ? 
                  <></>
                  :
                  <View style={{width: '90%', marginLeft: 10, marginTop: 5,}}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 13,
                      color: '#000',
                   
                      fontSize: item.fileDetails.length === 0 ? 20 : 12,
                      
                    }}>
                    {item.caption}
                  </Text>
              </View> 
              }
            
              {item.fileDetails.length === 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        marginTop: 10,
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {item.id === postIdState ? (
                          likePostLoading ? (
                            <ActivityIndicator color="#000" size="small" />
                          ) : dislikePostLoading ? (
                            <ActivityIndicator color="#000" size="small" />
                          ) : (
                            <View style={{flexDirection: 'row'}}>
                              {item.like.some(obj => obj.userId === userId) ? (
                                <TouchableOpacity
                                  onPress={() => handleDislike(item.id, item)}>
                                  <FontAwesome
                                    name="heart"
                                    size={25}
                                    color="#e74c3c"
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleLike(item.id, item.userId)
                                  }>
                                  <Feather
                                    name="heart"
                                    size={25}
                                    color="#000"
                                  />
                                </TouchableOpacity>
                              )}
                              <Text
                                style={{
                                  marginLeft: 5,
                                  marginTop: 5,
                                  color: '#000',
                                  fontFamily: 'Poppins-Medium',
                                }}>
                                {formatnumber(item.like.length)}
                              </Text>
                            </View>
                          )
                        ) : (
                          <View style={{flexDirection: 'row'}}>
                            {item.like.some(obj => obj.userId === userId) ? (
                              <TouchableOpacity
                                onPress={() => handleDislike(item.id, item)}>
                                <FontAwesome
                                  name="heart"
                                  size={25}
                                  color="#e74c3c"
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  handleLike(item.id, item.userId)
                                }>
                                <Feather name="heart" size={25} color="#000" />
                              </TouchableOpacity>
                            )}
                            <Text
                              style={{
                                marginLeft: 5,
                                marginTop: 5,
                                color: '#000',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {formatnumber(item.like.length)}
                            </Text>
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Comment', {
                              comment: item.comment,
                              postId: item.id,
                              captionData: item.caption,
                              avatarData: item.avatar,
                              fistNm: item.firstName,
                              lastNm: item.lastName,
                            })
                          }>
                          <View style={{flexDirection: 'row', marginLeft: 10}}>
                            <Feather
                              name="message-circle"
                              size={25}
                              color="#000"
                            />
                            <Text
                              style={{
                                marginLeft: 5,
                                marginTop: 5,
                                color: '#000',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {formatnumberComment(item.comment.length)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {item.fileDetails.length === 0 ? (
                        <></>
                      ) : (
                        <View style={{flexDirection: 'row', marginLeft: 10}}>
                          <TouchableOpacity
                            onPress={() =>
                              checkPermission(
                                `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`,
                              )
                            }>
                            <Feather name="download" size={25} color="#000" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    {item.fileDetails.map(List => {
                      return (
                        <>
                          {List.filetype === 'video' ? (
                            <>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '100%',
                                 height:400,

                                  marginTop: 0,
                                }}>
                                <TouchableOpacity
                                  onPress={() => setClick(item.id)}>
                                  <View style={{width: '100%', height: '100%'}}>
                                    {item.id === getId && pause === false ? (
                                      <>
                                        <Video
                                          source={{
                                            uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                                          }}
                                          //source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                          style={{
                                            aspectRatio: 0.9,
                                            width: '100%',
                                          }}
                                          paused={pause}
                                          ref={videoRef}
                                          onFullScreen="content"
                                          resizeMode="cover"
                                          onBuffer={onBuffer}
                                          onLoadStart={onLoadStart}
                                          onLoad={() => seStateLoading(true)}
                                          onEnd={() => seStateLoading(false)}
                                        
                                      
                                        />
                                        {isLoading ? (
                                          <View
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              backgroundColor:
                                                'rgba(0,0,0,0.5)',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              position: 'absolute',
                                              top: 0,
                                            }}>
                                            <ActivityIndicator
                                              color="#3498db"
                                              size="large"
                                            />
                                          </View>
                                        ) : (
                                          <></>
                                        )}

                                        {item.id === clickId &&
                                        click === true ? (
                                          <TouchableOpacity
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              backgroundColor:
                                                'rgba(0,0,0,0.5)',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              position: 'absolute',
                                              top: 0,
                                            }}
                                            onPress={() =>
                                              handleClick(item.id)
                                            }>
                                            <TouchableOpacity
                                              onPress={() =>
                                                handlePause(item.id)
                                              }>
                                              <AntDesign
                                                name="pausecircle"
                                                color="#fff"
                                                size={35}
                                              />
                                            </TouchableOpacity>
                                          </TouchableOpacity>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <Video
                                          source={{
                                            uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                                          }}
                                          // }}
                                          // source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                          style={{
                                            aspectRatio: 0.9,
                                            width: '100%',
                                          }}
                                          paused={initialPartPause}
                                          ref={videoRef}
                                          onBuffer={onBuffer}
                                          onLoadStart={onLoadStart}
                                          onLoad={onLoad}
                                          onFullScreen="content"
                                          resizeMode="cover"
                                          onProgress={(data) => {
                                            // Stop the video at 5 seconds
                                            if (data.currentTime >= 2) {
                                              setInitialPartPause(true)
                                            }
                                          }}
                                      
                                        />
                                         <TouchableOpacity
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              backgroundColor:
                                                'rgba(0,0,0,0.5)',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              position: 'absolute',
                                              top: 0,
                                            }}
                                            onPress={() =>
                                              handleClick(item.id)
                                            }>
                                            <TouchableOpacity
                                              onPress={() =>
                                                handlePlay(item.id)
                                              }>
                                              <AntDesign
                                                name="play"
                                                color="#fff"
                                                size={35}
                                              />
                                            </TouchableOpacity>
                                          </TouchableOpacity>
                                        {click ? (
                                          <TouchableOpacity
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              backgroundColor:
                                                'rgba(0,0,0,0.5)',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              position: 'absolute',
                                              top: 0,
                                            }}
                                            onPress={() =>
                                              handleClick(item.id)
                                            }>
                                            <TouchableOpacity
                                              onPress={() =>
                                                handlePlay(item.id)
                                              }>
                                              <AntDesign
                                                name="play"
                                                color="#fff"
                                                size={35}
                                              />
                                            </TouchableOpacity>
                                          </TouchableOpacity>
                                        ) : (
                                          <>
                                           
                                          </>
                                        )}
                                      </>
                                    )}

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
                          ) : (
                            <ImageBlurLoading
                            thumbnailSource ={{
                              uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                            }}
                              source={{
                                uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${List.file}`,
                              }}
                              style={{
                                width: width,
                                aspectRatio: 1,
                                resizeMode: 'cover',
                              }}
                            />
                          )}
                        </>
                      );
                    })}

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        marginTop: 10,
                        marginBottom: 10,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {item.id === postIdState ? (
                          likePostLoading ? (
                            <ActivityIndicator color="#000" size="small" />
                          ) : dislikePostLoading ? (
                            <ActivityIndicator color="#000" size="small" />
                          ) : (
                            <View style={{flexDirection: 'row'}}>
                              {item.like.some(obj => obj.userId === userId) ? (
                                <TouchableOpacity
                                  onPress={() => handleDislike(item.id, item)}>
                                  <FontAwesome
                                    name="heart"
                                    size={25}
                                    color="#e74c3c"
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleLike(item.id, item.userId)
                                  }>
                                  <Feather
                                    name="heart"
                                    size={25}
                                    color="#000"
                                  />
                                </TouchableOpacity>
                              )}
                              <Text
                                style={{
                                  marginLeft: 5,
                                  marginTop: 5,
                                  color: '#000',
                                  fontFamily: 'Poppins-Medium',
                                }}>
                                {formatnumber(item.like.length)}
                              </Text>
                            </View>
                          )
                        ) : (
                          <View style={{flexDirection: 'row'}}>
                            {item.like.some(obj => obj.userId === userId) ? (
                              <TouchableOpacity
                                onPress={() => handleDislike(item.id, item)}>
                                <FontAwesome
                                  name="heart"
                                  size={25}
                                  color="#e74c3c"
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  handleLike(item.id, item.userId)
                                }>
                                <Feather name="heart" size={25} color="#000" />
                              </TouchableOpacity>
                            )}
                            <Text
                              style={{
                                marginLeft: 5,
                                marginTop: 5,
                                color: '#000',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {formatnumber(item.like.length)}
                            </Text>
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Comment', {
                              comment: item.comment,
                              postId: item.id,
                              captionData: item.caption,
                              avatarData: item.avatar,
                              fistNm: item.firstName,
                              lastNm: item.lastName,
                            })
                          }>
                          <View style={{flexDirection: 'row', marginLeft: 10}}>
                            <Feather
                              name="message-circle"
                              size={25}
                              color="#000"
                            />
                            <Text
                              style={{
                                marginLeft: 5,
                                marginTop: 5,
                                color: '#000',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {formatnumberComment(item.comment.length)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {item.fileDetails.length === 0 ? (
                        <></>
                      ) : (
                        <View style={{flexDirection: 'row', marginLeft: 10}}>
                          <TouchableOpacity
                            onPress={() =>
                              checkPermission(
                                `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`,
                              )
                            }>
                            <Feather name="download" size={25} color="#000" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}></View>
    );
  };

  const loadMoreItem = () => {
    // alert("End reached")
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    
    );
   
  };

  const ifCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    return contentOffset.y == 0;
  };

  const {data, loading} = useQuery(QUERY_GET_USER_BY_ID_NOTIFICATION, {
    variables: {
      userId: `${userId}`,
    },
  });

  console.log('data', data);

  console.log('dataStatus', dataStatus);

  if (userData && userData.getUserById.friends.length === 0) {
    navigation.navigate('AddFriend');
  }

  const {data: dataBanner} = useQuery(QUERY_GET_ALL_BANNER);

  const [isStatus, setStatus] = useState(true);
  // setInterval(()=> {
  //    setStatus(!isStatus)
  // }, 3000)

  //carouseImg
  useEffect(() => {
    setStatus(!isStatus);
  }, [dataBanner]);

  console.log('dataBanner', dataBanner);

  useEffect(() => {
    setCarouseImg(dataBanner);
  }, [isStatus]);

  const [carouseImg, setCarouseImg] = useState(dataBanner);

  console.log('carouseImg', carouseImg);

  const carouseItems = [
    {
      image:
        'https://media.gettyimages.com/photos/modern-hospital-building-picture-id1312706413?s=612x612',
    },

    {
      image:
        'https://thumbs.dreamstime.com/z/hospital-building-modern-parking-lot-59693686.jpg',
    },

    {
      image: 'https://ivyhospital.com/Content/images/png/Hoshiarpur_home.png',
    },
  ];

  const renderItemCrouser = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: 5,
        }}>
        <Image
          source={{
            uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.file}`,
          }}
          style={{
            width: '100%',
            height: 100,
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
      </View>
    );
  };




  return (
    <View style={{backgroundColor: '#fff', height: '92%'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        onResponderMove={() => {
          console.log('outer responding');
        }}
        onScroll={({nativeEvent}) => {
          setPause(true);
          if (ifCloseToTop(nativeEvent)) {
            console.log('top', nativeEvent);
            setPause(true);
          }
          if (isCloseToBottom(nativeEvent)) {
            console.log('bottom', nativeEvent);
            setIncreaselimit((preCount)=>preCount + 5)
        

            setPause(true);
          }
        }}>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 60,
          }}>
          <View>
            <Image
              source={logo}
              style={{width: 50, height: 50, marginLeft: 10, borderRadius: 30}}
            />
          </View>
          <View style={{flexDirection: 'row', marginRight: 20, marginTop: 15}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}>
              <View style={{width: 30, height: 30, flexDirection: 'column'}}>
                {data && data.getNoticationByUserId.length === 0 ? (
                  <></>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      backgroundColor: '#2980b9',
                      marginLeft: 10,
                      width: 18,
                      height: 18,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      borderRadius: 50,
                    }}>
                    <Text style={{fontSize: 9, color: '#fff'}}>
                      {data &&
                        data.getNoticationByUserId.filter(obj =>
                          obj.status.includes('pending'),
                        ).length}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notification')}>
                  <Feather name="bell" size={25} color="#000" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatUserList')}>
              <Feather
                name="navigation"
                size={25}
                color="#000"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
        <View style={{width: '100%'}}>
          <Carousel
            layout="default"
            data={dataBanner && dataBanner.getAllBanner}
            sliderWidth={400}
            itemWidth={400}
            loop={true}
            autoplay={true}
            renderItem={renderItemCrouser}
          />
          {/* <Image source={{ uri: "https://i.pinimg.com/originals/78/35/8f/78358f6a9f396c2e5996f0c81b874d9a.png" }} style={{ width: "100%", height: 85 }} /> */}
        </View>
        <Text
          style={{
            marginLeft: 20,
            marginTop: 5,
            color: '#000',
            fontFamily: 'Poppins-Medium',
          }}>
          Featured Stories
        </Text>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                width: 60,
                height: 95,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <TouchableOpacity onPress={() => handleVideo()}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginLeft: 2,
                    borderRadius: 50,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0097e6',
                  }}>
                  <Feather name="plus" size={25} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  color: '#000',
                  marginTop: 5,
                  fontSize: 9,
                  fontFamily: 'Poppins-Medium',
                }}>
                You
              </Text>
            </View>

            {dataStory &&
              dataStory.getFriendStatus
                .slice()
                .reverse()
                .map(item => {
                  return (
                    <>
                      {item.stories.length === 0 ? (
                        <></>
                      ) : (userData &&
                          userData.getUserById.friends.some(
                            obj => obj.friendsId === item.userId,
                          )) ||
                        userId === item.userId ? (
                        <View
                          style={{
                            width: 60,
                            height: 95,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('TestStories', {
                                dataStoryid: item.id,
                                storie: item.stories,
                                userId: item.userId,
                              })
                            }>
                            {item.profile === 'null' ? (
                              <Image
                                source={{
                                  uri: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
                                }}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  borderColor: '#000',
                                  borderWidth: 1,
                                }}
                              />
                            ) : (
                              <Image
                                source={{
                                  uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.profile}`,
                                }}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  borderColor: '#000',
                                  borderWidth: 1,
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: '#000',
                              marginTop: 5,
                              fontSize: 8,
                              fontFamily: 'Poppins-Medium',
                            }}>
                            {item.username}
                          </Text>
                        </View>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })}
          </ScrollView>
        </View>

        {
             uploading && (
              <>
          <View style={{width:"100%",height:40,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
          <View style={{width:"95%",flexDirection:"row",height:"100%"}}>
            <View style={{width:"100%",flexDirection:"row"}}>
              <View style={{width:"85%",flexDirection:"column",justifyContent:"center"}}>
              <Text style={{fontSize:12,color:"#000"}}>Post Uploading</Text>
              <Progress.Bar progress={uploadProgress} width={200}  style={{marginTop:7}}/>
              </View>
              <View style={{width:"15%",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <Text style={{  fontFamily: 'Poppins-Medium',color:"#0097e6"}}>{Math.round(uploadProgress * 100)}%</Text>
              </View>
            </View>
          </View>
        </View>

              </>

             )

        }
        
       


        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
         
              <View style={{flexDirection: 'column', width: '100%'}}>
                <FlatList
                  data={PostFriendData && PostFriendData.getFriendsPosts.slice().reverse()}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  onEndReached={handleEndReached}
                  onEndReachedThreshold={0.01}
                />
                 
            
              </View>
         
        </View>
      </ScrollView>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={400}
        openDuration={250}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: '#fff',
            borderTopStartRadius: 50,
            borderTopRightRadius: 50,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              borderBottomColor: '#000',
              borderBottomWidth: 2,
              paddingBottom: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditPost', {storeData: storeData})
              }>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Feather name="edit" size={20} color="#000" />
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 10,
                    fontSize: 16,
                  }}>
                  Edit Post
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', width: '90%', marginTop: 15}}>
            <TouchableOpacity onPress={() => handleDelete()}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Feather name="trash-2" size={20} color="#000" />
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 10,
                    fontSize: 16,
                  }}>
                  Delete Post
                </Text>
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
      </RBSheet>

      <RBSheet
        ref={refRBAssetSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={300}
        openDuration={250}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: '#fff',
            borderTopStartRadius: 50,
            borderTopRightRadius: 50,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          {check === false ? (
            <>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#3498db',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 10,
                }}>
                <TouchableOpacity onPress={() => handleImage()}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#3498db',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#fff',
                      }}>
                      Select Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#3498db',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                <TouchableOpacity onPress={() => handleVideo()}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#3498db',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#fff',
                      }}>
                      Select Video
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#3498db',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                <TouchableOpacity onPress={() => handleUpload()}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#3498db',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#fff',
                      }}>
                      Upload Next
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '90%',
                  backgroundColor: '#3498db',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                <TouchableOpacity onPress={() => handleCancel()}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#3498db',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#fff',
                      }}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
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
      </RBSheet>

     
    </View>
  );
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

  container: {
    flex: 1,
    backgroundColor: '#1a2530',
  },
  pagination: {
    backgroundColor: 'rgba(0,0,0,0)',
    width,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 7,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerMarginTop: {
    marginTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
