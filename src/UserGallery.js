import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useQuery} from '@apollo/client';
import {QUERY_GET_POST_BY_USER_ID} from '../GraphqlOperation/Query';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserGallery({route, navigation}) {
  const {userPostData} = route.params;

  console.log('userPostData', userPostData);
  let numColumns = 3;

  const [userId, setUserId] = useState();

  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => setUserId(id));
  }, []);

  const {data: dataPost, loading: loadingPost} = useQuery(
    QUERY_GET_POST_BY_USER_ID,
    {
      variables: {
        userId: `${userId}`,
      },
      pollInterval: 500,
    },
  );

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Feather
          name="arrow-left"
          size={20}
          style={{marginLeft: 10, color: '#000', marginTop: 5}}
        />
        <Text
          style={{
            marginLeft: 10,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
            color: '#000',
          }}>
          Photo & Video
        </Text>
      </View>
      <View>
     
                    <FlatList
                      data={dataPost && dataPost.getPostByUserId}
                      renderItem={({item}) => (
                        <>
                       {
                           item.fileDetails.length === 0 ?
                           <></>

                           :
                           <>
                            <View
                          style={{
                            width: '30%',
                            backgroundColor: '#000',
                            marginLeft: 10,
                            height: 100,
                            marginTop: 10,
                          }}>
                          <TouchableOpacity>
                            <View style={{width: '100%', height: '100%'}}>
                              {item.fileDetails[0].filetype === 'image' ? (
                                <Image
                                  source={{
                                    uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`,
                                  }}
                                  style={{width: '100%', height: 100}}
                                />
                              ) : (
                                <View>
                                  <Video
                                    source={{
                                      uri: `https://byaahlagan-profile-image.s3.us-east-2.amazonaws.com/${item.fileDetails[0].file}`,
                                    }}
                                    // }}
                                    // source={{uri:"https://player.vimeo.com/progressive_redirect/playback/804718450/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=b7be81730887edd3a81cbfe091afb65f4d5fa5080921027c35692787ba6588d4"}}
                                    style={{
                                      aspectRatio: 1,
                                      width: '100%',
                                    }}
                                    paused={true}
                                    onFullScreen="content"
                                    resizeMode="cover"
                                  />
                                  <View
                                    style={{
                                      position: 'absolute',
                                      height: '100%',
                                      width: '100%',
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                      }}>
                                      <AntDesign
                                        name="caretright"
                                        color="#fff"
                                        size={15}
                                        style={{marginRight: 5, marginTop: 5}}
                                      />
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                           
                           </>

                       }


                       
                        </>
                      )}
                      //Setting the number of column
                      numColumns={numColumns}
                      keyExtractor={item => item.id}
                    />
                 
              
         
      </View>
    </View>
  );
}
