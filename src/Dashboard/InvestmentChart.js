import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Image, ScrollView, RefreshControl, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  CardItem,

} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import Etherimage from "../../assets/ethereum.png";
import { Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { getBnbPrice, getEthPrice, getXLMPrice } from "../utilities/utilities";
import Maticimage from "../../assets/matic.png";
import Xrpimage from "../../assets/xrp.png";
import stellar from "../../assets/Stellar_(XLM).png"
import Bridge from "../../assets/Bridge.png"
import bnbimage from "../../assets/bnb-icon2_2x.png";
import { GetBalance, getAllBalances } from "../utilities/web3utilities";
import { getXrpBalance } from "../components/Redux/actions/auth";
import alert from "./reusables/Toasts";
import Icon from "../icon";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "./exchange/crypto-exchange-front-end-main/src/ExchangeConstants";
import { GET, authRequest } from "./exchange/crypto-exchange-front-end-main/src/api";
const StellarSdk = require('stellar-sdk');

function InvestmentChart(setCurrentWallet) {
  const navigation=useNavigation();
  const state = useSelector((state) => state);
  const [URL_OPEN, setURL_OPEN] = useState("");
  const [open_web_view, setopen_web_view] = useState(false);
  const [Bottom_loading, setBottom_loading] = useState(true);
  const [loading_1, setLoading_1] = useState(true);
  const [pull, setPull] = useState(false)
  const wallet = useSelector((state) => state.wallet);
  const [bnbBalance, getBnbBalance] = useState(0.00);
  const [xrpBalance, GetXrpBalance] = useState(0.00);
  const [maticBalance, getMaticBalance] = useState(0.00);
  const [ethBalance, getEthBalance] = useState(0.00);
  const [xmlBalance, setxmlBalance] = useState(0.00);
  const [current_xlm, setcurrent_xlm] = useState(0.00)
  const EthBalance = useSelector((state) => state.EthBalance);
  const XrpBalance = useSelector((state) => state.XrpBalance);
  const walletState = useSelector((state) => state.wallets);
  const type = useSelector((state) => state.walletType);
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [Profile, setProfile] = useState({
    isVerified: false,
    firstName: "jane",
    lastName: "doe",
    email: "xyz@gmail.com",
    phoneNumber: "93400xxxx",
    isEmailVerified: false,
  });
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState();
  const [ethPrice, setEthPrice] = useState();
  const [bnbPrice, setBnbPrice] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const getEthBnbPrice = async () => {
    await getEthPrice().then((response) => {
      setEthPrice(response.USD);
    });
    await getBnbPrice().then((response) => {
      setBnbPrice(response.USD);
    });
    await getXLMPrice().then((response) => {
      setcurrent_xlm(response.USD);
    });
  };
  const getData = async () => {
    try {
      const storedData = await AsyncStorageLib.getItem('myDataKey');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved data:', parsedData);
        const publicKey = parsedData.key1;
        const secretKey = parsedData.key2;
        setPublicKey(publicKey);
        setSecretKey(secretKey);
      } else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };


  const getTokenBalance = async () => {
    const bal = await state.walletBalance;
    const EthBalance = await state.EthBalance;
    const xrpBalance = await state.XrpBalance;
    const maticBalance = await state.MaticBalance;
    const wallet = await state.wallet
    console.log('wall', wallet.address)
    AsyncStorageLib.getItem("walletType").then(async (type) => {

      console.log(JSON.parse(type))
      if (JSON.parse(type) === "Ethereum") {
        if (EthBalance) {
          getEthBalance(Number(EthBalance).toFixed(2));
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        } else {
          getEthBalance(0.00);
          getBnbBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "BSC") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = provider.getBalance(address)
        // console.log('balance',balance)
        if (bal) {
          getBnbBalance(Number(bal).toFixed(2));
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        } else {
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "Xrp") {
        console.log('fetching')
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = provider.getBalance(address)
        // console.log('balance',balance)
        if (xrpBalance) {
          dispatch(getXrpBalance(wallet.address))
          GetXrpBalance(xrpBalance)
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
        } else {
          getBnbBalance(0.00);
          getEthBalance(0.00);
          getMaticBalance(0.00);
          GetXrpBalance(0.00);
        }
      } else if (JSON.parse(type) === "Multi-coin") {
        // provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC)
        // const balance = await provider.getBalance(address)
        // console.log('balances=',balance)
        if (
          EthBalance >= 0
        ) {
          getEthBalance(Number(EthBalance).toFixed(2));

        } else {
          getEthBalance(0.00);
        }
        if (bal >= 0) {
          console.log('bal', bal)
          getBnbBalance(Number(bal).toFixed(2));
        } else {
          getBnbBalance(0.00);
        }
        if (xrpBalance >= 0) {
          try {

            dispatch(getXrpBalance(wallet.xrp.address))
          } catch (e) {
            console.log(e)
          }

          GetXrpBalance(Number(xrpBalance).toFixed(2));



        } else {
          GetXrpBalance(0.00);
        }
        if (maticBalance >= 0) {
          getMaticBalance(Number(maticBalance).toFixed(2));
        } else {
          getMaticBalance(0.00);
        }
      } else {
        getEthBalance(0.00);
        getBnbBalance(0.00);
        getMaticBalance(0.00);
        GetXrpBalance(0.00);
      }
      setPull(false)
    });
  }

  useEffect(async () => {
    try {
      await getData();
      await getTokenBalance()
      getEthBnbPrice();
      // get_stellar();

    } catch (e) {
      console.log(e)
    }
  }, []);

  useEffect(async () => {
    try {

      getTokenBalance();
    } catch (e) {
      console.log(e)
    }
    // await GetBalance(await state)
  }, [wallet.address, wallet.name, EthBalance, bnbBalance, XrpBalance, state.walletBalance, state.EthBalance, state.XrpBalance, state.MaticBalance]);

  let LeftContent = (props) => (
    <Avatar.Image
      {...props}
      source={{
        uri: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      }}
    />
  );
  let LeftContent2 = (props) => <Avatar.Image {...props} source={Etherimage} />;

  const get_stellar = async () => {
    // const publicKey="GCW6DBA7KLB5HZEJEQ2F5F552SLQ66KZFKEPPIPI3OF7XNLIAGCP6JER";
    try {
      console.log("<><", publicKey)

      StellarSdk.Network.useTestNetwork();
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      server.loadAccount(publicKey)
        .then(account => {
          console.log('Balances for account:', publicKey);
          account.balances.forEach(balance => {
            console.log(`${balance.asset_type}: ${balance.balance}`);
            setxmlBalance(balance.balance)
          });
        })
        .catch(error => {
          console.log('Error loading account:', error);
          alert("error", "Need to fund amount.")
        });
    } catch (error) {
      console.log("Error in get_stellar")
    }
  }
 useEffect(()=>{
  setBottom_loading(true)
    getData();
  get_stellar();
  setTimeout(() => {
    setBottom_loading(false);
  }, 1000);
 },[])

 const assets=[
  {asset_image:bnbimage,asset_name:"BNB",asset_price:bnbPrice >= 0 ? bnbPrice : 300,asset_balance:bnbBalance ? bnbBalance : 0},
  {asset_image:Etherimage,asset_name:"Ethereum",asset_price:ethPrice >= 0 ? ethPrice : 1300,asset_balance:ethBalance ? ethBalance : 0},
  {asset_image:Maticimage,asset_name:"Matic",asset_price: 4,asset_balance:maticBalance ? maticBalance : 0},
  {asset_image:Xrpimage,asset_name:"XRP",asset_price:0.78,asset_balance:xrpBalance ? xrpBalance : 0},
  {asset_image:stellar,asset_name:"XLM",asset_price:current_xlm,asset_balance:xmlBalance ? xmlBalance : "0.00"},
 ]


 const for_trading=async()=>{
   try {
     const { res, err } = await authRequest("/users/getUserDetails", GET);
     if (err)return [navigation.navigate("exchangeLogin")];
     console.log("-------vsdasdasd--",res)
      setProfile(res);
      await getOffersData()
    } catch (err) {
      console.log(err)
    }
};
const getOffersData = async () => {
  try {
    const { res, err } = await authRequest("/offers", GET);
    if (err) return console.log(`${err.message}`);
    setOffers(res);
  } catch (err) {
    console.log(err)
    // setMessage(err.message || "Something went wrong");
  }

  navigation.navigate("newOffer_modal",{
    user:{Profile},
                open:{open},
                getOffersData:{getOffersData}
  });

 }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={pull}
          onRefresh={() => {
            setPull(true);
            getTokenBalance();
            get_stellar();
            getData();
          }}
        />
      }

      nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: hp(60) }} sp>
      <TouchableOpacity style={[styles.refresh,{backgroundColor:"#fff",borderColor:"#145DA0",borderWidth:1}]} onPress={() => {
        getAllBalances(state, dispatch)
      }}>
          <Icon type={"materialCommunity"} name="refresh" size={hp(3)} color="black" style={{ marginLeft: 1 }} />
      </TouchableOpacity>
      {Bottom_loading?
      <ActivityIndicator color={"green"} style={{marginTop:hp(10)}} size={"large"}/>:
      <View style={styles.flatlistContainer}>
        <View>
        {assets.map((list,index)=>{
          return(
            <View style={{flexDirection:"row"}}>
             <View style={{ flexDirection: "row", alignItems: "center",width:wp(30) }} key={index}>
          <Image source={list.asset_image} style={[styles.img,{marginTop:-12,borderColor:"#fff"}]} />
          <View style={styles.ethrumView}>
            <Text>{list.asset_name}</Text>
            <Text
              style={{
                color: "grey",
                fontWeight: "bold",
              }}
            >
              ${list.asset_price}
            </Text>
            <Text
          style={{
            color: "black",
            fontWeight: "bold",
            marginLeft:-26,
          }}
        >
          Avl: {list.asset_balance} {list.asset_name==="Ethereum"?"ETH":list.asset_name==="Matic"?"MAT":list.asset_name } 
        </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row",width:wp(70) }}>
        <View style={{alignItems:"center",alignSelf:"center"}}>
          {/* <Icon type={"materialCommunity"} name="swap-horizontal" size={hp(4)} color="black" style={{ marginLeft: 1 }} /> */}
          <TouchableOpacity style={[styles.asset_options, { marginLeft: 1,flexDirection:"row",backgroundColor:"#fff",borderColor:"#145DA0",borderWidth:1}]} onPress={()=>{navigation.navigate("classic")}}>
          {/* <Image source={Bridge} style={[styles.img_new,{borderColor:"#fff"}]} /> */}
          <Icon type={"materialCommunity"} name="swap-horizontal" size={hp(3)} color="black" style={{ marginLeft: -10 }} />
            <Text style={[styles.asset_op_text,{color:"black"}]}> Swap</Text>
          </TouchableOpacity>
            </View>
          <View style={{alignItems:"center",justifyContent:"center"}}>
          {/* <Icon type={"materialCommunity"} name="chart-line-variant" size={hp(3)} color="black" style={{ marginLeft: 4 }}/> */}
          <TouchableOpacity style={[styles.asset_options,{flexDirection:"row",backgroundColor:"#fff",borderColor:"#145DA0",borderWidth:1 }]} onPress={async()=>{
             const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
             const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
             token ? await for_trading() :navigation.navigate("exchangeLogin")
            }}>
          {/* <Image source={stellar} style={[styles.img_new,{borderColor:"#fff"}]} /> */}
          <Icon type={"materialCommunity"} name="chart-line-variant" size={hp(3)} color="black" style={{ marginLeft: 1 }}/>
            <Text style={[styles.asset_op_text,{color:"black"}]}> Trade</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:"center",justifyContent:"center"}}>
        {/* <Icon type={"materialCommunity"} name="cash" size={hp(3)} color="black" style={{ marginLeft: 10 }}/> */}
          <TouchableOpacity style={[styles.asset_options,{width:wp(19.9),flexDirection:"row",backgroundColor:"#fff",borderColor:"#145DA0",borderWidth:1 }]}  onPress={async()=>{
             const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
             const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
             token ? navigation.navigate("payout") :navigation.navigate("exchangeLogin")
            }}>
          {/* <Image source={stellar} style={[styles.img_new,{borderColor:"#fff"}]} /> */}
        <Icon type={"materialCommunity"} name="swap-vertical" size={hp(3)} color="black" style={{ marginLeft: 7 }}/>
            <Text style={[styles.asset_op_text,{color:"black",width:50,textAlign:"center",marginLeft:-5}]}>On/Off Ramp</Text>
          </TouchableOpacity>
        </View>
       
        </View>
            </View>
          )
        })}
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={open_web_view}
      >
        <View style={{ height: hp(100), width: wp(100), backgroundColor: "white", borderRadius: 10}}>
          <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: 10, marginTop: 10 }} onPress={() => { setopen_web_view(false); }}>
            <Icon name={"close"} type={"antDesign"} size={28} color={"black"} />
          </TouchableOpacity>

          {loading_1 && (
            <ActivityIndicator
              size="large"
              color="green"
              style={{justifyContent:"center",alignItems:"center"}}
            />
          )}

          <WebView
            source={{ uri: URL_OPEN }}
            onLoad={() => setLoading_1(false)}
            onLoadEnd={() => setLoading_1(false)}
          />
        </View>
      </Modal>
      </View>
    }

      
    </ScrollView>
  );
}

export default InvestmentChart;

const styles = StyleSheet.create({
  flatlistContainer: {
    flexDirection: "row",
    marginVertical: hp(1),
    // width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(100),
    alignSelf: "center",
    marginBottom: 0,
    marginLeft:wp(5)
  },
  img: { height: hp(4.3), width: wp(9), borderWidth: 1, borderRadius: hp(3) },
  img_new: { height: hp(3), width: wp(5), borderWidth: 1, borderRadius: hp(3) },
  ethrumView: {
    marginHorizontal: wp(2),
  },
  view: {
    flex: 1,
    height: 75,
  },
  chart: {
    height: 75,
  },
  priceUp: {
    color: "rgb(0,153,51)",
  },
  priceDown: {
    color: "rgb(204,51,51)",
  },
  refresh: { backgroundColor: "#145DA0", width: wp(10), paddingVertical: hp(0.3), marginTop: hp(1.9), marginLeft: wp(5), alignItems: "center", borderRadius: hp(1) },
  asset_options:{
    backgroundColor: "#145DA0",
    width:wp(19.5),
    height:hp(4.5),
    marginLeft:10,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center"
  },
  asset_op_text:{
    fontSize:12,
    color:"#fff",
    fontWeight:"bold"
  }

});
