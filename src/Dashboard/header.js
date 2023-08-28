import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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
import { width } from "@mui/system";

export const ExchangeHeader = (props) => {
  const navigation = useNavigation();
  const { isLogOut = true } = props;
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
      <Text style={{ color: "#fff", fontWeight: "700" }}>Exchange</Text>
      {isLogOut ? (
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
      ) : (
        <Text style={{ width: "10%" }}>{""}</Text>
      )}
    </View>
  );
};

export const WalletHeader = (props) => {
  const { title, title1, IconName, IconType } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.walletContainer} onPress={() => {
      navigation.goBack();
    }}>
      <Icon
        name={"left"}
        type={"antDesign"}
        size={20}
        color={"#fff"}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text style={styles.text1}>{title}</Text>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#E96A6A" }}>{title1}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const SwapHeader = (props) => {
  const { title, title1, setVisible } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.walletContainer} onPress={() => {
      setVisible(false)
    }}>
      <Icon
        name={"left"}
        type={"antDesign"}
        size={20}
        color={"#fff"}
        onPress={() => {
          setVisible(false)
        }}
      />
      <Text style={styles.text1}>{title}</Text>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#E96A6A" }}>{title1}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ExchangeHeaderIcon = (props) => {
  const { title, isLogOut=true  } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.headerContainer1}>
      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          name={"left"}
          type={"antDesign"}
          size={20}
          color={"#010C66"}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Image source={darkBlue} style={styles.logoImg} />
      </View>
      <Text style={styles.text}>{title}</Text>

      { isLogOut ? <View style={{ alignItems: "center" }}>
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
      </View> :  <Text style={{ width: "10%" }}>{""}</Text>}
    </TouchableOpacity>
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
  headerContainer1: {
    backgroundColor: "#4CA6EA",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: wp(100),
    paddingHorizontal: wp(2),
  },
  walletContainer: {
    backgroundColor: "#4CA6EA",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: hp(2),
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
    marginRight: wp(10),
  },
  text1: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    textAlign: "center",
    marginRight: wp(10),
  },
});
