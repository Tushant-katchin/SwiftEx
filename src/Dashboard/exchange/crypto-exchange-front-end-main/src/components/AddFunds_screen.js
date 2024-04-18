import { useNavigation } from "@react-navigation/native";
import Icon from "../../../../../icon";
import { View, Platform, Text, StyleSheet, TouchableOpacity, Image, Pressable, ActivityIndicator,Modal,ScrollView,TextInput,Button,Picker, Alert } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import darkBlue from "../../../../../../assets/darkBlue.png";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { alert } from "../../../../reusables/Toasts";


import { smart_contract_Address,RPC } from "../../../../constants";
import contractABI from './contractABI.json';
import { useSelector } from "react-redux";
import { REACT_APP_HOST, REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import { GET, authRequest, getAuth } from "../api";
const Web3 = require('web3');
const StellarSdk = require('stellar-sdk');
const alchemyUrl = RPC.ETHRPC;
const AddFunds_screen = () => {
  const AnchorViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  const handleScroll = (xOffset) => {
    if (AnchorViewRef.current) {
      AnchorViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };
  const navigation = useNavigation();
  const state = useSelector((state) => state);
  const [route, setRoute] = useState(null);
  const [offer_amount, setoffer_amount] = useState('');
  const [offer_price, setoffer_price] = useState('');
  const inActiveColor = ["#131E3A", "#131E3A"];
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const [Balance, setbalance] = useState('');
  const [info_,setinfo_]=useState(false);
  const [activ,setactiv]=useState(false);
  const [show,setshow]=useState(false);
  const [PublicKey, setPublicKey]=useState("");
  const [SecretKey,setSecretKey]=useState("");
  const [Ether_public,setEther_public]=useState("");
  const [Anchor_modal,setAnchor_modal]=useState(false);
  const [index_Anchor,setindex_Anchor]=useState("");
  const [eth_modal_visible,seteth_modal_visible]=useState(false);
  const [eth_modal_amount,seteth_modal_amount]=useState("");
  const [eth_modal_load,seteth_modal_load]=useState(false);
  const [u_email,setu_email]=useState("");
  const [route_fiat,setroute_fiat]=useState(null)


  const Anchor = [
    { name: "SwiftEx", status: "Verified", image: require('../../../../../../assets/darkBlue.png'), city: "India / Indonesia / Ireland / Israel / Italy / Jamaica / Japan / Jordan / Kazakhstan / Kenya / Kosovo / Kuwait / Kyrgyzstan / Laos / Latvia / Lebanon / Liberia / Libya / Slovakia / Slovenia / Solomon Islands / South Africa / South Korea / South Sudan / Spain / Sri Lanka / Suriname / Sweden / Switzerland / Taiwan / Tanzania / Thailand / Timor-Leste / Togo / Tonga / Trinidad And Tobago / Turkey / Turks And Caicos Islands / Tuvalu / Uganda / Ukraine / United Arab Emirates / United Kingdom / United States / Uruguay / Uzbekistan / Vanuatu / Venezuela / Vietnam / Virgin Islands, British / Virgin Islands, U.S. / Yemen / Zambia", Crypto_Assets: "XETH, XUSD", Fiat_Assets: "$ USD, € EUR", Payment_Rails: "Card, Bank Transfer, Local Method" },
    { name: "APS", status: "Pending", image: require('../../../../../../assets/APS.png'), city: "Austria / Belgium / Brazil / Bulgaria / Chile / Croatia / Cyprus / Czech Republic / Denmark / Estonia / Finland / France / Germany / Greece / Hungary / Ireland / Italy / Latvia / Lithuania / Luxembourg / Malta / Netherlands / Poland / Portugal / Romania / Slovakia / Slovenia / Spain / Sweden", Fiat_Assets: "$ BRL€ EUR$ CLP", Crypto_Assets: "XETH, XUSD" },
    { name: "BILIRA", status: "Pending", image: require('../../../../../../assets/BIRLA.png'), city: "Turkey", Fiat_Assets: "$ USD", Crypto_Assets: "XETH, XUSD, USDC" },
    { name: "ALFRED", status: "Pending", image: require('../../../../../../assets/ALFRED.png'), city: "Argentina / Brazil / Chile / Colombia / Dominican Republic / Mexico", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD", Payment_Rails: "Bank Transfer" },
    { name: "ANCLAP", status: "Pending", image: require('../../../../../../assets/ANCLAP.png'), city: "Argentina / Chile / Colombia / Mexico / Peru", Crypto_Assets: "XETH, XUSD, ARS,PEN,USDC,XLM", Fiat_Assets: "$ ARS $ USD", Payment_Rails: "CashCard, Bank Transfer, Local Method" },
    { name: "ARF", status: "Pending", image: require('../../../../../../assets/ARF.png'), city: "China / Colombia / Singapore / Turkey / United States", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD" },
];

const fetchProfileData = async () => {
  try {
    const { res, err } = await authRequest("/users/getUserDetails", GET);
    // console.log("_+++++++",res.email)
    if (err) return setMessage(` ${err.message} please log in again!`);
    setu_email(res.email);
  } catch (err) {
    //console.log(err)
    setMessage(err.message || "Something went wrong");
  }
};
  async function deposited_Ether_in_smart()
  {
    setshow(true);
    const web3 = new Web3(alchemyUrl);
    const contract = new web3.eth.Contract(contractABI, smart_contract_Address);
    const addressToCheck = '0xd4787fFaa142c62280732afF7899B3AB03Ea0eAA';//for test ether account.
    // const addressToCheck=Ether_public;
    contract.methods.reservedEth(addressToCheck).call()
        .then(balance => {
          setshow(false);
          const balanceInEth = web3.utils.fromWei(balance, 'ether');
          setbalance(balanceInEth);
        })
        .catch(error => {
          setshow(false);
            console.error('Error:-----', error);
        });        
  }


  const add_XETH=async()=>{
    const token = await getAuth();
    console.log("======= called")
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);


const raw = JSON.stringify({
  "email": u_email,
  "amount": eth_modal_amount
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(REACT_APP_HOST+"/users/SendXETH", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    alert("success","XETH Recived");
    console.log("===res get xeth===>",result)})
  .catch((error) => console.error(error));
  }

  
           const deposit_Ether=async(offer_amount)=> {
             seteth_modal_load(true);
            //  const Ether_public="0xd4787fFaa142c62280732afF7899B3AB03Ea0eAA";
            const temp=parseFloat(offer_amount)
            if (temp<=0) {
               alert("error","Input correct value.");
               seteth_modal_load(false);
              }
              else
              {
              const web3 = new Web3();
              setshow(true);
              const valueInWei = web3.utils.toWei(offer_amount, 'ether');
              try {
                const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));
                    const contract = new web3.eth.Contract(contractABI, smart_contract_Address);
                    const txData = contract.methods.depositEth(valueInWei).encodeABI();
        
                    const nonce = await web3.eth.getTransactionCount(Ether_public);
                    const txObject = {
                      nonce: web3.utils.toHex(nonce),
                      gasLimit: web3.utils.toHex(300000), 
                      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                      to: smart_contract_Address,
                      data: txData,
                      value: web3.utils.toHex(valueInWei)
                };
        
                // const signedTx = await web3.eth.accounts.signTransaction(txObject, "9d9e1e7a8fdb0ed51a40a4c6b3e32c91f64615e37281150932fa1011d1a59daf");
                const signedTx = await web3.eth.accounts.signTransaction(txObject, state.wallet.privateKey);
        
        
                const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                setshow(false);
                // seteth_modal_amount('');
                alert("success","Ether Deposited.");
                seteth_modal_load(false);
                console.log('Transaction hash:', txReceipt.transactionHash);
                console.log('Transaction from:', txReceipt.from);
                console.log('Transaction status:', txReceipt.status);
                 if(txReceipt.status===true)
                 {
                   add_XETH();
                 }
                console.log('Transaction hash:', txReceipt.transactionHash);
                console.log('Transaction receipt:', txReceipt);
              } catch (error) {
                console.log("-----called-----",error)
              seteth_modal_load(false);
              console.error('Error:', error);
              alert("error",error);
                setshow(false);
                seteth_modal_amount('');
              }
            }
            }
  
           



            const getData = async () => {
              try {
                const storedData = await AsyncStorageLib.getItem('myDataKey');
                if (storedData !== null) {
                  const parsedData = JSON.parse(storedData);
                  console.log('Retrieved data:', parsedData);
                  const publicKey = parsedData.key1
                  const secretKey = parsedData.key2
                  setPublicKey(publicKey);
                  setSecretKey(secretKey);
                }
                else {
                  console.log('No data found in AsyncStorage');
                }
              } catch (error) {
                console.error('Error retrieving data:', error);
              }
            };
            const get_stellar = async (asset,asset1) => {
              try {
                console.log("=====",state)
                getData()
                  // if(asset1==="USD")
                  // {
                  //   setbalance("");
                  //   setshow(true)
                  //   // console.log("<><", PublicKey)
                  //   const PublicKey="GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
                  //   StellarSdk.Network.useTestNetwork();
                  //   const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
                  //   server.loadAccount(PublicKey)
                  //     .then(account => {
                  //       console.log('Balances for account:', PublicKey);
                  //       account.balances.forEach(balance => {
                  //         if (balance.asset_code === asset) {
                  //           console.log(`${balance.asset_code}: ${balance.balance}`);
                  //           setbalance(balance.balance)
                  //           setactiv(false);
                  //         }
                  //       });
                  //       setshow(false)
                  //     })
                  //     .catch(error => {
                  //       console.log('Error loading account:', error);
                  //       // alert("error", "Account Balance not found.");
                  //       setshow(false)
                  //       setactiv(true)
                  //     });
                  // }
                   if(asset==="BNB")
                  {
                    setbalance(state.walletBalance)
                  }
                  if(asset==="Matic")
                  {
                    setbalance(state.MaticBalance)
                  }
                  if(asset==="XETH")
                  {
                    setEther_public(state.wallet.address);
                    setbalance(state.EthBalance);
                    // setEther_public("0xd4787fFaa142c62280732afF7899B3AB03Ea0eAA");
                    // setbalance("123456");
                  }
                  if(asset==="XRP")
                  {
                    setbalance(state.XrpBalance)
                  }
              } catch (error) {
                console.log("Error in get_stellar",error)
                alert("error", "Something went wrong.");
                setshow(false)
              }
            }
  




   const anchor_res=(index)=>{
     setAnchor_modal(false)
     if(index==="SwiftEx")
     {
      setindex_Anchor("SwiftEx")
      alert("success","This anchor is Ready.")
      seteth_modal_visible(true)
    }
    else{
      setindex_Anchor("");
      alert("error","This anchor in Pending.")
    }
   }
   const Deposit_Eth=()=>{
    setAnchor_modal(true)
  }

   const manage_info=()=>{
    setinfo_(true);
    setTimeout(()=>{
      setinfo_(false);
    },1000);
   }

   useEffect(()=>{
    get_stellar(route,route_fiat);
    fetchProfileData();
   },[route,route_fiat])

   const onChangeamount = (input) => {
    const formattedInput = input.replace(/[,\s-]/g, '');
    seteth_modal_amount(formattedInput);
};




  return (
    <View>
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
              navigation.navigate('exchangeLogin');
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
      {/* //// Header End ////*/}

      <View style={{ backgroundColor: "#011434",height:hp(100) }}>

        <View style={{flexDirection:Platform.OS==="ios"?"row":"column",justifyContent:"space-evenly"}}>
        <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:19,textAlign:"center",marginLeft:Platform.OS==="android"&&25}}>Crypto Deposit</Text>
                <Picker
                  selectedValue={route}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -15 } : { marginTop: 3, width: "210%", color: "white", marginLeft: 35 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setRoute(itemValue)
                    setroute_fiat(null);

                  }}
                >
                  <Picker.Item label="Select Crypto" value={null} color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="ETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="BNB" value="BNB" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="Matic" value="Matic" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="XRP" value="XRP" color={Platform.OS === "ios" ? "gray" : "gray"} />
                </Picker>
              </View>

              <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:19,textAlign:"center",marginLeft:Platform.OS==="ios"?19:10}}>Fiat Deposit</Text>
                <Picker
                  selectedValue={route_fiat}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -11 } : { marginTop: 3, width: "210%", color: "white", marginLeft: 35 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setroute_fiat(itemValue);
                    setRoute(null);
                  }}
                >
                  <Picker.Item label="Select Fiat" value={null} color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="INR" value="INR" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="AUD" value="AUD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="USD" value="USD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="AED" value="AED" color={Platform.OS === "ios" ? "white" : "black"} />
                  {/* <Picker.Item label="ETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} /> */}
                </Picker>
              </View>
        </View>

        {/* <View style={[styles.toggleContainer]}>
          <LinearGradient
            colors={route == "XETH" ? activeColor : inActiveColor}
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <Pressable
              activeOpacity={0.8}
              style={[
                styles.toggleBtn,
                route == "XETH"
                  ? { borderRadius: hp(4) }
                  : { borderRadius: null },
              ]}
              onPress={() => {
                setRoute("XETH");
                setoffer_amount("");
                setoffer_price("");
              }}
            >
              <Text style={[route == "XETH" ? { color: "#fff" } : { color: "#407EC9" }]}>XETH</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={route == "XUSD" ? activeColor : inActiveColor}
          >
            <Pressable
              activeOpacity={0.8}
              style={[styles.toggleBtn2]}
              onPress={() => {
                setRoute("XUSD");
                setoffer_amount("");
                setoffer_price("");
              }}>
              <Text style={[route == "XUSD" ? { color: "#fff" } : { color: "#407EC9" }]}>XUSD</Text>
            </Pressable>
          </LinearGradient>
        </View> */}

        <View style={{ flexDirection: "row", alignSelf: "center",marginTop:Platform.OS==="ios"?-0:49 }}>
          <Text style={styles.balance}>{route==="XETH"?"Ether":route} Balance:</Text>
           <View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(9) }}>
       <Text style={styles.balance}>{route_fiat !==null? "Add Funds":Balance ? Number(Balance).toFixed(8) : 0.0}</Text>
