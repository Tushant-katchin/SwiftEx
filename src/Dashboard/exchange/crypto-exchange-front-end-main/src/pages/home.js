import React ,{ useState, useEffect,useFocusEffect } from "react";
import darkBlue from "../../../../../../assets/darkBlue.png";
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
import { Platform } from "react-native";
// import StellarSdk from '@stellar/stellar-sdk';

export const HomeView = ({ setPressed }) => {
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

  const getData = async () => {
    try {
      const storedData = await AsyncStorageLib.getItem('myDataKey');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved data:', parsedData);
        const publicKey = parsedData.key1
        setsteller_key(publicKey)
      }
      else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
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
  
const Offer_condition=()=>{
  getAccountDetails()
  if(Offer_active===true)
  {
    if (
      walletType === "Ethereum" ||
      walletType === "Multi-coin"
    ) {
      setOpen(true);
    } else {
      
      alert('error',"Only Ethereum wallet are supported");
    }
  }
  else{
    Alert.alert("Account","Add Bank Account from Profile Tab.");
  }
}
  return (
    <>
<View style={styles.headerContainer1_TOP}>
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
    <TouchableOpacity
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
    </TouchableOpacity>
  </View>
</View>

      
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
                    <Text style={styles.textColor}>Ethereum Key  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(60),borderColor:"#485DCA",borderWidth:0.9,paddingVertical:1.0,borderRadius:5}}>
                   <Text style={[styles.textColor,styles.width_scrroll]}>{state.wallet.address}</Text>
                    </ScrollView>
                  </View> 

                  <View style={{flexDirection:"row",marginTop:10}}>
                    <Text style={styles.textColor}>Stellar Key       </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(60),borderColor:"#485DCA",borderWidth:0.9,paddingVertical:1.0,borderRadius:5}}>
                   <Text style={[styles.textColor,styles.width_scrroll]}>{steller_key}</Text>
                    </ScrollView>
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
       
{profile && (
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
                <Text style={styles.kycText}>KYC UPDATING <ActivityIndicator color={"green"}/>{profile.isVerified===false?kyc():""}</Text>
              )}
            </View>
          // </View>
        )}
         {walletType === "Ethereum" || walletType === "Multi-coin" ? (
          // <Text style={{ color: "white" }}>{walletType} Wallet Connected</Text>
          <></>
        ) : (
          <Text style={styles.whiteColor}>
            Only Ethereum and Multi-coin based wallets are supported.
          </Text>
        )}
      </View>
  <View style={Platform.OS === "ios" ?{justifyContent:'center',alignItems:'center',backgroundColor:"#011434"} :{justifyContent:'center',alignItems:'center',backgroundColor:"#011434"}}>
<LineChart
        data={chartData}
        width={375}
        height={310}
        withDots={true}
        withVerticalLines={false}
        withHorizontalLines={false}
        style={{backgroundColor:"011434",borderRadius:15,marginTop:Platform==="android"||24}}
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
    width: wp(96),
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
    height: hp(30),
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "#131E3A",   //OLD
    backgroundColor: "#011434",
  },
  linearContainer: {
    width: wp(95),
    padding: hp(2),
    paddingVertical: hp(3),
    borderRadius: hp(2),
    marginTop: hp(3),
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
    width: wp(96),
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
    height: hp("9"),
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
  
});