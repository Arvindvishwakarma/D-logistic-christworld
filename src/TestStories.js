/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, Image, Modal, Animated, StatusBar, Button, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ALL_STATUS, QUERY_GET_STATUS_BY_ID } from '../GraphqlOperation/Query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { MUTATION_STORY_DELETE } from '../GraphqlOperation/Mutation';

const { width, height } = Dimensions.get('window');

export default function TestStories({ navigation, route }) {

  const { dataStoryid, storie, userId } = route.params;


  const [endVideo, setEndVideo] = useState(false)

  const { data: dataUser, loading, error } = useQuery(QUERY_GET_STATUS_BY_ID, {
    variables: {
      "statusId": dataStoryid
    }
  })

  console.log("dataUser", dataUser)
  console.log("data", dataStoryid)
  console.log("userId", userId)

  console.log("stories", storie)
  // console.log("data", data)

  // THE CONTENT
  const [getId, setGetId] = useState()
  useEffect(() => {
    AsyncStorage.getItem('userId').then((id) => setGetId(id))
  })


  const [progressGet, setProgressGet] = useState()

  const [content, setContent] = useState([])
  const [stop, setStop] = useState(false)


  const [isStatus, setStatus] = useState(true)

  useEffect(() => {
    setStatus(!isStatus)

  }, [storie])




  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stories, setStories] = useState([])



  console.log("storie", storie)


  useEffect(() => {
    if (storie && stop === false) {
      storie && storie.map(item => {
        setContent(content => [...content, {
          content:
            `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.url}`,
          type: `${item.fileType}`,
          id: `${item.id}`,
          title: `${item.title}`,
          finish: 0,
        }]);
      })
      setStop(true)
    }

  }, [storie])


  console.log("content", content)


  // const  handleData = async()=>{
  //   let breakCondition = false;

  //     if(storie && !breakCondition){
  //       storie && storie.map(item=>{
  //         setContent(content => [...content, {
  //                  content:
  //                     `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.url}`,
  //                     type: `${item.fileType}`,
  //                      finish: 0,
  //              }]); 
  //       })
  //       breakCondition  = true
  //     }




  // }


  // console.log("handleData",handleData())


  const [isLoading, setIsLoading] = useState(true);

  const [stateLoading, seStateLoading] = useState(false)

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onBuffer = ({ isBuffering }) => {
    seStateLoading(isBuffering ? 1 : 0);
  }








  // const [stories, setStories] = useState([])


  // useEffect(() => {
  //   setStories(data && data.getStatusById.stories)


  // }, [data && data.getStatusById.stories])

  // const[stop,setStop] =useState(false)
  // const[image,setImage] = useState(stories && stories.url)




  // console.log("stories",stories)
  // console.log("image",image)



  //  useEffect(()=>{


  //  },[])

  // const [content, setContent] = useState([])

  // if(data){
  //   data && data.getStatusById.stories.map((item)=>{
  //     setContent(content => [...content, {
  //       content:
  //           `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.url}`,
  //           type: 'image',
  //           finish: 0,
  //   }]);     
  //   })

  // }




  // const [content, setContent] = useState([
  //   {
  //     content:'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/3.jpg?alt=media&token=326c1809-adc2-4a23-b9c3-8995df7fcccd',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/2.mp4?alt=media&token=fcd41460-a441-4841-98da-d8f9a714dd4d',
  //     type: 'video',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/3.jpg?alt=media&token=326c1809-adc2-4a23-b9c3-8995df7fcccd',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/4.jpg?alt=media&token=e9c5bead-4d9f-40d9-b9fa-c6bc12dd6134',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/5.jpg?alt=media&token=7dcb6c3a-8080-4448-bb2c-c9594e70e572',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/6.jpg?alt=media&token=1121dc71-927d-4517-9a53-23ede1e1b386',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/7.jpg?alt=media&token=7e92782a-cd84-43b6-aba6-6fe6269eded6',
  //     type: 'image',
  //     finish: 0,
  //   },
  //   {
  //     content:
  //       'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/8.mp4?alt=media&token=5b6af212-045b-4195-9d65-d1cab613bd7f',
  //     type: 'video',
  //     finish: 0,
  //   },

  // ]);


  console.log("content", content)

  // for get the duration
  const [end, setEnd] = useState(0);
  console.log("end", end)
  // current is for get the current content is now playing
  const [current, setCurrent] = useState(0);
  // if load true then start the animation of the bars at the top
  const [load, setLoad] = useState(false);

  console.log("load", load)
  // progress is the animation value of the bars content playing the current state
  const progress = useRef(new Animated.Value(0)).current;

  // start() is for starting the animation bars at the top
  const [check, setCheck] = useState(false)

  function start(n) {
    // checking if the content type is video or not
    if (content.length === 0) {
      setCheck(true)
    } else if (check === false) {
      {
        if (content[current].type == 'video') {
          // type video
          if (load) {

            Animated.timing(progress, {
              toValue: 1,
              duration: 5000,
            }).start(({ finished }) => {
              console.log("finished", finished)
              if (finished) {

                next();
              }
            });
          }
        } else {
          // type image
          Animated.timing(progress, {
            toValue: 1,
            duration: 5000,
          }).start(({ finished }) => {
            if (finished) {

              next();
            }
          });
        }
      }
    }




  }


  console.log("endVideo", endVideo)
  // handle playing the animation
  function play() {
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function next() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      close();
    }
  }

  // previous() is for changing the content of the current content to -1
  function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      close();
    }
  }

  // closing the modal set the animation progress to 0
  function close() {
    progress.setValue(0);
    setLoad(false);
    console.log('close icon pressed');
    navigation.goBack()
  }


  const refRBSheet = useRef();

  const [storyid, setStroyId] = useState()

  const [deleteStory] = useMutation(MUTATION_STORY_DELETE, {
    refetchQueries: [
      QUERY_GET_STATUS_BY_ID,
      "getAllStatus",
      QUERY_ALL_STATUS,
      "getAllStatus"
    ]

  })

  function handleClick(id) {
    refRBSheet.current.open()
    setStroyId(id)
  }
  console.log("storyid", storyid)

  function handleDelete() {
    deleteStory({
      variables: {
        "storyId": `${dataStoryid}`,
        "currentStroyId": `${storyid}`
      }
    })
  }




  return (
    <View style={styles.containerModal}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      {
        content.length === 0 ?
          <View>
            <ActivityIndicator color="#fff" size="large" />
          </View>
          :
          <>
            <View style={styles.backgroundContainer}>


              {/* check the content type is video or an image */}
              {content[current].type == 'video' ? (
                <>
                  <Video
                    source={{
                      uri: content[current].content,
                    }}
                    rate={1.0}
                    volume={1.0}
                    resizeMode="cover"
                    shouldPlay={true}
                    positionMillis={0}
                    onBuffer={onBuffer}
                    onLoadStart={onLoadStart}
                    onLoad={() => setLoad(true)}
                    onEnd={() => setEndVideo(true)}
                    onProgress={(x) => { setProgressGet(x) }}
                    onReadyForDisplay={play()}
                    // onPlaybackStatusUpdate={AVPlaybackStatus => {
                    //   console.log(AVPlaybackStatus);
                    //   setLoad(AVPlaybackStatus.isLoaded);
                    //   setEnd(AVPlaybackStatus.durationMillis);
                    // }}
                    style={{ height: height, width: width }}
                  />

                </>
              ) : (
                <>
                  <Image
                    onLoadEnd={() => {
                      progress.setValue(0);
                      play();
                    }}
                    source={{
                      uri: content[current].content,
                    }}
                    style={{ width: width, height: height, resizeMode: 'cover' }}
                  />

                </>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
              }}>
              <LinearGradient
                colors={['rgba(0,0,0,1)', 'transparent']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 100,
                }}
              />
              {/* ANIMATION BARS */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  paddingHorizontal: 10,
                }}>
                {content.map((index, key) => {
                  return (
                    // THE BACKGROUND
                    <View
                      key={key}
                      style={{
                        height: 2,
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: 'rgba(117, 117, 117, 0.5)',
                        marginHorizontal: 2,
                      }}>
                      {/* THE ANIMATION OF THE BAR*/}

                      <Animated.View
                        style={{
                          flex: current == key ? progress : content[key].finish,
                          height: 2,
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {/* END OF ANIMATION BARS */}

              <View
                style={{
                  height: 50,
                  flexDirection: 'row',

                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                }}>
                {/* THE AVATAR AND USERNAME  */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {
                    dataUser && dataUser.getStatusById.profile === "null" ?
                      <Image
                        style={{ height: 30, width: 30, borderRadius: 25 }}
                        source={{
                          uri: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
                        }}
                      />
                      :
                      <Image
                        style={{ height: 30, width: 30, borderRadius: 25 }}
                        source={{
                          uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${dataUser && dataUser.getStatusById.profile}`,
                        }}
                      />

                  }

                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'white',
                      paddingLeft: 10,
                    }}>
                    {dataUser && dataUser.getStatusById.username}
                  </Text>
                  {
                    userId === getId ?
                      <TouchableOpacity onPress={() => handleClick(content[current].id)}>
                        <Feather name="more-vertical" color="#fff" size={25} style={{ marginLeft: 10 }} />
                      </TouchableOpacity>
                      :
                      <></>

                  }

                  {
                    content[current].type == 'video' ?
                      <>
                        {
                          load === false ?
                            <ActivityIndicator color="#fff" size="small" style={{ marginLeft: 10 }} />
                            :
                            <></>

                        }
                      </>
                      :
                      <></>

                  }

                </View>

                {/* END OF THE AVATAR AND USERNAME */}
                {/* THE CLOSE BUTTON */}
                <TouchableOpacity
                  onPress={() => {
                    close();
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',

                      height: 50,
                      paddingHorizontal: 15,
                    }}>
                    <Ionicons name="ios-close" size={28} color="white" />
                  </View>
                </TouchableOpacity>
                {/* END OF CLOSE BUTTON */}
              </View>
              {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback onPress={() => previous()}>
                  <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => next()}>
                  <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
              </View>
              {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
              {
                content[current].title === "undefined"?
                 <></>
                :
                <>
                    <View style={{ position: "absolute", bottom: 0, width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
                <View Style={{ width: "90%", }}>
                  <Text style={{ color: "#000", marginBottom: 20, fontFamily: "Poppins-SemiBold", fontSize: 17, backgroundColor: "#fff", padding: 5, borderRadius: 5 }}>{content[current].title}</Text>
                </View>
              </View>
                </>


              }
          
            </View>
          </>
      }
      < RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={300}
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
        }}>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 50 }}>

          <View style={{ flexDirection: "row", width: "90%", marginTop: 15 }}>
            <TouchableOpacity onPress={() => handleDelete()}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Feather name="trash-2" size={20} color="#000" />
                <Text style={{ color: "#000", fontFamily: "Poppins-Medium", marginLeft: 10, fontSize: 16 }}>Delete Post</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});