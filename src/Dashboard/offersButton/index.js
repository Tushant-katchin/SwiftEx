import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native'

const OffersButton = (props) => {
  const { onPress, value = "Bid" | "My Offers", jumpTo} = props;
  const navigation= useNavigation()
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const inActiveColor = ["#131E3A", "#131E3A"];

  const [offers, setOffers] = useState(value ? value : "Bid");

  return (
    <View style={[styles.toggleContainer]}>
      <LinearGradient
        colors={offers == "Bid" ? activeColor : inActiveColor}
        style={{borderRadius:5}}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.toggleBtn,
            offers == "Bid" ? { borderRadius: hp(4) } : { borderRadius: null },
          ]}
          onPress={() => {
            // navigation.navigate("first");
            setOffers("Bid");
            onPress && onPress("Bid");
          }}
        >
          <Text
            style={[offers == "Bid" ? { color: "#fff" } : { color: "#407EC9" }]}
          >
            Bid
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={offers == "My Offers" ? activeColor : inActiveColor}
        
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.toggleBtn2]}
          onPress={() => {
            // navigation.navigate("second");
            setOffers("My Offers");
            onPress && onPress("My Offers");
          }}
        >
          <Text
            style={[
              offers == "My Offers" ? { color: "#fff" } : { color: "#407EC9" },
            ]}
          >
            My Offers
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  toggleContainer: {
    alignSelf: "center",
    marginTop: hp(1),
    borderColor: "#407EC9",
    borderWidth: StyleSheet.hairlineWidth * 1,
    flexDirection: "row",
    borderRadius:5
  },
  toggleBtn: {
    width: wp(43),
    justifyContent: "space-around",
    alignItems: "center",
    height: hp(6),
    flexDirection: "row",
    alignSelf: "center",
  },
  toggleBtn2: {
    width: wp(43),
    height: hp(6),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
});
export default OffersButton;




