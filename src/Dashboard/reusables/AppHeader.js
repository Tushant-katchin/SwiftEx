import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Icon from "../../icon";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import darkBlue from "../../../assets/darkBlue.png";
import { REACT_APP_LOCAL_TOKEN } from "../exchange/crypto-exchange-front-end-main/src/ExchangeConstants";

export const AppHeader = ({name}) => {
  const navigation = useNavigation();


  return (
    <View style={styles.headerContainer1}>
      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        
        <Image source={darkBlue} style={styles.logoImg} />
      </View>
      <Text style={styles.text}>{name}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    height: hp(47),
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(40),
    alignSelf: "center",
    marginTop: hp(3),
  },
  dollarText: {
    textAlign: "center",
    color: "black",
    fontSize: 30,
    marginTop: hp(3),
  },
  textwithIcon: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2),
  },
  textColor: {
    color: "gray",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(5),
  },
  iconTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconmainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: hp(42),
    alignSelf: "center",
    marginTop: hp(5),
    height: hp(9),
    alignItems: "center",
    borderRadius: hp(2),
    padding: hp(2),
    backgroundColor: "#e8f0f8",
  },
  numberContainer: {
    backgroundColor: "#9bbfde",
    width: hp(4.3),
    height: hp(4.3),
    borderRadius: hp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#145DA0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: hp(10),
  },
  headerContainer: {
    backgroundColor: "#010C66",
    height: hp(10),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: wp(100),
    paddingHorizontal: wp(5),
  },
  headerContainer1: {
    backgroundColor: "#4CA6EA",
    justifyContent:'flex-start',
   
    flexDirection: "row",
    width: wp(100),
    paddingHorizontal: wp(2),
  },
  logoImg: {
    height: hp("9"),
    width: wp("12"),
    marginLeft: wp(1.5),
  },
  text: {
    color: "#010C66",
    fontWeight: "700",
    alignSelf: "center",
    textAlign: "center",
    marginLeft: wp(28),
    fontSize:17,
  },
});
