import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View,  TextInput, FlatList, TouchableOpacity, Alert} from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { Extend } from "../components/Redux/actions/auth";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated, LayoutAnimation, Platform, UIManager } from 'react-native';

const MyHeader = ({title, changeState, state, extended, setExtended}) => {
   state = useSelector((state) => state)
  const dispatch = useDispatch();

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);}
}
const fadeAnim = useRef(new Animated.Value(0)).current

const translation = useRef(
    new Animated.Value(0)
  ).current;


  const openExtended =()=>{
    changeState()
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
  }

  useEffect(async() => {
    Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 1000,
        }
      ).start();

    Animated.timing(translation, {
        toValue: 1,
        delay: 0.1,
        useNativeDriver: true,
      }).start(); 
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);


}, [])

  return (
    <Animated.View style={{    backgroundColor:'#131E3A', height:hp('15')}}>
    <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: hp('15'),
              backgroundColor:'#000C66',
              color:'#FFFFFF',
              borderBottomLeftRadius:30,
              borderBottomRightRadius:30
            }}>
            
            <Button color="#fff" labelStyle={{ fontSize: 24 }} icon="sort-reverse-variant" style={{marginTop:40}}  onPress={()=>openExtended()} >
              
            </Button>
              
            <Text  style={{marginTop:60, fontWeight:'bold', color:'#FFFFFF', marginRight:170, fontSize:22, fontFamily:'sans-serif'}}>{title}</Text>
           
          </View>
          </Animated.View> 
  )
}

export default MyHeader