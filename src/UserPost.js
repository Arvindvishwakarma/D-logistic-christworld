import { View, Text, StatusBar, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, TextInput, Dimensions, FlatList } from 'react-native'
import React, { useRef } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Card, List } from 'react-native-paper';
import { useState } from 'react';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import
MediaControls, { PLAYER_STATES }
    from 'react-native-media-controls';
import Stories from "react-native-stories-instagram";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_POST, QUERY_ALL_STATUS, QUERY_GET_ALL_USER, QUERY_GET_POST_BY_USER_ID, QUERY_GET_USER_BY_ID } from '../GraphqlOperation/Query';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MUTATION_CREATE_DISLIKE_POST, MUTATION_CREATE_LIKE_POST, MUTATION_DELETE_POST } from '../GraphqlOperation/Mutation';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'react-moment';
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-crop-picker';
import logo from "../assets/Img/Picture1.png"
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;

let limit = 10;


export default function UserPost({ route, navigation }) {

    const { userPostData } = route.params;

    console.log("userPostData", userPostData)

    


    const [state, setState] = useState(false)
    const [skip, setSkip] = useState(0)

    const ITEM_HEIGHT = width * 1.2;

    let query = `?skip=${skip}&limit=${limit}`
    const { data: Postdata, loading: postLoading } = useQuery(QUERY_ALL_POST, {
        variables: {

        }
    })
    console.log("Postdata", Postdata)
    const [loading, setLoading] = useState(false)

    // if(postLoading){
    //   setLoading(true)
    // }else{
    //   setLoading(false)
    // }



    const [stories, setStories] = useState([])

    const { data: dataStatus } = useQuery(QUERY_ALL_STATUS)

    console.log("dataStatus", dataStatus)

    useEffect(() => {
        dataStatus && dataStatus.getAllStatus.slice().reverse().map(item => {
            return (
                setStories(stories => [...stories, {
                    username: `${item.username}`,
                    title: `${item.username}`,
                    profile: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.profile}`,
                    stories: [
                        item.stories.map(list => {
                            return (
                                {
                                    id: `${list.id}`,
                                    url: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${list.url}`,
                                    type: `${list.fileType}`,
                                    duration: 2,
                                    isReadMore: true,
                                    url_readmore: "https://github.com/iguilhermeluis",
                                    created: `${list.createDateTime}`,
                                }
                            )
                        })



                    ]
                }])
            )
        })

    }, [dataStatus])



    console.log("stories", stories)

    const refRBSheet = useRef();
    const refRBAssetSheet = useRef()

    const refs = useRef();


    const data = [
        {
            username: "Guilherme",
            title: "Title story",
            profile:
                "https://avatars2.githubusercontent.com/u/26286830?s=460&u=5d586a3783a6edeb226c557240c0ba47294a4229&v=4",
            stories: [
                {
                    id: 1,
                    url:
                        "https://images.unsplash.com/photo-1532579853048-ec5f8f15f88d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
            ],
        },
        {
            username: "Bruno",
            profile: "https://avatars2.githubusercontent.com/u/45196619?s=460&v=4",
            title: "Travel",
            stories: [
                {
                    id: 0,
                    url:
                        "https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 1,
                    url: "https://www.w3schools.com/html/mov_bbb.mp4",
                    type: "video",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 2,
                    url:
                        "https://images.unsplash.com/photo-1476292026003-1df8db2694b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: false,
                    url_readmore: "",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 3,
                    url:
                        "https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                },
            ],
        },
        {
            username: "Steve Jobs",
            profile:
                "https://s3.amazonaws.com/media.eremedia.com/uploads/2012/05/15181015/stevejobs.jpg",
            title: "Tech",
            stories: [
                {
                    id: 1,
                    url:
                        "https://images.unsplash.com/photo-1515578706925-0dc1a7bfc8cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 3,
                    url:
                        "https://images.unsplash.com/photo-1496287437689-3c24997cca99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,

                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 4,
                    url:
                        "https://images.unsplash.com/photo-1514870262631-55de0332faf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,

                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
            ],
        },
        {
            username: "Jacob",
            profile:
                "https://images.unsplash.com/profile-1531581190171-0cf831d86212?dpr=2&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff",
            title: "News",
            stories: [
                {
                    id: 4,
                    url:
                        "https://images.unsplash.com/photo-1512101176959-c557f3516787?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 5,
                    url:
                        "https://images.unsplash.com/photo-1478397453044-17bb5f994100?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
                    type: "image",
                    duration: 2,

                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
                {
                    id: 4,
                    url:
                        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=581&q=80",
                    type: "image",
                    duration: 2,
                    isReadMore: true,
                    url_readmore: "https://github.com/iguilhermeluis",
                    created: "2021-01-07T03:24:00",
                },
            ],
        },
    ];


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

    
    const {data: dataPost, loading: loadingPost} =  useQuery(QUERY_GET_POST_BY_USER_ID,{
        variables:{
            userId: `${userId}`,
        },
        pollInterval: 500,
    })




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

    console.log("userData",userData)

    
    const handleLike = (id) => {
        createLikePost({
            variables: {
                "userLikePostInput": {
                    "postId": `${id}`,
                    "likes": [
                        {
                            "userId": `${userId}`,
                            "firstName": `${userData && userData.getUserById.firstName}`,
                            "lastName": `${userData && userData.getUserById.lastName}`,
                            "avatar": `${userData && userData.getUserById.coverPic}`,
                            "createdDateTime": "null",
                            "status": "pending"
                        }
                    ]
                }
            }
        })




    }

    const [postIdState, setPostId] = useState('')

    const handleDislike = (id, itemData) => {
        setPostId(id)
        const userIdFilter = itemData.like.filter(uId => {
            return uId.userId === userId
        });

        console.log(userIdFilter[0].id)
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

    const REMOTE_IMAGE_PATH =
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png'

    console.log("REMOTE_IMAGE_PATH", REMOTE_IMAGE_PATH)

    const [getImgUri, setGetImgUri] = useState("")
    console.log("getImgUri", getImgUri)

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

    console.log("storeData", storeData)
    console.log("postUpdateId", postUpdateId)

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
            console.log(image);
            setFile(image.path)
            setFileType("video")
            setCheck(true)
        });
    }

    const handleImage = () => {
        ImagePicker.openPicker({
            width: 320,
            height: 500,
            cropping: true
        }).then(image => {
            console.log(image);
            setFile(image.path)
            setFileType("image")
            setCheck(true)

        });
    }

    const handleUpload = () => {
        navigation.navigate("Story", { fileType: fileType, file: file })

    }

    const [check, setCheck] = useState(false)
    const handleCancel = () => {
        setCheck(false)
    }



    console.log("fileType", fileType)


    console.log("file", file)

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

    const [clickId, setClickId] = useState(false)
    function handleClick(id) {
        setClickId(id)
        setClick(false)
    }


    const renderItem = ({ item }) => {
        return (
            <View style={{ width: "100%", marginBottom: 30, }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                    {/*  Post User Profile  */}
                    <View style={{ flexDirection: "row" }}>
                        {
                            item.avatar === null ?
                                <Image source={{ uri: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 10, marginLeft: 10, borderWidth: 1, borderColor: "#000" }} />
                                :
                                <Image source={{ uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.avatar}` }} style={{ width: 50, height: 50, borderRadius: 100, marginTop: 10, marginLeft: 10, borderWidth: 1, borderColor: "#000" }} />
                        }
                        <View style={{ flexDirection: "column", marginTop: 15, marginLeft: 10, }}>
                            <Text style={{ fontWeight: "700", color: "#000", }}>{item.firstName} {item.lastName}</Text>
                            <Text style={{ color: "gray", fontFamily: "Poppins-Medium", fontSize: 12 }}>Create Date: <Moment element={Text} format='DD-MM-YYYY hh:mm:ss'>{item.createdDateTime}</Moment></Text>
                        </View>
                    </View>
                    <View>
                        {
                            item.userId === userId ?
                                <TouchableOpacity onPress={() => handleOpen(item, item.id)}>
                                    <Feather name="more-horizontal" style={{ marginRight: 20, marginTop: 20, color: "#000" }} size={25} />
                                </TouchableOpacity>
                                :
                                <></>
                        }
                    </View>
                </View>
                <View style={{ width: "90%", marginLeft: 10, marginTop: 5 }}>
                    {
                        item.caption === "undefined" ?
                            <></>
                            :
                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#000" }}>{item.caption}</Text>
                    }
                </View>
                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                    {/* Post type  */}
                    {
                        item.fileDetails.map(List => {
                            return (
                                <>
                                    {
                                        List.filetype === "video" ?
                                            <>
                                                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", aspectRatio: 1, marginTop: 30 }}>
                                                    <TouchableOpacity onPress={() => setClick(item.id)}>
                                                        <View style={{ width: "100%", height: "100%" }}>
                                                            {

                                                                item.id === getId && pause === false ?
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
                                                                            item.id === clickId && click === true ?
                                                                                <TouchableOpacity style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0 }} onPress={() => handleClick(item.id)}>
                                                                                    <TouchableOpacity onPress={() => handlePause(item.id)}>
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

                                                                            onFullScreen="content"
                                                                            resizeMode='cover'
                                                                            onBuffer={onBuffer}
                                                                            onLoadStart={onLoadStart}
                                                                            onLoad={() => seStateLoading(true)}
                                                                            onEnd={() => seStateLoading(false)}
                                                                        />
                                                                        {
                                                                            click ?
                                                                                <TouchableOpacity style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0 }} onPress={() => handleClick(item.id)}>
                                                                                    <TouchableOpacity onPress={() => handlePlay(item.id)}>
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
                    {/*  Post Like , Share ,Download */}

                    <View style={{ flexDirection: "row", width: "90%", marginTop: 10, marginBottom: 10, justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            {
                                item.id === postIdState ?
                                    likePostLoading ?
                                        <ActivityIndicator color="#000" size="small" /> :
                                        dislikePostLoading ?
                                            <ActivityIndicator color="#000" size="small" /> :
                                            <View style={{ flexDirection: "row" }}>
                                                {

                                                    item.like.some(obj => obj.userId === userId) ?
                                                        <TouchableOpacity onPress={() => handleDislike(item.id, item)}>
                                                            <FontAwesome name="heart" size={25} color="#e74c3c" />
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => handleLike(item.id)}>
                                                            <Feather name="heart" size={25} color="#000" />
                                                        </TouchableOpacity>
                                                }
                                                <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }}>{formatnumber(item.like.length)}</Text>
                                            </View> :
                                    <View style={{ flexDirection: "row" }}>
                                        {

                                            item.like.some(obj => obj.userId === userId) ?
                                                <TouchableOpacity onPress={() => handleDislike(item.id, item)}>
                                                    <FontAwesome name="heart" size={25} color="#e74c3c" />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => handleLike(item.id)}>
                                                    <Feather name="heart" size={25} color="#000" />
                                                </TouchableOpacity>
                                        }
                                        <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }} >{formatnumber(item.like.length)}</Text>
                                    </View>
                            }
                            <TouchableOpacity onPress={() => navigation.navigate("Comment", { comment: item.comment, postId: item.id, captionData: item.caption, avatarData: item.avatar, fistNm: item.firstName, lastNm: item.lastName })}>
                                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                                    <Feather name="message-circle" size={25} color="#000" />
                                    <Text style={{ marginLeft: 5, marginTop: 5, color: "#000", fontFamily: "Poppins-Medium" }}>{formatnumberComment(item.comment.length)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                            <TouchableOpacity onPress={() => checkPermission(`https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`)}>
                                <Feather name="download" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }



    const renderLoader = () => {
        return (

            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    const loadMoreItem = () => {
        // ("End reached")alert
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }



    const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return contentOffset.y == 0;
    }



    return (
        <View style={{ backgroundColor: "#fff", height: "100%" }}>
         
                    <ScrollView
                onResponderMove={() => { console.log('outer responding'); }}
                onScroll={({ nativeEvent }) => {
                    setPause(true)
                    if (ifCloseToTop(nativeEvent)) {
                        console.log("top", nativeEvent)
                        setPause(true)
                    }
                    if (isCloseToBottom(nativeEvent)) {
                        console.log("bottom", nativeEvent)
                        setPause(true)
                    }
                }}>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Feather name="arrow-left" size={20} style={{ marginLeft: 10, color: "#000", marginTop: 5 }} />
                    <Text style={{ marginLeft: 10, fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#000" }}>Post  </Text>
                </View>
                {
                     userPostData && userPostData.getPostByUserId.length === 0 ?
                     <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontFamily: "Poppins-SemiBold",marginTop:50,color:"#000"}}>No Post Available</Text>
    
                     </View>
                     :
                     <View style={{ flexDirection: "column" }}>
                     <View style={{ flexDirection: "column", width: "100%" }}>
                         <FlatList
                             data={dataPost && dataPost.getPostByUserId.slice().reverse()}
                             renderItem={renderItem}
                             keyExtractor={item => item.id}
                             ListFooterComponent={renderLoader}
                             onEndReached={loadMoreItem} />
                     </View>
                 </View>

                }
               
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


         
        </View>
    )
}