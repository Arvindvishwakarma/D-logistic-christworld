import { View, Text, StyleSheet,Image } from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';
import { useState } from 'react';

export default function IntroScreen() {

    const slides = [
        {
          key: 'one',
          title: 'Christ World',
          text: '" Jesus saith unto him,I am the way, the truth, and the life: no man cometh unto the Father, but by me. "',
          image: require('../assets/Img/juses.png'),
          backgroundColor: '#fff',
        },
        {
          key: 'two',
          title: 'Christ World',
          text: 'Christ World is a social platform for believers to share their love for Jesus Christ, find peace through fellowship, praise, and worship, and offer support and encouragement to each other. It is a place where devotion to the Savior is expressed wholeheartedly.',
          image: require('../assets/Img/pray.png'),
          backgroundColor: '#0abde3',
        },
        {
          key: 'three',
          title: 'Christ World',
          text: 'Christ World is a platform dedicated to fostering a community centered around faith, love, and the teachings of Jesus Christ. Creating a space for fellowship, support, and encouragement among believers is a wonderful way to share the message of love and find strength in one is faith. If there is anything specific you did like to discuss or explore regarding this platform or its purpose, feel free to ask!',
          image:require('../assets/Img/speack.png'),
          backgroundColor: '#fff',
        }
      ];

     const[showRealApp,setShowRealApp] =useState(false)

    const  _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        setShowRealApp(true)
      }

      
    const  _onSkip = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        setShowRealApp(true)
      }

     const _renderItem = ({ item }) => {
        return (
          <View  style={{backgroundColor:item.backgroundColor,flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{marginBottom:10,color:"#000", fontFamily: "Poppins-Bold"}}>{item.title}</Text>
            <Image source={item.image} style={{width:200,height:200}} />
            <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <View style={{width:"80%",marginTop:15}}>
                <Text style={{textAlign:"center",color:"#000"}} >{item.text}</Text>
                </View>

            </View>
           
          </View>
        );
      }

      const  _renderNextButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="md-arrow-round-forward"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </View>
        );
      };

    const _renderDoneButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="md-checkmark"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </View>
        );
      };

      const buttonLabel =(label)=>{
        return(
          <View style={{padding:12}}>
            <Text style={{color:"#000",fontWeight:"600",fontSize:18}}>{label}</Text>
          </View>
        )
      }

  return (
    <AppIntroSlider renderItem={_renderItem} data={slides} 
    activeDotStyle={{
      backgroundColor:"#0097e6",
      width:30
    }}
    onDone={_onDone}
    showSkipButton
     renderNextButton={()=>buttonLabel("Next")}
     renderSkipButton={()=>buttonLabel("Skip")}
     renderDoneButton={()=>buttonLabel("Done")}
    />
  )
}

const styles = StyleSheet.create({
    buttonCircle: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 0, 0, .2)',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    //[...]
  });