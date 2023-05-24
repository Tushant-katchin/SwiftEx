import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import title_icon from "../../../assets/title_icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  CardItem,
  WebView,
} from "react-native-paper";
import Bnbimage from "../../../assets/bnb-icon2_2x.png";
import Etherimage from "../../../assets/ethereum.png";
import Xrpimage from "../../../assets/xrp.png";
import Maticimage from "../../../assets/matic.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import TokenHeader from "./TokenHeader";

//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const ChooseTokens = ({ setModalVisible }) => {
  const [Checked, setCheckBox] = useState(false);
  const [Checked2, setCheckBox2] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  let LeftContent = (props) => <Avatar.Image {...props} source={title_icon} />;
  let EtherLeftContent = (props) => (
    <Avatar.Image {...props} source={Etherimage} />
  );
  let BnbLeftContent = (props) => <Avatar.Image {...props} source={Bnbimage} />;
  let XrpLeftContent = (props) => <Avatar.Image {...props} source={Xrpimage} />;
  let MaticLeftContent = (props) => (
    <Avatar.Image {...props} source={Maticimage} />
  );

  const Wallets = [
    {
      name: "ethereum",
    },
    {
      name: "Binance smart chain",
      LeftContent: Bnbimage,
    },
    {
      name: "Xrp",
      LeftContent: Xrpimage,
    },
    {
      name: "Polygon(Matic)",
      LeftContent: Maticimage,
    },
  ];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);
  const SpinValue = Spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();

    Animated.timing(Spin, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, Spin]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <TokenHeader setVisible={setModalVisible} name={'Choose Wallet'}/>
      <ScrollView>
        <View style={style.Body}>
          <TouchableOpacity
            style={style.Box3}
            onPress={async () => {
              setModalVisible(false);
              const walletType = await AsyncStorageLib.getItem("walletType");
              const Type = JSON.parse(walletType);
              if (Type === "BSC" || Type ==='Multi-coin') {
              
              let token = "BNB";
              navigation.navigate("Send", {
                token: token,
              });
            }else{
              return alert('Please select a bnb wallet')
            }
            }}
          >
            <Card
              style={{
                width: wp(99),
                height: hp(10),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Card.Title
                titleStyle={{ color: "black" }}
                title={"BNB "}
                left={BnbLeftContent}
              />
              <Card.Content
                style={{ display: "flex", flexDirection: "row", color: "#fff" }}
              >
                <Title style={{ color: "#fff" }}></Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.Box2}
            onPress={async() => {
              setModalVisible(false);
              const walletType = await AsyncStorageLib.getItem("walletType");
              const Type = JSON.parse(walletType);
              if (Type === "Ethereum" || Type ==='Multi-coin') {
              
              let token = "Ethereum";
              navigation.navigate("Send", {
                token: token,
              });
            }else{
              return alert('please select an ethereum wallet')
            }
            }}
          >
            <Card
              style={{
                width: wp(99),
                height: hp(10),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Card.Title
                titleStyle={{ color: "black" }}
                title={"ethereum"}
                left={EtherLeftContent}
              />
              <Card.Content
                style={{ display: "flex", flexDirection: "row", color: "#fff" }}
              >
                <Title style={{ color: "#fff" }}></Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.Box2}
            onPress={async () => {
              setModalVisible(false);
              const walletType = await AsyncStorageLib.getItem("walletType");
              const Type = JSON.parse(walletType);
              if (Type === "Matic" || Type ==='Multi-coin') {
              
              let token = "Matic";
              navigation.navigate("Send", {
                token: token,
              });
            }else{
              return alert('Please select a matic wallet')
            }
            }}
            
          >
            <Card
              style={{
                width: wp(99),
                height: hp(10),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Card.Title
                titleStyle={{ color: "black" }}
                title={"Polygon(Matic)"}
                left={MaticLeftContent}
              />
              <Card.Content
                style={{ display: "flex", flexDirection: "row", color: "#fff" }}
              >
                <Title style={{ color: "#fff" }}></Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.Box2}
            onPress={async () => {
              setModalVisible(false);
              const walletType = await AsyncStorageLib.getItem("walletType");
              const Type = JSON.parse(walletType);
              if(Type==='Multi-coin'){
                let token = "Multi-coin-Xrp";
                navigation.navigate("Send", {
                  token: token,
                });
                return
              }
               else if(Type==='Xrp'){
                let token = "Xrp";
                navigation.navigate("Send", {
                  token: token,
                });
                return
              }else{
                return alert('Please select xrp wallet')
              }
            }}
          >
            <Card
              style={{
                width: wp(99),
                height: hp(10),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Card.Title
                titleStyle={{ color: "black" }}
                title={"Xrp"}
                left={XrpLeftContent}
              />
              <Card.Content
                style={{ display: "flex", flexDirection: "row", color: "#fff" }}
              >
                <Title style={{ color: "#fff" }}></Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default ChooseTokens;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(100),
    width: wp(100),
    alignItems: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "200",
    color: "black",
    marginTop: hp(5),
  },
  welcomeText2: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
  },
  Button: {
    marginTop: hp(10),
  },
  tinyLogo: {
    width: wp("5"),
    height: hp("5"),
    padding: 30,
    marginTop: hp(10),
  },
  Text: {
    marginTop: hp(5),
    fontSize: 15,
    fontWeight: "200",
    color: "white",
  },
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    color: "black",
    marginTop: hp("2"),
    width: wp("70"),
    paddingRight: wp("7"),
    backgroundColor: "white",
  },
  Box: {
    height: hp("15%"),
    width: wp("75"),
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
  },
  Box2: {
    height: hp("15%"),
    width: wp("75"),
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(1),
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
  },
  Box3: {
    height: hp("15%"),
    width: wp("75"),
    fontSize: 20,
    fontWeight: "200",
    color: "white",
    marginTop: hp(2),
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
  },
});