</ScrollView>
            </View>
          {/* {route_fiat !==null? "Add Funds":Balance ? Number(Balance).toFixed(8) : 0.0} */}
          { show === true ? <ActivityIndicator color={"green"} /> : <></>}
        </View>

        {/* <View style={{ marginStart: wp(10),marginTop:10 }}>
          <View>
            <Text style={Platform.OS === "ios" ? [styles.currencyText, styles.down_] : styles.currencyText}> Curency</Text>
          </View>
          <Text style={Platform.OS === "ios" ? { marginTop: 35, width: '90%', color: "white", fontSize: 22, marginLeft: 21 } : { marginTop: 16, width: '90%', color: "white", fontSize: 16, marginLeft: 21 }}>{route === "XUSD" ? "USD" : "ETH"}</Text>
        </View> */}

              <View style={{flexDirection:"row",justifyContent:"center"}}>
                {/* <TouchableOpacity
                  style={{
                    alignItems: "center",
                    borderWidth: StyleSheet.hairlineWidth * 1,
                    borderColor: "green",
                    width: wp(66),
                    paddingVertical: hp(1.3),
                    borderRadius: 6,
                    marginTop: 40,
                    marginStart:19,
                    backgroundColor: 'green',
                  }}
                  onPress={() => { route==="XETH"&&Deposit_Eth(),route_fiat==="XUSD"&&activ===true?alert("error","Stellar Account Activation Require for Add Funds."):[navigation.navigate("Payment")]}}
                  >
                  <Text style={styles.cancelText}>{route==="XETH"?"Deposit":"Add Funds"}</Text>
                </TouchableOpacity> */}
               {route && (
          <TouchableOpacity
          style={{
            alignItems: "center",
            borderWidth: StyleSheet.hairlineWidth * 1,
            borderColor: "green",
            width: wp(66),
            paddingVertical: hp(1.3),
            borderRadius: 6,
            marginTop: 40,
            marginStart:19,
            backgroundColor: route==="XETH"?Balance==="0.0"?"gray":'green':"gray",
          }}
          onPress={() => { route==="XETH"?Deposit_Eth():Alert.alert("Anchor",route+" Anchor currently Pending.")}}
          disabled={state.EthBalance==="0.0"}
          // disabled={Balance==="0.0"}

          >
          <Text style={styles.cancelText}>{route==="XETH"?"Deposit":"Available Soon"}</Text>
        </TouchableOpacity> 
        )}
        {route_fiat && (
<TouchableOpacity
          style={{
            alignItems: "center",
            borderWidth: StyleSheet.hairlineWidth * 1,
            borderColor: "green",
            width: wp(66),
            paddingVertical: hp(1.3),
            borderRadius: 6,
            marginTop: 40,
            marginStart:19,
            backgroundColor: 'green',
          }}
          onPress={() => {activ===true?alert("error","Stellar Account Activation Require for Add Funds."):navigation.navigate("Payment")}}
          >
          <Text style={styles.cancelText}>Add Funds</Text>
        </TouchableOpacity> 
        )}
               
                <TouchableOpacity onPress={()=>{manage_info()}}>
                {info_===true?<View style={{backgroundColor:"gray",backgroundColor:"#212B53",padding:3.6,borderRadius:10,marginTop:-26,zIndex:20,position:"absolute",marginStart:-90,width:120}}>
                      <Text style={{color:"white",width:"100%"}}>Deposit Funds to increase account balance.</Text>
                    </View>:<></>}
                <Icon
                      name={"information-outline"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={21}
                      style={{marginTop:31}}
                      />
              </TouchableOpacity>
              </View>
              {state.EthBalance==="0.0"&&route==="XETH"&&<View style={{width:wp(40),alignSelf:"center"}}><Text style={{textAlign:"center",marginTop:19,borderColor:"red",color:"red",borderWidth:1.3,borderRadius:10,padding:5}}>Insufficient Balance</Text></View>}
              {route===null?<></>:route==="XETH"?<></>:<View style={{width:wp(40),alignSelf:"center",marginTop:12}}><Text style={{textAlign:"center",color:"orange",borderColor:"orange",borderWidth:1.9,borderRadius:10,paddingHorizontal:2.9}}>Available Soon</Text></View>}
       <View style={{backgroundColor:"black",}}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={Anchor_modal}
      >
        <View style={styles.container_a}>

        <TouchableOpacity style={{zIndex:20,position:"absolute",width:wp(8),marginTop:100,backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const backOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Anchor.length;
            handleScroll(backOffset);

          }}}><Icon name={"left"} type={"antDesign"} size={25} color={"white"}/>
               </TouchableOpacity>

               <TouchableOpacity style={{zIndex:20,position:"absolute",width:wp(8),marginTop:100,backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5,alignSelf:"flex-end"}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const nextOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Anchor.length;
            handleScroll(nextOffset);
          }
        }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"}/></TouchableOpacity>

        {/* <View style={{flexDirection:"row",justifyContent:"space-between",zIndex:20,position:"absolute",width:wp(95),marginTop:90}}>
                  <TouchableOpacity style={{backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const backOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) - 3 * contentWidth / Anchor.length;
            handleScroll(backOffset);

          }}}><Icon name={"left"} type={"antDesign"} size={25} color={"white"}/>
               </TouchableOpacity>
               <TouchableOpacity style={{backgroundColor:"rgba(255,255,255,0.2)",borderRadius:10,padding:5}} onPress={() => {
          if (AnchorViewRef.current && contentWidth !== 0) {
            const nextOffset = (AnchorViewRef.current.contentOffset ? AnchorViewRef.current.contentOffset.x : 0) + 3 * contentWidth / Anchor.length;
            handleScroll(nextOffset);
          }
        }}><Icon name={"right"} type={"antDesign"} size={25} color={"white"}/></TouchableOpacity>
                  </View> */}
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <Text style={{ textAlign: "left", marginHorizontal: 10, marginTop: 10, fontWeight: "bold", fontSize: 20, color: "#fff" }}>Anchors</Text>
           <TouchableOpacity onPress={()=>{setAnchor_modal(false)}} style={{padding:10}}>
           <Icon
              name={"close"}
              type={"antDesign"}
              size={28}
              color={"white"}
            />
           </TouchableOpacity>
            </View>
            <ScrollView ref={AnchorViewRef} horizontal style={{ backgroundColor: "rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)", padding: 8, borderRadius: 10 }} showsHorizontalScrollIndicator={false} onContentSizeChange={(width) => setContentWidth(width)}>
                {Anchor.map((list, index) => {
                    return (
                        <TouchableOpacity onPress={() => {anchor_res(list.name)}}>
                                <View style={[styles.card,{backgroundColor:list.status==="Pending"?"#2b3c57":"#011434"}]} key={index}>
                                <View style={{ width: "30%", height: "27%", borderBottomLeftRadius: 10, borderColor: 'rgba(122, 59, 144, 1)rgba(100, 115, 197, 1)', borderWidth: 1.9, position: "absolute", alignSelf: "flex-end", borderTopRightRadius: 10 }}>
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
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
      </Modal>
       </View>
   
      {/* Deposit Ether modal */}

      <Modal visible={eth_modal_visible} animationType="slide" transparent={true}>
      <View style={{backgroundColor: '#212B53',
  padding: 20,
  borderRadius: 10,
  elevation: 5,
  marginTop:hp(40),
  width:wp(95),
  marginStart:10
  }}>
        <View>
          <Text style={{fontSize:19,marginBottom:3,color:"#fff"}}>Ether Amount</Text>
          <TextInput
            value={eth_modal_amount}
            onChangeText={(value)=>{onChangeamount(value)}}
            placeholder="10.999"
            style={{backgroundColor:"#fff",padding:10,fontSize:20}}
            keyboardType="number-pad"
          />
          <View style={{flexDirection:"row",width:"100%",justifyContent:"space-evenly",marginTop:10}}>
            {/* <Button title="Cancel"  color="red" onPress={()=>{seteth_modal_visible(false)}}/> */}
            <TouchableOpacity style={{width:"30%",height:"109%",backgroundColor:"red",borderRadius:10}} onPress={()=>{seteth_modal_visible(false)}}>
              <Text style={{textAlign:"center",marginTop:4,fontSize:16,color:"#fff"}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={!eth_modal_amount} style={{width:"30%",height:"109%",backgroundColor:eth_modal_amount!==''?"green":"gray",borderRadius:5,elevation:5}} onPress={()=>{deposit_Ether(eth_modal_amount)}}>
                  {/* <Text style={{textAlign:'center',marginTop:6,fontSize:15,color:"white"}}>{eth_modal_load===true?<ActivityIndicator color={"white"}/>:"Deposit ETH"}</Text> */}
                  {Platform.OS==="android"? 
                    <Text style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: "white" }}>{eth_modal_load === true ? <ActivityIndicator color={"white"} /> : "Deposit ETH"}</Text>:
                    <Text style={{ marginTop: 10, margin: 3, fontSize: 15, color: "white" }}>{eth_modal_load === true ? <ActivityIndicator color={"white"} style={{justifyContent:"center"}}/> : "Deposit ETH"}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>


      </View>
    </View>
  )
}
export default AddFunds_screen;
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
    height: hp("9"),
    width: wp("12"),
    marginLeft: wp(14),
  },
  text_TOP: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
    alignSelf: "center",
    marginStart: wp(30)
  },
  text1_ios_TOP: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    marginStart: wp(31),
    top: 19,
    fontSize: 17
  },
  toggleContainer: {
    alignSelf: "center",
    marginVertical: hp(4),
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
  currencyText: {
    color: "#fff",
    fontSize: hp(2),
    marginLeft: 7.6,
  },
  down_: {
    marginBottom: -16
  },
  balance: {
    color: "#fff",
    textAlign: "center",
    // marginVertical: hp(1),
    fontSize: hp(2),
  },
  cancelText: {
    color: "white",
    fontSize:19
  },
  container_a: {
    height:hp(23),
    width:"94%",
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",
    margin:10,
    borderRadius:10,
    marginTop:hp(39)
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
    borderRadius: 50,
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
});