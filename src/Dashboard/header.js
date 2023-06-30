import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Icon from "../icon";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import IconWithCircle from "../Screens/iconwithCircle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import darkBlue from "../../assets/darkBlue.png";
import { REACT_APP_LOCAL_TOKEN } from "./exchange/crypto-exchange-front-end-main/src/ExchangeConstants";
export const ProfileHeader = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.iconContainer}>
        <Icon name="bell-o" size={20} color="black" type={"fa"} />
        <Icon name="sliders" type={"fa"} size={20} color="black" />
      </View>
      <Text style={styles.dollarText}>$0.00</Text>
      <View style={styles.textwithIcon}>
        <Text style={styles.textColor}>Main Wallet 1</Text>
        <Icon
          name="caretdown"
          type={"antDesign"}
          size={16}
          style={{ marginHorizontal: hp(0.7) }}
          color="gray"
        />
      </View>
      <View style={styles.iconsContainer}>
        <IconWithCircle name={"arrowup"} type={"antDesign"} title={"Send"} />
        <IconWithCircle
          name={"arrowdown"}
          type={"antDesign"}
          title={"Receive"}
        />
        <IconWithCircle
          name={"credit-card-outline"}
          type={"materialCommunity"}
          title={"Buy"}
        />
        <IconWithCircle
          name={"swap-horizontal"}
          type={"ionicon"}
          title={"Swap"}
        />
      </View>
      <View style={styles.iconmainContainer}>
        <View style={styles.iconTextContainer}>
          <Icon name="graph" type={"simpleLine"} size={hp(3)} />
          <Text style={{ marginHorizontal: hp(1) }}>
            Your Portfolio insights
          </Text>
        </View>
        <View style={styles.iconTextContainer}>
          <View style={styles.numberContainer}>
            <Text style={styles.number}>3</Text>
          </View>
          <Icon name="cross" type={"entypo"} size={hp(3.6)} color="black" />
        </View>
      </View>
    </View>
  );
};
export const ExchangeHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <Icon name={"left"} type={"antDesign"} size={20} color={"#fff"} onPress={() => {
          navigation.goBack();
        }}/>
      <Text style={{ color: "#fff", fontWeight: "700" }}>Exchange</Text>
      <View style={{ alignItems: "center" }}>
        <Icon
          name={"logout"}
          type={"materialCommunity"}
          size={20}
          color={"#E96A6A"}
          onPress={() => {
            const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
            AsyncStorage.removeItem(LOCAL_TOKEN);
            navigation.navigate("Settings");
          }}
        />
        <Text style={{ color: "#E96A6A" }}>Logout</Text>
      </View>
    </View>
  );
};

export const ExchangeHeaderIcon = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <Icon
        name={"left"}
        type={"antDesign"}
        size={20}
        color={"#fff"}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Image source={darkBlue} style={styles.logoImg} />
      {/* <Text style={{ color: "#fff", fontWeight: "700" }}>Exchange</Text> */}
      <View style={{ alignItems: "center" }}>
        <Icon
          name={"logout"}
          type={"materialCommunity"}
          size={20}
          color={"#E96A6A"}
          onPress={() => {
            const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
            AsyncStorage.removeItem(LOCAL_TOKEN);
            navigation.navigate("Settings");
          }}
        />
        <Text style={{ color: "#E96A6A" }}>Logout</Text>
      </View>
    </View>
  );
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
  logoImg: {
    height: hp("13"),
    width: wp("13"),
  },
});
