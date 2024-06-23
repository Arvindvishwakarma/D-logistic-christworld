import React, { createContext, useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useMutation } from '@apollo/client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { MUTATION_UPDATE_USER_PROFILE, MUTATION_USER_LOGIN, MUTATION_USER_UPDATE } from '../../GraphqlOperation/Mutation';
import messaging from '@react-native-firebase/messaging';
import { QUERY_GET_USER_BY_ID } from '../../GraphqlOperation/Query';
import PushNotification, { Importance } from 'react-native-push-notification';
import * as Progress from 'react-native-progress';




export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

    const [loginError, setLoginError] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [emptyError, setEmptyError] = useState(false);
    const [deviceToken, setDevieToken] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getDeviceToken()
    })

    const getDeviceToken = async () => {
        let token = await messaging().getToken();
        console.log(token)
        setDevieToken(token)
    }


    const [userLogin, { data: userData, loading: userLoginLoading }] = useMutation(MUTATION_USER_LOGIN, {
        onError(error) {
            setLoginError(true);
        },
    })


    const [updateUser] = useMutation(MUTATION_USER_UPDATE, {
        refetchQueries: [
            QUERY_GET_USER_BY_ID,
            "getUserById"
        ]
    })


    const [breakIf, setBreakIf] = useState(true)

    const [splashLoading, setSplashLoading] = useState(false)

    const loginHandel = async (email, password,) => {
        Keyboard.dismiss();
        if (email === "" || password === "") {
            showMessage({
                message: "All Field is Required",
                type: "danger",
            });
        } else {

            setEmptyError(false);
            setBreakIf(true);
            setLoginError(false);
            userLogin({
                variables: {
                    "email": `${email}`,
                     "password": `${password}`

                }
            });
           
        }
    }
    if (userData && breakIf) {
        AsyncStorage.setItem('userId', userData.userLogin.userId);
        AsyncStorage.setItem('userToken', userData.userLogin.userToken);
        setUserInfo(userData.userLogin.userToken);
        setBreakIf(false);
            updateUser({
                variables: {
                    "userUpdateInput": {
                        "id": `${userData.userLogin.userId}`,
                        "deviceToken": `${deviceToken}`,
                      }
                }
            })
       
    }


    console.log("userData",userData)

  

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true)
            let userInfo = await AsyncStorage.getItem('userToken');

            if (userInfo) {
                setUserInfo(userInfo)
            }
            setSplashLoading(false)
        } catch (e) {
            setSplashLoading(false)
        }
    }


    useEffect(() => {
        isLoggedIn();
    }, [])


    const createChannel = (channelId) => {
        PushNotification.createChannel(
          {
            channelId: channelId, // (required)
            channelName: "My channel", // (required)
            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            priority: 'high',
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
      const showNotification = (channelId, title, message, options) => {
        PushNotification.localNotification({
          channelId: channelId,
          title: title,
          message: message,
          vibrate: true,
          priority: 'high',
          importance: Importance.HIGH,
        });
      }
    
      useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMsg => {
          const channelId = Math.random().toString(36).substring(7);
          createChannel(channelId);
          showNotification(channelId, remoteMsg.notification.title, remoteMsg.notification.body);
          console.log('remoteMsg', remoteMsg);
        });
    
        messaging().setBackgroundMessageHandler(async remoteMsg => {
          console.log('remote background', remoteMsg)
        });
    
        return unsubscribe;
      }, []);
    

    console.log("Token", userData)
    console.log("setToken", userInfo)



    const logOut = async () => {
        await setUserInfo();
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
    }



    return (
        <AuthContext.Provider value={{
            loginHandel,
            emptyError,
            userLoginLoading,
            userInfo,
            loginError,
            logOut,
            splashLoading,
            Progress,
            uploadProgress,
            setUploadProgress,
            uploading,
            setUploading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}