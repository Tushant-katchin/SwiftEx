import React ,{ useState, useEffect,useFocusEffect } from "react";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Bridge from "../../../../../../assets/Bridge.png";

import { authRequest, GET, POST } from "../api";
import { NewOfferModal } from "../components/newOffer.modal";
import { FieldView } from "./profile";
import { OfferListView, OfferListViewHome } from "./offers";
import { ConnectToWallet } from "../web3";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { useSelector } from "react-redux";
import { getRegistrationToken } from "../utils/fcmHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import walletImg from "../../../../../../assets/walletImg.png";
import idCard from "../../../../../../assets/idCard.png";

import copyRide from "../.././../../../../assets/copyRide.png";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { BidsListView } from "../components/bidsListView";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../../../icon";
import { alert } from "../../../../reusables/Toasts";
import { LineChart } from "react-native-chart-kit";
import { Platform,Modal} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRef } from "react";
// import StellarSdk from '@stellar/stellar-sdk';

export const HomeView = ({ setPressed }) => {
  const [modalContainer_menu,setmodalContainer_menu]=useState(false);
  const AnchorViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  const handleScroll = (xOffset) => {
    if (AnchorViewRef.current) {
      AnchorViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };
  const Focused_screen=useIsFocused();
  const [steller_key,setsteller_key]=useState("");
  const state = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [bids, setBids] = useState();
  const [route, setRoute] = useState("Offers");
  const [profile, setProfile] = useState({
    isVerified: false,
    firstName: "jane",
    lastName: "doe",
    email: "xyz@gmail.com",
    phoneNumber: "93400xxxx",
    isEmailVerified: false,
  });
  const base_asset_code='XETH';
  const counter_asset_code='XUSD';
  const [chartData, setChartData] = useState({
    datasets: [
      {
        data: [0],
        color: () => 'green',
      },
    ],
  });
  const [offers, setOffers] = useState();
  const [walletType, setWalletType] = useState(null);
  const [change, setChange] = useState(false);
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const inActiveColor = ["#131E3A", "#131E3A"];
  const [Offer_active,setOffer_active]=useState(false);
  const Anchor=[
    {name:"SwiftEx",status:"Verified",image: require('../../../../../../assets/darkBlue.png'),city:"India / Indonesia / Ireland / Israel / Italy / Jamaica / Japan / Jordan / Kazakhstan / Kenya / Kosovo / Kuwait / Kyrgyzstan / Laos / Latvia / Lebanon / Liberia / Libya / Slovakia / Slovenia / Solomon Islands / South Africa / South Korea / South Sudan / Spain / Sri Lanka / Suriname / Sweden / Switzerland / Taiwan / Tanzania / Thailand / Timor-Leste / Togo / Tonga / Trinidad And Tobago / Turkey / Turks And Caicos Islands / Tuvalu / Uganda / Ukraine / United Arab Emirates / United Kingdom / United States / Uruguay / Uzbekistan / Vanuatu / Venezuela / Vietnam / Virgin Islands, British / Virgin Islands, U.S. / Yemen / Zambia",Crypto_Assets:"XETH, XUSD",Fiat_Assets:"$ USD, € EUR",Payment_Rails:"Card, Bank Transfer, Local Method" },
    {name:"APS",status:"Pending",image: require('../../../../../../assets/APS.png'),city:"Austria / Belgium / Brazil / Bulgaria / Chile / Croatia / Cyprus / Czech Republic / Denmark / Estonia / Finland / France / Germany / Greece / Hungary / Ireland / Italy / Latvia / Lithuania / Luxembourg / Malta / Netherlands / Poland / Portugal / Romania / Slovakia / Slovenia / Spain / Sweden",Fiat_Assets:"$ BRL€ EUR$ CLP",Crypto_Assets:"XETH, XUSD" },
    {name:"BILIRA",status:"Pending",image: require('../../../../../../assets/BIRLA.png'),city:"Turkey",Fiat_Assets:"$ USD",Crypto_Assets:"XETH, XUSD, USDC"},
    {name:"ALFRED",status:"Pending",image: require('../../../../../../assets/ALFRED.png'),city:"Argentina / Brazil / Chile / Colombia / Dominican Republic / Mexico",Crypto_Assets:"XETH, XUSD, USDC",Fiat_Assets:"$ USD",Payment_Rails:"Bank Transfer" },
    {name:"ANCLAP",status:"Pending",image: require('../../../../../../assets/ANCLAP.png'),city:"Argentina / Chile / Colombia / Mexico / Peru",Crypto_Assets:"XETH, XUSD, ARS,PEN,USDC,XLM",Fiat_Assets:"$ ARS $ USD",Payment_Rails:"CashCard, Bank Transfer, Local Method"},
    {name:"ARF",status:"Pending",image: require('../../../../../../assets/ARF.png'),city:"China / Colombia / Singapore / Turkey / United States",Crypto_Assets:"XETH, XUSD, USDC",Fiat_Assets:"$ USD" },
  ];
  const [steller_key_private,setsteller_key_private]=useState("");
  const [show_steller_key,setshow_steller_key]=useState("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  const [Anchor_modal,setAnchor_modal]=useState(false);
  const [index_Anchor,setindex_Anchor]=useState(0);
  const [kyc_modal,setkyc_modal]=useState(false);
  const [kyc_status,setkyc_status]=useState(false);
  const [con_modal,setcon_modal]=useState(false)



  const bootstrapStyleSheet = new BootstrapStyleSheet();
  const { s, c } = bootstrapStyleSheet;
  const navigation = useNavigation();
  const Navigate = () => {
    navigation.dispatch((state) => {
      // Remove the home route from the stack
      const routes = state.routes.filter((r) => r.name !== "exchange");
      
      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  };

  const getData_new_Kyc = async () => {
    try {
      const key = 'KYC_NEW';
      const value = await AsyncStorage.getItem(key);
    const parsedValue = JSON.parse(value); 
    console.log("++++_+_+_",parsedValue)
    parsedValue===null?setkyc_status(false):setkyc_status(parsedValue)
      console.log('Retrieved value:', parsedValue);
    } catch (error) {
      console.error('Error retrieving data', error);
      setkyc_status(false);
    }
  };

  const getData = async () => {
    try {
      const data = await AsyncStorageLib.getItem('myDataKey');
      if (data) {
        const parsedData = JSON.parse(data);
        const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
        console.log('Retrieved data:', matchedData);
        const publicKey = matchedData[0].publicKey;
        console.log("========home===",publicKey)
        setsteller_key(publicKey)
        const secretKey_Key = matchedData[0].secretKey;
        console.log("=======home====",secretKey_Key)
        setsteller_key_private(secretKey_Key)
      } else {
        console.log('No data found for key steller keys');
      }
    } catch (error) {
      console.error('Error getting data for key steller keys:', error);
    }
    // try {
    //   const storedData = await AsyncStorageLib.getItem('myDataKey');
    //   if (storedData !== null) {
    //     const parsedData = JSON.parse(storedData);
    //     console.log('Retrieved data:', parsedData);
    //     const publicKey = parsedData.key1
    //     setsteller_key(publicKey)
    //     const secretKey_Key = parsedData.key2
    //     setsteller_key_private(secretKey_Key)
    //   }
    //   else {
    //     console.log('No data found in AsyncStorage');
    //   }
    // } catch (error) {
    //   console.error('Error retrieving data:', error);
    // }
  };

  const getAccountDetails = async () => {
    try {
      const { res, err } = await authRequest("/users/getStripeAccount", GET);
    if(res)
    {
      setOffer_active(true);
    }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(()=>{
    getAccountDetails();
    getData()
    getData_new_Kyc()
  },[Focused_screen]);
  useEffect(() => {
    getData()
    getAccountDetails();
    fetchProfileData();
    getOffersData();
    getBidsData();
    syncDevice();
  }, []);
  useEffect(() => {
    fetchProfileData();
    getOffersData();
    getBidsData();
    syncDevice();
  }, [change]);

  const syncDevice = async () => {
    const token = await getRegistrationToken();
    console.log(token);
    console.log("hi", token);
    if(!token)
    {
      const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
           AsyncStorage.removeItem(LOCAL_TOKEN);
           Navigate()
           
      navigation.navigate('exchangeLogin')
      return
    }
    try {
      const { res } = await authRequest(
        `/users/getInSynced/${await getRegistrationToken()}`,
        GET
      );
      if (res.isInSynced) {
        const { err } = await authRequest("/users/syncDevice", POST, {
          fcmRegToken: await getRegistrationToken(),
        });
        if (err) return setMessage(`${err.message}`);
        return setMessage("Your device is synced");
      }

      return setMessage("");
    } catch (err) {
      //console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      // console.log("_+++++++",res)
      if (err) return setMessage(` ${err.message} please log in again!`);
      setProfile(res);
    } catch (err) {
      //console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const getOffersData = async () => {
    try {
      const { res, err } = await authRequest("/offers", GET);
      if (err) return setMessage(`${err.message}`);
      setOffers(res);
    } catch (err) {
      // console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const applyForKyc = async () => {
    try {
      const { err } = await authRequest("/users/kyc", POST);
      if (err) return setMessage(`${err.message}`);

      await fetchProfileData();
      return setMessage("KYC success");
    } catch (err) {
      // console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const getBidsData = async () => {
    try {
      const { res, err } = await authRequest("/bids", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setBids(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchData = async () => {
    try {
      const response =await fetch('https://horizon-testnet.stellar.org/trade_aggregations?base_asset_type=credit_alphanum4&base_asset_code='+base_asset_code+'&base_asset_issuer=GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI&counter_asset_type=credit_alphanum4&counter_asset_code='+counter_asset_code+'&counter_asset_issuer=GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI&resolution=60000&offset=0&limit=6&order=desc')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiResponse = await response.json();
      const records = apiResponse._embedded.records;
      // console.log(records);
      const parsedData = {
        labels : records.map((record) => {
          const date = new Date(parseFloat(record.timestamp));
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }),
        
        datasets: [
          {
            data: records.map((record) => parseFloat(record.high)),
            color: (opacity = 1) => `rgba(0, 186, 0, ${opacity})`, // Green high
            strokeWidth: 3
          },
          {
            data: records.map((record) => parseFloat(record.low)),
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red low
            strokeWidth: 3
          }
        ]
      };
      setChartData(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    AsyncStorageLib.getItem("walletType").then((walletType) => {
      console.log(walletType);
      setWalletType(JSON.parse(walletType));
    });
  }, []);

const kyc=()=>{
  console.log("called");
  applyForKyc();
}
  
const Offer_condition=(data,para)=>{
  if(kyc_status===false)
  {
    alert("error","Please Submit KYC from Home Tab");
  }
  else{
  getAccountDetails()
  if(Offer_active===true)
  {
    if (
      walletType === "Ethereum" ||
      walletType === "Multi-coin"
    ) {
      // setOpen(true);
      navigation.navigate("newOffer_modal",{
        user:{profile},
                    open:{open},
                    // onCrossPress={()=>{setOpen(false)}},
                    // setOpen:{setOpen}
                    getOffersData:{getOffersData}
      });
    } else {
      
      alert('error',"Only Ethereum wallet are supported");
    }
  }
  else{
    Alert.alert("Account","Add Bank Account from Profile Tab.");
  }
  }
}
const copyToClipboard = (data) => {
  Clipboard.setString(data);
  alert("success", "Copied");
};

const priview_steller=()=>{
  setshow_steller_key(steller_key_private);
  setTimeout(()=>{
  setshow_steller_key("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  },3000);
}


const animation = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    })
  ).start();
}, []);

const shiningAnimation = animation.interpolate({
  inputRange: [0, 1],
  outputRange: ['rgba(129, 108, 255, 0.97)', '#fff'],
});


const submit_kyc=async()=>{
  try {
    const key = 'KYC_NEW';
    const value = true;
    await AsyncStorage.setItem(key, JSON.stringify(value));
    setkyc_modal(true);
    setTimeout(()=>{
      setkyc_modal(false);
      setcon_modal(true)
      setkyc_status(true);
      close_()
    },1300)
  } catch (error) {
    console.error('Error storing data', error);
  }
}
const close_=()=>{
  setTimeout(()=>{
    setcon_modal(false)
  },1500)
}
  return (
    <>
<View style={styles.headerContainer1_TOP}>
<Modal
      animationType="fade"
      transparent={true}
      visible={con_modal}>
      <View style={{flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',}}> 
      <View style={{ backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width:"90%",
    height:"20%",
    justifyContent:"center"}}>
      <Icon
        name={"check-circle-outline"}
        type={"materialCommunity"}
        size={60}
        color={"green"}
      />
      <Text style={{fontSize:20,fontWeight:"bold",marginTop:10}} onPress={()=>{setcon_modal(false)}}>KYC Success</Text>
      </View>
      </View>
    </Modal>
  <View
    style={{
      justifyContent: "space-around",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Icon
        name={"left"}
        type={"antDesign"}
        size={28}
        color={"white"}
      />
    </TouchableOpacity>
  </View>

  {Platform.OS === "android" ? (
    <Text style={styles.text_TOP}>Exchange</Text>
  ) : (
    <Text style={[styles.text_TOP, styles.text1_ios_TOP]}>Exchange</Text>
  )}

  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    <Image source={darkBlue} style={styles.logoImg_TOP} />
  </TouchableOpacity>

  <View style={{ alignItems: "center" }}>
    {/* <TouchableOpacity
      onPress={() => {
        console.log('clicked');
        const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
        AsyncStorage.removeItem(LOCAL_TOKEN);
        Navigate();
        navigation.navigate('Home');
      }}
    >
      <Icon
        name={"logout"}
        type={"materialCommunity"}
        size={30}
        color={"#fff"}
      />
    </TouchableOpacity> */}
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
  </View>
</View>
<Modal
      animationType="fade"
      transparent={true}
      visible={modalContainer_menu}>
       
      <TouchableOpacity style={styles.modalContainer_option_top}> 
      <View style={styles.modalContainer_option_sub}>
     
      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Establish TrustLine</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Create Trading Pair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Bridge Tokens</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Anchor Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>KYC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>My Subscription</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}   onPress={() => {
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
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view} onPress={()=>{setmodalContainer_menu(false)}}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"green"}
      />
      <Text style={styles.modalContainer_option_text}>Close</Text>
      </TouchableOpacity>
      </View>
      </TouchableOpacity>
    </Modal>

      
    <ScrollView
    style={{ backgroundColor: "#011434"}}
      contentContainerStyle={{
        // paddingBottom: hp(20),
        backgroundColor: "#131E3A",
      }}
    >
      
      <View style={styles.container}>
        {/* <LinearGradient
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(223, 172, 196, 1)", "rgba(192, 197, 234, 1)"]}
          style={styles.linearContainer}
          >
          
          {state.wallet ? (
            <View>
            <View style={styles.iconwithTextContainer}>
            <View style={styles.walletContainer}>
            <Text style={styles.myWallet}>My Wallet </Text>
            <Image source={walletImg} style={styles.walletImg} />
            </View>
            <View style={styles.walletContainer}>
            <Icon
            name={"check-outline"}
            type={"materialCommunity"}
            color={"#008C62"}
            />
            <Text style={styles.connectedText}>Connected!</Text>
            </View>
            </View>
            <Text style={styles.textColor}>{state.wallet.address}</Text>
            </View>
            ) : (
              <Text style={styles.textColor}>
              Please select a wallet first!
              </Text>
              )}
              
              
              
              {message ? (
                <>
                <View style={styles.copyRideContainer}>
                <Text style={styles.messageStyle}>{message}</Text>
                <View>
                <Image
                source={copyRide}
                style={styles.walletImg}
                color={"#1D7FA3"}
                />
                
                <Text style={styles.copyText}>copy</Text>
                </View>
                </View>
                </>
                ) : (
                  null
                  )}
                  
                </LinearGradient> */}
                {/* <View style={{width:"96%",margin:10,padding:10,justifyContent:"center",borderRadius:10,borderColor:"white",borderWidth:1.9,borderColor:"rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)"}}>
                   <Text style={{fontWeight: "bold",fontSize:20,color:"#fff",marginBottom:2.9}}>Anchor</Text>
                   <View style={{flexDirection:"row"}}>
                   <View style={{backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",borderRadius:15,width:"33%"}}>
                      <Image source={darkBlue} style={styles.Anchor_img}/>
                      <Text style={{color:"#35CA1D",textAlign:"center"}}>SwiftEx</Text>
                   </View>
                   </View>
                </View> */}
               <View style={styles.container_a}>
                  {/* <View style={{flexDirection:"row",justifyContent:"space-between",zIndex:20,position:"absolute",width:wp(95),marginTop:80}}> */}
                  <TouchableOpacity style={{zIndex:20,position:"absolute",width:wp(8),marginTop:80,backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const backOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Anchor.length;
            handleScroll(backOffset);

          }}}><Icon name={"left"} type={"antDesign"} size={25} color={"white"}/>
               </TouchableOpacity>

               <TouchableOpacity style={{zIndex:20,position:"absolute",width:wp(8),marginTop:80,backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5,alignSelf:"flex-end"}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const nextOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Anchor.length;
            handleScroll(nextOffset);
          }
        }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"}/></TouchableOpacity>
                  {/* </View> */}
                <Text style={{textAlign:"left",marginHorizontal:10,marginTop:10,fontWeight: "bold",fontSize:20,color:"#fff"}}>Anchors</Text>
      <ScrollView ref={AnchorViewRef} horizontal style={{backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",padding:8,borderRadius:10}} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
              {Anchor.map((list, index) => {
                return (
                  <View>
                    <TouchableOpacity  onPress={()=>{setAnchor_modal(true),setindex_Anchor(index)}} style={[styles.card,{backgroundColor:list.status==="Pending"?"#2b3c57":"#011434"}]} key={index}>
                      <View style={{ width: "30%", height: "27%", borderBottomLeftRadius: 10, borderColor: 'rgba(122, 59, 144, 1)rgba(100, 115, 197, 1)', borderWidth: 1.9, position: "absolute", alignSelf: "flex-end", borderTopRightRadius: 10,zIndex:20 }}>
                        <Icon name={list.status === "Pending" ? "clock-time-two-outline" : "check-circle-outline"} type={"materialCommunity"} color={list.status === "Pending" ? "yellow" : "#35CA1D"} size={24} />
                      </View>
                     <View style={styles.image}>
                     <Image
                        source={list.image}
                        style={{width: 70,
                          height: 65,
                          borderRadius: 10,}}
                      />
                     </View>
                      <Text style={styles.name}>{list.name}</Text>
                      <Text style={[styles.status, { color: list.status === "Pending" ? "yellow" : "#35CA1D" }]}>{list.status}</Text>
                    </TouchableOpacity>
                        {kyc_status===false?<TouchableOpacity onPress={()=>{submit_kyc()}}>
                      {list.name==="SwiftEx"&&<Animated.View style={[styles.frame_1, { borderColor: shiningAnimation }]}>
               <Text style={{color:'green',fontSize:16,textAlign:"center"}}>Submit KYC</Text>
                </Animated.View>}
                    </TouchableOpacity>:<></>}
                    <Modal
      animationType="fade"
      transparent={true}
      visible={kyc_modal}>
      <View style={styles.kyc_Container}>
        <View style={styles.kyc_Content}>
    <Image source={darkBlue} style={styles.logoImg_kyc} />
          <Text style={styles.kyc_text}>Document submiting for KYC</Text>
          <ActivityIndicator size="large" color="green" />
        </View>
      </View>
    </Modal>
                  </View>
                )
              })}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={Anchor_modal}
        // onRequestClose={closeModal}
      >
      
      <View style={{backgroundColor: '#fff',borderRadius: 10,marginHorizontal:10,height:hp(80),marginTop:hp(10)}}>
          <TouchableOpacity style={{alignSelf:"flex-end",padding:10}} onPress={()=>{setAnchor_modal(false),setindex_Anchor(0)}}>
          <Icon name={"close"} type={"materialCommunity"} size={30} color={"black"}/>
          </TouchableOpacity>
           {Anchor.map((list,index)=>{
              if(index===index_Anchor)
              {
                  return(
                    <View style={{flex:1}}>
                     <View style={{flexDirection:"row"}}>
                     <View style={styles.image}>
                     <Image
                        source={list.image}
                        style={{width: 75,
                          height: 65,
                          borderRadius: 10,marginLeft:10}}
                      />
                     </View>
                     <Text style={{fontSize:19,textAlign:"center",marginTop:19,fontWeight:"bold"}}>{list.name}</Text>
                     </View>
                     <View style={{flexDirection:"row",marginStart:10,marginTop:10,borderWidth:1.3,margin:10,padding:5,borderBottomColor:"black",borderTopColor:"white",borderLeftColor:"white",borderRightColor:"white"}}>
                       <Icon name={"map-marker"} type={"materialCommunity"} size={30} color={"#212B53"}/>
                       <ScrollView style={{height:hp(14)}}>
                        <Text style={{marginStart:10,marginTop:5}}>{list.city}</Text>
                       </ScrollView>
                      <View>
                      </View>
                     </View>
                     <View style={{borderWidth:1.3,margin:10,padding:5,borderBottomColor:"black",borderTopColor:"white",borderLeftColor:"white",borderRightColor:"white"}}>
                     <Text style={{marginStart:21,marginTop:5,fontSize:20}}>Crypto Assets</Text>
                      <Text style={{marginStart:29,marginTop:9,fontSize:16}}>{list.Crypto_Assets}</Text>
                     </View>

                     <View style={{borderWidth:1.3,margin:10,padding:5,borderBottomColor:"black",borderTopColor:"white",borderLeftColor:"white",borderRightColor:"white"}}>
                     <Text style={{marginStart:26,marginTop:5,fontSize:20}}>Fiat Assets</Text>
                      <Text style={{marginStart:29,marginTop:9,fontSize:16}}>{list.Fiat_Assets}</Text>
                     </View>

                     <View style={{borderWidth:1.3,margin:10,padding:5,borderBottomColor:"black",borderTopColor:"white",borderLeftColor:"white",borderRightColor:"white"}}>
                     <Text style={{marginStart:26,marginTop:5,fontSize:20}}>Payment Rails</Text>
                      <Text style={{marginStart:29,marginTop:9,fontSize:16}}>{list.Payment_Rails}</Text>
                     </View>
                    </View>
                  )
              }
           })}
        </View>

      </Modal>
    </View>
              <View style={[styles.linearContainer,{backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)"}]}>

            {state.wallet ? (
              <View>
                <View style={styles.iconwithTextContainer}>
                  <View style={styles.walletContainer}>
                    <Text style={styles.myWallet}>My Wallet </Text>
                    <Icon
                      name={"wallet"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                    />
                    {/* <Image source={walletImg} style={styles.walletImg} /> */}
                  </View>
                  <View style={styles.walletContainer}>
                    {/* <Icon
                      name={"check-outline"}
                      type={"materialCommunity"}
                      color={"#008C62"}
                    /> */}
                    <Text style={styles.connectedText}>Connected!</Text>
                  </View>
                </View>
                <View style={{}}>
                  <View style={{flexDirection:"row",marginTop:19}}>
                    <Text style={styles.textColor}>Ethereum Address </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(60),borderColor:"#485DCA",borderWidth:0.9,paddingVertical:2.2,borderRadius:5}}>
                   <Text style={[styles.textColor,styles.width_scrroll]}>{state.wallet.address}</Text>
                    </ScrollView>
                    <TouchableOpacity onPress={()=>{copyToClipboard(state.wallet.address)}}>
                    <Icon
                      name={"content-copy"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                      style={{marginTop:0.3,marginLeft:2.9}}
                      />
                    </TouchableOpacity>
                  </View> 

                  <View style={{flexDirection:"row",marginTop:10}}>
                    <Text style={styles.textColor}>Stellar Public Key   </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(60),borderColor:"#485DCA",borderWidth:0.9,paddingVertical:2.9,borderRadius:5}}>
                   <Text style={[styles.textColor,styles.width_scrroll]}>{steller_key}</Text>
                    </ScrollView>
                    <TouchableOpacity onPress={()=>{copyToClipboard(steller_key)}}>
                    <Icon
                      name={"content-copy"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                      style={{marginTop:0.3,marginLeft:2.9}}
                      />
                    </TouchableOpacity>
                  </View> 

                  <View style={{flexDirection:"row",marginTop:10}}>
                    <Text style={styles.textColor}>Stellar Private Key  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(60),borderColor:"#485DCA",borderWidth:0.9,paddingVertical:2.2,borderRadius:5}}>
                   <Text style={[styles.textColor,styles.width_scrroll]}>{show_steller_key}</Text>
                    </ScrollView>
                    <TouchableOpacity onPress={()=>{priview_steller()}} onLongPress={()=>{copyToClipboard(steller_key_private)}}>
                    <Icon
                      name={show_steller_key==="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"?"eye":"eye-off"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                      style={{marginTop:0.3,marginLeft:2.9}}
                      />
                    </TouchableOpacity>
                  </View> 
                </View>
              </View>
            ) : (
              <Text style={styles.textColor}>
                Please select a wallet first!
              </Text>
            )}



            {/* {message ? (
              <>
                <View style={styles.copyRideContainer}>
                  <Text style={styles.messageStyle}>{message}</Text>
                  <View>
                    <Image
                      source={copyRide}
                      style={styles.walletImg}
                      color={"#1D7FA3"}
                    />

                    <Text style={styles.copyText}>copy</Text>
                  </View>
                </View>
              </>
            ) : (
              null
            )} */}

        </View>
       
{/* {profile && (
          <View>
              {profile.isVerified ? (
                <View >
                  <TouchableOpacity 
                    style={styles.PresssableBtn}
                    onPress={() => {
                     // setOpen(true)
                        Offer_condition(Offer_active)
                    }}
                  >
                    <Text style={{ color: "#fff",fontSize:19,fontWeight:"bold" }}>Create Offer</Text>
                  </TouchableOpacity>
                  <NewOfferModal
                    user={profile}
                    open={open}
                    onCrossPress={()=>{setOpen(false)}}
                    setOpen={setOpen}
                    getOffersData={getOffersData}
                  />
                </View>
              ) : (
                <Text style={styles.kycText}>ACCOUNT UPDATING <ActivityIndicator color={"green"}/>{profile.isVerified===false?kyc():""}</Text>
              )}
            </View>
          // </View>
        )} */}
         {walletType === "Ethereum" || walletType === "Multi-coin" ? (
          // <Text style={{ color: "white" }}>{walletType} Wallet Connected</Text>
          <></>
        ) : (
          <Text style={styles.whiteColor}>
            Only Ethereum and Multi-coin based wallets are supported.
          </Text>
        )}
      </View>

<View style={{backgroundColor:"#011434"}}>
{profile && (
          <View>
              {profile.isVerified===true ? (
                <View >
                  <TouchableOpacity 
                    style={styles.PresssableBtn}
                    onPress={() => {
                     // setOpen(true)
                        Offer_condition(Offer_active)
                    }}
                  >
                    <Text style={{ color: "#fff",fontSize:19,fontWeight:"bold" }}>Create Offer</Text>
                  </TouchableOpacity>
                  {/* <NewOfferModal
                    user={profile}
                    open={open}
                    onCrossPress={()=>{setOpen(false)}}
                    setOpen={setOpen}
                    getOffersData={getOffersData}
                  /> */}
                </View>
              ) : (
               <View style={{flexDirection:"row",justifyContent:"center",marginVertical:5}}>
                <Text style={styles.kycText}>FATCHING UPDATING {profile.isVerified===false?kyc():""}</Text>
                <ActivityIndicator color={"green"}/>
               </View>
              )}
            </View>
          // </View>
        )}
</View>
        <View style={{ backgroundColor: "#011434" }}>
          <TouchableOpacity
            style={[styles.PresssableBtn,{flexDirection:"row",justifyContent:"center",marginTop:1}]}
            onPress={() => {
              navigation.navigate("classic")
            }}
          >
            <Text style={{ color: "#fff", fontSize: 19, fontWeight: "bold",marginStart:45 }}>Bridge Tokens</Text>
            <View style={{width:45,height:27,justifyContent:"center",alignSelf:"center"}}>
            <Image source={Bridge} style={{width:"130%",height:"130%"}} />
            </View>
          </TouchableOpacity>
        </View>

  <View style={Platform.OS === "ios" ?{justifyContent:'center',alignItems:'center',backgroundColor:"#011434"} :{justifyContent:'center',alignItems:'center',backgroundColor:"#011434"}}>
<LineChart
        data={chartData}
        width={388}
        height={310}
        withDots={true}
        withVerticalLines={false}
        withHorizontalLines={false}
        style={{backgroundColor:"011434",borderRadius:15}}
        bezier
        chartConfig={{
          backgroundColor: '#011434',
          backgroundGradientFrom: '#212B53',
          backgroundGradientTo: '#1C294D',
          decimalPlaces: 3,
          paddingTop:10,
          color: (opacity = 0) => `rgba(33,43,83, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity.toFixed(1)})`,
        }}
        />
        <View style={{backgroundColor: "rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    padding: hp(0.5),
    width: wp(95),
    alignSelf: "center",
    borderRadius: hp(1.6),
    marginBottom: hp(1),
    marginTop:hp(1.4)}}>
              <Text style={{fontSize: 19,color: "white",textAlign:"center",fontWeight:"500"}}>Trade between XETH vs XUSD</Text>
        </View>
        </View> 
        {/* <View style={[styles.toggleContainer]}> */}
          {/* <LinearGradient
            colors={route == "Bids" ? activeColor : inActiveColor}
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.toggleBtn,
                route == "Bid"
                  ? { borderRadius: hp(4) }
                  : { borderRadius: null },
              ]}
              onPress={() => {
                setRoute("Bids");
              }}
            >
              <Text
                style={[
                  route == "Bids" ? { color: "#fff" } : { color: "#407EC9" },
                ]}
              >
                Bid
              </Text>
            </TouchableOpacity>
          </LinearGradient> */}
          {/* <LinearGradient
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={route == "Offers" ? activeColor : inActiveColor}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.toggleBtn2]}
              onPress={() => {
                setRoute("Offers");
              }}
            >
              <Text
                style={[
                  route == "Offers" ? { color: "#fff" } : { color: "#407EC9" },
                ]}
              >
                My Offers
              </Text>
            </TouchableOpacity>
          </LinearGradient> */}
        {/* </View> */}
          {/* <View> */}
            <OfferListViewHome/>
          {/* </View> */}
    </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: wp(100),
    // height: hp(20),
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "#131E3A",   //OLD
    backgroundColor: "#011434",
  },
  linearContainer: {
    width: wp(94),
    padding: hp(2),
    paddingVertical: hp(3),
    borderRadius: hp(2),
    // marginTop: hp(3),
  },
  textColor: {
    color: "#fff",
  },
  iconwithTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  copyTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(1.9),
  },
  copyText: {
    color: "#2027AC",
  },
  myWallet: {
    fontWeight: "bold",
    fontSize:20,
    color:"#fff"
  },
  width_scrroll:{
    marginLeft: 1.9
},
  walletContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  connectedText: {
    color: "#35CA1D",
  },
  walletImg: {
    height: hp(2.8),
    width: wp(5),
    alignSelf: "center",
  },
  copyRideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(6.8),
    width: wp(90),
  },
  copyText: {
    textAlign: "right",
    color: "black",
    marginHorizontal: wp(5),
  },
  messageStyle: {
    color: "black",
    width: wp(45),
  },
  PresssableBtn: {
    backgroundColor: "rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    padding: hp(2),
    width: wp(93.6),
    borderColor:"rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
    borderWidth:1.3,
    alignSelf: "center",
    paddingHorizontal: wp(3),
    borderRadius: hp(2.5),
    marginBottom: hp(1),
    alignItems: "center",
    marginTop:hp(1.4)
  },
  addofferText: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(50),
    marginLeft: wp(40),
    alignItems: "center",
  },
  whiteColor: {
    color: "#fff",
    marginVertical: hp(2),
    width: wp(80),
  },
  toggleContainer: {
    alignSelf: "center",
    marginVertical: hp(2),
    borderColor: "#407EC9",
    borderWidth: StyleSheet.hairlineWidth * 1,
    flexDirection: "row",
    borderRadius: 8,
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
    borderRadius: 8,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  logoImg: {
    height: hp("15"),
    width: wp("15"),
    alignSelf: "center",
  },
  actionText: {
    color: "#fff",
    marginBottom: hp(2),
  },
  kycText: {
    color: "green",
    // marginTop: hp(2),
    fontSize:19,
  },
  bidText: {
    color: "#fff",
  },
  
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
    marginLeft: wp(14),
  },
  text_TOP: {
    color: "white",
    fontSize:19,
    fontWeight:"bold",
    alignSelf: "center",
    marginStart:wp(30)
  },
  text1_ios_TOP: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    marginStart: wp(31),
    top:19,
    fontSize:17
  },
  container_a: {
    flex: 1,
    width:"94%",
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    margin:10,
    borderRadius:10
  },
  card: {
    marginRight: 10,
    borderWidth: 1.9,
    borderColor: 'rgba(122, 59, 144, 1)rgba(100, 115, 197, 1)',
    borderRadius: 10,
    padding: 8,
    backgroundColor:"#011434"
  },
  image: {
    width: 90,
    height: 65,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color:"#fff"
  },
  status: {
    fontSize: 14,
    color: 'yellow',
  },
  frame_1: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding:3,
    width:"90%",
    marginTop:3
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
  modalContainer_option_top: {
    // flex: 1,
    alignSelf:"flex-end",
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width:"100%",
    height:"100%",
  },
  modalContainer_option_sub:{
    alignSelf:"flex-end",
    backgroundColor: 'rgba(33, 43, 83, 1)',
  padding: 10,
  borderRadius: 10,
  width:"65%",
  height:"70%"
},
modalContainer_option_view:{
  flexDirection:"row",
  marginTop:25,
  alignItems:"center",
},
modalContainer_option_text:{
fontSize:20,
fontWeight:"bold",
color:"#fff",
marginStart:5
}
  
});
