import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
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
import maticImage from "../../../assets/matic.png";
import xrpImage from "../../../assets/xrp.png";
import Modal from "react-native-modal";
import RecieveAddress from "./ReceiveAddress";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import ModalHeader from "../reusables/ModalHeader";
import { alert } from "../reusables/Toasts";
//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const RecieveModal = ({ modalVisible, setModalVisible }) => {
  const [visible, setVisible] = useState(false);
  const [iconType, setIconType] = useState("");
  const dispatch = useDispatch();

  let EtherLeftContent = (props) => (
    <Avatar.Image {...props} source={Etherimage} />
  );
  let BnbLeftContent = (props) => <Avatar.Image {...props} source={Bnbimage} />;
  let maticLeftContent = (props) => (
    <Avatar.Image {...props} source={maticImage} />
  );

  let xrpLeftContent = (props) => <Avatar.Image {...props} source={xrpImage} />;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Spin = new Animated.Value(0);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutRight"
        // animationInTiming={500}
        // animationOutTiming={650}
        isVisible={modalVisible}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        // backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onModalHide={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => {
          setModalVisible(false);
        }}
      >
        <View style={style.Body}>
          {/* <ModalHeader Function={closeModal} name={'Receive'}/> */}
          <Text style={{marginTop:hp(4),fontSize:16,color:"#4CA6EA"}}>Receive</Text>
          <TouchableOpacity
            style={style.Box3}
            onPress={async () => {
              const walletType = await AsyncStorageLib.getItem("walletType");
              if (
                JSON.parse(walletType) === "BSC" ||
                JSON.parse(walletType) === "Multi-coin"
              ) {
                setTimeout(() => {
                  setVisible(true);
                }, 0);

                setIconType("BNB");
              }else{
                
                alert("error",'Please select BNB wallet to recieve BNB')
              }
            }}
          >
            <View style={style.flatView}>
              <Image source={Bnbimage} style={style.img} />
              <Text style={{ marginHorizontal: wp(4) }}>BNB</Text>
              <View>
                <Title style={{ color: "#fff" }}></Title>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.Box3}
            onPress={async() => {
              const walletType = await AsyncStorageLib.getItem('walletType')
              if(JSON.parse(walletType)==="Ethereum"|| JSON.parse(walletType)==="eth" || JSON.parse(walletType)==="Multi-coin"){
              setTimeout(() => {
                setVisible(true);
              }, 0);
              setIconType("ETH");
            }else{
              alert('error','please select ETH wallet to recieve ETH tokens')
            }
            }}
          >
            <View style={style.flatView}>
              <Image source={Etherimage} style={style.img} />

              <Text style={{ marginHorizontal: wp(4) }}>Ethereum</Text>

              <View>
                <Title style={{ color: "#fff" }}></Title>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.Box3}
            onPress={async() => {
              const walletType = await AsyncStorageLib.getItem('walletType')
              if(JSON.parse(walletType)==="Matic" || JSON.parse(walletType)==="Multi-coin"){
              setTimeout(() => {
                setVisible(true);
              }, 0);
              setIconType("Matic");
            }else{
              alert('error','please select a polygon wallet to recieve matic')
            }
            }}
          >
            <View style={style.flatView}>
              <Image source={maticImage} style={style.img} />
              <Text style={{ marginHorizontal: wp(4) }}>Matic</Text>
              <View>
                <Title style={{ color: "#fff" }}></Title>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.Box3}
            onPress={async() => {
              const walletType = await AsyncStorageLib.getItem('walletType')
              if(JSON.parse(walletType)==="Xrp" || JSON.parse(walletType)==='Multi-coin'){
              setTimeout(() => {
                setVisible(true);
              }, 0);
              setIconType("Xrp");
            }else{
              alert('error','please select an xrp wallet to recieve xrp')
            }
            }}
          >
            <View style={style.flatView}>
              <Image source={xrpImage} style={style.img} />

              <Text style={{ marginHorizontal: wp(4) }}>XRP</Text>
              <View>
                <Title style={{ color: "#fff" }}></Title>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={style.walletText}>Please select a wallet type</Text>
        </View>

        <RecieveAddress
          modalVisible={visible}
          setModalVisible={setVisible}
          iconType={iconType}
        />
      </Modal>
    </Animated.View>
  );
};

export default RecieveModal;

const style = StyleSheet.create({
  flatView: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(2),
  },
  img: { height: hp(5), width: wp(10), borderRadius: hp(3) },
  walletText: {
    marginTop: hp(4),
    fontSize: 14,
    color:"white"
  },
  Body: {
    display: "flex",
    backgroundColor: "#131E3A",
    height: hp(83),
    width: wp(95),
    borderRadius:hp(2),
    alignItems: "center",
  alignSelf:"center",
    borderWidth:1
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
    width: wp(90),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: hp(1),
    backgroundColor:"#F0F8FF",
    paddingVertical: hp(1.5),
    marginTop: hp(2),
  },
});
