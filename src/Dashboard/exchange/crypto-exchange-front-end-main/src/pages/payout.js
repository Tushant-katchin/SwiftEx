import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, TextInput, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Icon from "../../../../../icon";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { REACT_APP_HOST, REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import { useSelector } from "react-redux";
import Bridge from "../../../../../../assets/Bridge.png";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRef } from "react";
import { ScrollView } from "native-base";
import { useEffect } from "react";
const StellarSdk = require('stellar-sdk');

const Payout = () => {
  const Assets = [
    { name: "USDC", address: "1234567890987654" },
    { name: "EURC", address: "1234567890987654" },
    { name: "ETH", address: "1234567890987654" },
    { name: "BTC", address: "1234567890987654" },
    { name: "MATIC", address: "1234567890987654" },
    { name: "XRP", address: "1234567890987654" },
    { name: "BNB", address: "1234567890987654" }
  ];
  const Anchors = [
    { name: "SwiftEx", address: "1234567890987654" },
    { name: "APS", address: "1234567890987654" },
    { name: "BILIRA", address: "1234567890987654" },
    { name: "ALFRED", address: "1234567890987654" },
    { name: "ANCLAP", address: "1234567890987654" },
    { name: "ARF", address: "1234567890987654" },
    { name: "BNB", address: "1234567890987654" }
  ];
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const state = useSelector((state) => state);
  const [modalContainer_menu, setmodalContainer_menu] = useState(false);
  const [select_asset_modal, setselect_asset_modal] = useState(true);
  const [search_text, setsearch_text] = useState("");
  const AssetViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [show_anchors,setshow_anchors]=useState(false);
  const [kyc_modal_text,setkyc_modal_text]=useState("Fetching stellar.toml");
  const [kyc_modal,setkyc_modal]=useState(false);
  const [modal_load,setmodal_load]=useState(false);
  const [radio_btn_selectio_,setradio_btn_selectio_]=useState(true);
  const [radio_btn_selectio_0,setradio_btn_selectio_0]=useState(false);

  const handleScroll = (xOffset) => {
    if (AssetViewRef.current) {
      AssetViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };
  useEffect(() => {
    setsearch_text('');
    setselect_asset_modal(true);
    setshow_anchors(false);
    setkyc_modal(false);
  }, [isFocused])

  useEffect(() => {
    setmodal_load(true);
    if (kyc_modal) {
      const timer1 = setTimeout(() => {
        setkyc_modal_text("Fetching stellar.toml")
      }, 3000);
      const timer2 = setTimeout(() => {
        setkyc_modal_text("Fetching Pairs and Asset Rates")
      }, 5000);
      const timer3 = setTimeout(() => {
        setmodal_load(false);
      }, 9000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [kyc_modal]);
  const after_accept_asset = async () => {
    setmodal_load(true);
    setkyc_modal_text("Document submiting for KYC");
    setTimeout(() => {
      setkyc_modal_text("Verifying KYC");
      setTimeout(() => {
        setkyc_modal_text("Transaction Succeeded");
        setTimeout(() => {
        setmodal_load(false);
        setkyc_modal(false);
          setkyc_modal_text("Fetching stellar.toml")
          navigation.navigate("/")
        }, 2500);
      }, 3000);
    }, 3000);
  }
  return (
    <View style={styles.main}>
      <View style={styles.headerContainer1_TOP}>
        <View
          style={{
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("/")}>
            <Icon
              name={"left"}
              type={"antDesign"}
              size={28}
              color={"white"}
            />
          </TouchableOpacity>
        </View>

        {Platform.OS === "android" ? (
          <Text style={styles.text_TOP}>Deposit/withdrawal</Text>
        ) : (
          <Text style={[styles.text_TOP, styles.text1_ios_TOP]}>Deposit/withdrawal</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={darkBlue} style={styles.logoImg_TOP} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              setmodalContainer_menu(true)
            }}
          >
            <Icon
              name={"menu"}
              type={"materialCommunity"}
              size={30}
              color={"#fff"}
            />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalContainer_menu}>

            <TouchableOpacity style={styles.modalContainer_option_top} onPress={() => { setmodalContainer_menu(false) }}>
              <View style={styles.modalContainer_option_sub}>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Icon
                    name={"lan-pending"}
                    type={"materialCommunity"}
                    size={30}
                    color={"gray"}
                  />
                  <Text style={styles.modalContainer_option_text}>Establish TrustLine</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Icon
                    name={"pencil"}
                    type={"materialCommunity"}
                    size={30}
                    color={"gray"}
                  />
                  <Text style={styles.modalContainer_option_text}>Create Trading Pair</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Image source={Bridge} style={{ width: "13%", height: "190%" }} />
                  <Text style={styles.modalContainer_option_text}>Bridge Tokens</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Icon
                    name={"anchor"}
                    type={"materialCommunity"}
                    size={30}
                    color={"gray"}
                  />
                  <Text style={styles.modalContainer_option_text}>Anchor Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Icon
                    name={"badge-account-outline"}
                    type={"materialCommunity"}
                    size={30}
                    color={"gray"}
                  />
                  <Text style={styles.modalContainer_option_text}>KYC</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view}>
                  <Icon
                    name={"playlist-check"}
                    type={"materialCommunity"}
                    size={30}
                    color={"gray"}
                  />
                  <Text style={styles.modalContainer_option_text}>My Subscription</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view} onPress={() => {
                  console.log('clicked');
                  const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
                  AsyncStorage.removeItem(LOCAL_TOKEN);
                  setmodalContainer_menu(false)
                  navigation.navigate('exchangeLogin');
                }}>
                  <Icon
                    name={"logout"}
                    type={"materialCommunity"}
                    size={30}
                    color={"#fff"}
                  />
                  <Text style={[styles.modalContainer_option_text, { color: "#fff" }]}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContainer_option_view} onPress={() => { setmodalContainer_menu(false) }}>
                  <Icon
                    name={"close"}
                    type={"materialCommunity"}
                    size={30}
                    color={"#fff"}
                  />
                  <Text style={[styles.modalContainer_option_text, { color: "#fff" }]}>Close Menu</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>

      {/* header end */}
      {select_asset_modal && <View style={styles.select_asset_modal}>
        <Text style={styles.select_asset_heading}>Select Asset</Text>
        <TextInput placeholder="Search" placeholderTextColor={"gray"} value={search_text} onChangeText={(value) => { setsearch_text(value.toUpperCase()) }} style={styles.search_bar} />
        {search_text.length === 0 && <View style={styles.ScrollView_contain}>
          <TouchableOpacity style={[styles.left_icon,{marginTop:Platform.OS==="ios"&&29}]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const backOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Assets.length;
              handleScroll(backOffset);

            }
          }}><Icon name={"left"} type={"antDesign"} size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={[[styles.left_icon,{marginTop:Platform.OS==="ios"&&29}], { alignSelf: "flex-end" }]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const nextOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Assets.length;
              handleScroll(nextOffset);
            }
          }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"} /></TouchableOpacity>
          <ScrollView ref={AssetViewRef} horizontal style={styles.ScrollView} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
            {Assets.map((list, index) => {
              return (
                <View style={[styles.card,{justifyContent:Platform.OS==="ios"&&"center"}]} key={index}>
                  <Text style={styles.card_text}>{list.name}</Text>
                  <Text style={styles.card_text}>{list.address.slice(0, 4)}</Text>
                </View>
              )
            })}
          </ScrollView>
        </View>}
        {/* for search result */}
        {search_text.length !== 0 && <View style={styles.ScrollView_contain}>
          <TouchableOpacity style={styles.left_icon} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const backOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Assets.length;
              handleScroll(backOffset);

            }
          }}><Icon name={"left"} type={"antDesign"} size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.left_icon, { alignSelf: "flex-end" }]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const nextOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Assets.length;
              handleScroll(nextOffset);
            }
          }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"} /></TouchableOpacity>
          <ScrollView ref={AssetViewRef} horizontal style={styles.ScrollView} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
            {Assets.map((list, index) => {
              if (list.name.includes(search_text))
                {
                  return (
                    <View style={[styles.card,{justifyContent:Platform.OS==="ios"&&"center"}]} key={index}>
                      <Text style={styles.card_text}>{list.name}</Text>
                      <Text style={styles.card_text}>{list.address.slice(0, 4)}</Text>
                    </View>
                  )
                }
            })}
          </ScrollView>
        </View>}

        <TouchableOpacity style={styles.next_btn} onPress={()=>{setselect_asset_modal(false),setshow_anchors(true)}}>
          <Text style={styles.next_btn_txt}>Next</Text>
        </TouchableOpacity>
      </View>}

      {/* Anchors View */}
      
      {show_anchors && <View style={styles.select_asset_modal}>
        <Text style={styles.select_asset_heading}>Select Anchor</Text>
        <TextInput placeholder="Search" placeholderTextColor={"gray"} value={search_text} onChangeText={(value) => { setsearch_text(value.toUpperCase()) }} style={styles.search_bar} />
        {search_text.length === 0 && <View style={styles.ScrollView_contain}>
          <TouchableOpacity style={[styles.left_icon,{marginTop:Platform.OS==="ios"&&29}]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const backOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Assets.length;
              handleScroll(backOffset);

            }
          }}><Icon name={"left"} type={"antDesign"} size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.left_icon, { alignSelf: "flex-end" },{marginTop:Platform.OS==="ios"&&29}]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const nextOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Assets.length;
              handleScroll(nextOffset);
            }
          }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"} /></TouchableOpacity>
          <ScrollView ref={AssetViewRef} horizontal style={styles.ScrollView} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
            {Anchors.map((list, index) => {
              return (
                <View style={[styles.card,{justifyContent:Platform.OS==="ios"&&"center"}]} key={index}>
                  <Text style={styles.card_text}>{list.name}</Text>
                  <Text style={styles.card_text}>{list.address.slice(0, 4)}</Text>
                </View>
              )
            })}
          </ScrollView>
        </View>}
        {/* for search result */}
        {search_text.length !== 0 && <View style={styles.ScrollView_contain}>
          <TouchableOpacity style={[styles.left_icon,{marginTop:Platform.OS==="ios"&&29}]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const backOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Assets.length;
              handleScroll(backOffset);

            }
          }}><Icon name={"left"} type={"antDesign"} size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.left_icon, { alignSelf: "flex-end" },{marginTop:Platform.OS==="ios"&&29}]} onPress={() => {
            if (AssetViewRef.current && contentWidth !== 0) {
              const nextOffset = (AssetViewRef.current.contentOffset ? AssetViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Assets.length;
              handleScroll(nextOffset);
            }
          }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"} /></TouchableOpacity>
          <ScrollView ref={AssetViewRef} horizontal style={styles.ScrollView} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
            {Anchors.map((list, index) => {
              if (list.name.includes(search_text))
                {
                  return (
                    <View style={[styles.card,{justifyContent:Platform.OS==="ios"&&"center"}]} key={index}>
                      <Text style={styles.card_text}>{list.name}</Text>
                      <Text style={styles.card_text}>{list.address.slice(0, 4)}</Text>
                    </View>
                  )
                }
            })}
          </ScrollView>
        </View>}

        <TouchableOpacity style={styles.next_btn} onPress={()=>{setkyc_modal(true)}}>
          <Text style={styles.next_btn_txt}>Next</Text>
        </TouchableOpacity>
      </View>}

      <Modal
      animationType="fade"
      transparent={true}
      visible={kyc_modal}>
      {/* // visible={true}> */}

      <View style={styles.kyc_Container}>
        <View style={[styles.kyc_Content,{height:modal_load===false?"40%":"24%"}]}>
        {kyc_modal_text!=="Transaction Succeeded"&&<Image source={darkBlue} style={styles.logoImg_kyc} />}
                {kyc_modal_text==="Transaction Succeeded"?
                <View style={{justifyContent:"center",alignItems:"center",marginTop:28}}>
                <Icon
        name={"check-circle-outline"}
        type={"materialCommunity"}
        size={63}
        color={"green"}
      />
      <Text style={styles.kyc_text}>{kyc_modal_text}</Text>
      </View>
                :modal_load===false?<></>:<Text style={styles.kyc_text}>{kyc_modal_text}</Text>}
                {/* {modal_load === false ? <ActivityIndicator size="large" color="green" /> : */}
                {modal_load===true?kyc_modal_text==="Transaction Succeeded"?<></>:<ActivityIndicator size="large" color="green" />:
                  <>
                   <Text style={[styles.radio_text_selectio,{marginStart:-20.9,marginBottom:19,marginTop:10}]}>Select your preferred option:</Text>
                   <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={[styles.radio_btn_selectio,{marginRight:15,backgroundColor:radio_btn_selectio_===true?"green":"gray"}]} onPress={()=>{setradio_btn_selectio_0(false),setradio_btn_selectio_(true)}}>
                    </TouchableOpacity>
                   <Text style={styles.radio_text_selectio}>test/test</Text>
                   <Text style={[styles.radio_text_selectio,{marginStart:18,marginRight:15}]}> $ 000011</Text>
                   </View>
                   <View style={{flexDirection:"row",marginTop:19}}>
                    <TouchableOpacity style={[styles.radio_btn_selectio,{marginRight:15,backgroundColor:radio_btn_selectio_0===true?"green":"gray"}]} onPress={()=>{setradio_btn_selectio_(false),setradio_btn_selectio_0(true)}}>
                    </TouchableOpacity>
                   <Text style={styles.radio_text_selectio}>test/test</Text>
                   <Text style={[styles.radio_text_selectio,{marginStart:10,marginRight:15}]}> $0.000287</Text>
                   </View>
                    <TouchableOpacity onPress={() => {after_accept_asset()}} style={{width: "50%", height: "15%", backgroundColor: "green", marginTop: 35, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 19 }}>Accept</Text>
                    </TouchableOpacity>
            </>
            }
        </View>
      </View>
    </Modal>
   
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer1_TOP: {
    backgroundColor: "#4CA6EA",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: wp(100),
    paddingHorizontal: wp(2),
  },
  logoImg_TOP: {
    height: hp("8"),
    width: wp("12"),
    marginLeft: wp(7.6),
  },
  text_TOP: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
    alignSelf: "center",
    marginStart: wp(20)
  },
  text1_ios_TOP: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    marginStart: wp(20),
    top:19,
    fontSize: 17
  },
  modalContainer_option_top: {
    // flex: 1,
    alignSelf: "flex-end",
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: "100%",
    height: "100%",
  },
  modalContainer_option_sub: {
    alignSelf: "flex-end",
    backgroundColor: 'rgba(33, 43, 83, 1)',
    padding: 10,
    borderRadius: 10,
    width: "65%",
    height: "70%"
  },
  modalContainer_option_view: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: "center",
  },
  modalContainer_option_text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    marginStart: 5
  },
  // header end
  main: {
    backgroundColor: "#011434",
    width: wp("100%"),
    height: hp("100%")
  },
  select_asset_modal: {
    width: wp("95%"),
    // height:hp("40%"),
    backgroundColor: "rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    marginTop: "5%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10
  },
  select_asset_heading: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff"
  },
  search_bar: {
    color: "#fff",
    borderColor: "#485DCA",
    borderWidth: 1.3,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 19,
    marginTop: 10
  },
  next_btn: {
    width: wp("19%"),
    height: hp("6%"),
    borderColor: "#485DCA",
    borderWidth: 1.3,
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 19
  },
  next_btn_txt: {
    fontSize: 19,
    color: "#fff",
    textAlign: "center",
  },
  ScrollView_contain: {
    height: hp("11%"),
    marginTop: 15
  },
  left_icon: {
    position: "absolute",
    width: wp(8),
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 23.5,
    padding: 5,
    borderRadius: 10,
    zIndex: 20,
  },
  ScrollView: {
    backgroundColor: "rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 19
  },
  card: {
    width: wp("24%"),
    marginRight: 10,
    borderWidth: 1.9,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#011434",
    flexDirection: "column",
    paddingVertical: 3
  },
  card_text: {
    fontSize: 19,
    color: "#fff",
    textAlign: "center",
  },
  kyc_Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  kyc_Content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width:"80%",
    height:"24%"
  },
  kyc_text: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoImg_kyc: {
    height: hp("9"),
    width: wp("12"),
  },
  radio_text_selectio:{
    color: "black",
     fontSize: 19
    },
 radio_btn_selectio:{
   width:"9.4%",
   height:"100%",
   backgroundColor:"green",
   borderColor:"gray",
   borderWidth:3,
   borderRadius:15
 },
 button_: {
   backgroundColor: '#1E90FF',
   padding: 10,
   borderRadius: 5,
   alignItems: 'center',
   margin: 10
 },
})
export default Payout;