import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  Pressable,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Animated, AppState } from "react-native";
import walletImage from "../../assets/walletImage.png";
import { LinearGradient } from "expo-linear-gradient";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SelectWallet from "./Modals/SelectWallet";
import "react-native-get-random-values";
import "@ethersproject/shims";
import NewWalletModal from "./Modals/newWallet";
import Icon from "react-native-vector-icons/FontAwesome";
var ethers = require("ethers");
const xrpl = require("xrpl");

const Wallet = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWalletModal, setNewWalletModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View>
      <View
        style={{
          height: hp(95),
          marginTop: "auto",
          backgroundColor: "#131E3A",
          borderRadius: 20,
        }}
      >
        <Animated.Image
          style={{
            width: wp("50"),
            height: hp("30"),
            padding: 30,
            marginTop: hp(10),
            marginLeft: wp(25),
            borderRadius: wp(10),
          }}
          source={walletImage}
        />
        <View
          style={{
            marginTop: hp(10),
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>
            Private and secure
          </Text>
          <Text style={{ color: "white" }}>
            Private Keys never leave your device
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
              navigation.navigate("MyWallet");
            }}>
        <View style={styles.wallet}>
          <Pressable onPress={() => {
              navigation.navigate("MyWallet");
            }}>
            <Text style={{color:"white"}}>My Wallet</Text>
          </Pressable>
          <Icon
          onPress={() => {
            navigation.navigate("MyWallet");
          }}
            name="chevron-right"
            size={hp("2")}
            color="white"
          />
        </View>
        </TouchableOpacity>
        <View style={styles.Button}>
          <LinearGradient
            start={[1, 0]}
            end={[0, 1]}
            colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
            style={styles.PresssableBtn}
          >
            <TouchableOpacity
            style={{width:wp(30),alignItems:"center"}}
              onPress={() => {
                setNewWalletModal(true);
              }}
            >
              <Text style={{color:"white"}}>Create wallet</Text>
            </TouchableOpacity>
          </LinearGradient>
          {/* <Button
            title="Create wallet"
            color={"green"}
            onPress={() => {
              setNewWalletModal(true);
            }}
          ></Button> */}

          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
          >
            <Text style={styles.Text}>I already have a wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SelectWallet
        visible={visible}
        setVisible={setVisible}
        setModalVisible={setModalVisible}
      />
      <NewWalletModal
        visible={newWalletModal}
        onCrossPress={()=>{setNewWalletModal(false)}}
        setVisible={setNewWalletModal}
        setModalVisible={setModalVisible}
      />
    </Animated.View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "red",
    width: wp(80),
  },
  Text: {
    marginTop: hp(1),
    fontSize: 15,
    fontWeight: "200",
    color: "white",
  },
  Button: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 40,
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButton2: {
    position: "absolute",
    zIndex: 11,
    left: 20,
    bottom: 40,
    backgroundColor: "green",
    width: 80,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  accountBox: {
    alignItems: "center",
    backgroundColor: "red",
    width: wp(80),
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: hp("2.3"),
    fontWeight: "bold",
    marginLeft: wp("20"),
  },
  PresssableBtn: {
    backgroundColor: "#4CA6EA",
    padding: hp(1),
    width: wp(30),
    alignSelf: "center",
    paddingHorizontal: wp(3),
    borderRadius: hp(0.8),
    marginBottom: hp(2),
    alignItems: "center",
  },
  wallet:{
    backgroundColor:"#4CA6EA",
    borderRadius:hp(1),
    flexDirection:"row",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:hp(2),
    width:wp(75),
    padding:hp(2)
  }
});
// transform:[{rotate:SpinValue}]
/*
import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, TextInput, FlatList, ScrollView,TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CreateWallet from './Modals/createWallet';

const Wallet = (props) => {
  const[modalVisible, setModalVisible] = useState(false)
  return (
    <View style={styles.container}>
      <View style={styles.accountBox} >
      <TouchableOpacity onPress={()=>{
        props.navigation.navigate('MyWallet')
      }}>
      <Text style={styles.text}>My Wallet</Text>
      <Icon name="chevron-right" size={hp('5')} color="white" style={{marginLeft:wp('63'), marginTop:hp('-4')}} />
      </TouchableOpacity>
      </View>
    <View style={styles.accountBox} >
    <TouchableOpacity  onPress={()=>{
      //props.navigation.navigate('CreateWallet')
      setModalVisible(true)

    }} >
      <Text style={styles.text}>Create Wallet</Text>
      <Icon name="chevron-right" size={hp('5')} color="white" style={{marginLeft:wp('65'), marginTop:hp('-4')}} />
      </TouchableOpacity>
    </View>
    <CreateWallet setModalVisible={setModalVisible} modalVisible={modalVisible} />
    </View>
  )
}

export default Wallet
const styles = StyleSheet.create({
    container:{
      display:'flex',
      backgroundColor:'white',
      height:hp('500'),
      width:wp('100'),
      

    },
    text:{
        color:'white',
        fontSize:hp('2.3'),
        fontWeight:'bold',
        fontFamily:'sans-serif',
        fontStyle:'italic',
        marginLeft:wp('20')
       
    },
    accountBox:{
        borderWidth:5,
        paddingTop:hp('2'),
        borderRadius:20,
        borderColor:'#131E3A',
        height:hp('9'),
        marginLeft:40,
        marginRight:40,
        marginTop:hp(20),
        backgroundColor:'#000C66',
        textAlign:'center',
        display:'flex',
        alignItems:'center'
    }
})
*/
