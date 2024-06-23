import React,{ useEffect ,useRef,useState } from 'react';
import { View, PanResponder, Animated, Alert,Dimensions ,Text} from 'react-native';
export default function Test() {

  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Check if the movement is from left to right
        if (gestureState.dx > 0) {
          animateTranslateShow()
          // Call your function here
        } if (gestureState.dx < 0) {
          animateTranslateHide()
           // Call your function here
         }
      },
    })
  ).current;


  const animateTranslateShow = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      Animated.parallel([
      Animated.timing(translateX, {
        toValue: 160,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue:1.5, // Scale to double the size
        duration: 300, // Duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),

      ]).start(() => {
        setIsAnimating(false);
      });
    }
  };
  const animateTranslateHide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    }
  };


  return (
    <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightblue',
    }}
    {...panResponder.panHandlers}
  >
    <Animated.View style={{position:"absolute",width:"100%",height:"100%",backgroundColor:"#fff", transform: [{translateX},{scale}]}}>
           <Text>fsfds</Text>
    </Animated.View>
      

  </View>
  )
}
