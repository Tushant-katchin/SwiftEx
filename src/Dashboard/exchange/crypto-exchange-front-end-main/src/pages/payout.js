import { View, Text, StyleSheet,Picker,Image,ScrollView, ActivityIndicator,TouchableOpacity, TextInput, Pressable, FlatList,Modal, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-navigation"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { alert } from "../../../../reusables/Toasts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { SavePayout, getAllDataAndShow} from "../../../../../utilities/utilities";
import { authRequest, GET, getToken, POST } from "../api";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Icon from "../../../../../icon";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { REACT_APP_HOST, REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import { useSelector } from "react-redux";
import Bridge from "../../../../../../assets/Bridge.png";

const StellarSdk = require('stellar-sdk');


const Payout = () => {
  const AnchorViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [modalContainer_menu,setmodalContainer_menu]=useState(false);


  const handleScroll = (xOffset) => {
    if (AnchorViewRef.current) {
      AnchorViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const state = useSelector((state) => state);
    const [balance, setbalance] = useState('');
    const [XETH, setXETH] = useState('GCW6DBA7KLB5HZEJEQ2F5F552SLQ66KZFKEPPIPI3OF7XNLIAGCP6JER');
    const [XUSD, setXUSD] = useState('GBCNZEEQXSVQ3O6DWJXAOVGUT3VRI2ZOU2JB4ZQC27SE3UU4BX7OZ5DN');
    const [show, setshow] = useState(true);
    const [route, setRoute] = useState("XETH");
    const [payout_amount, setpayout_amount] = useState('');
    const inActiveColor = ["#131E3A", "#131E3A"];
    const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
    const [Available, setAvailable] = useState("");
    const [email, setemail] = useState("");
    const [Anchor_modal,setAnchor_modal]=useState(false);
    const [index_Anchor,setindex_Anchor]=useState(false);
    const [kyc_modal,setkyc_modal]=useState(false);
    const [modal_load,setmodal_load]=useState(false)
    const [kyc_modal_text,setkyc_modal_text]=useState("Document submiting for KYC")
    const Anchor = [
      { name: "SwiftEx", status: "Verified", image: require('../../../../../../assets/darkBlue.png'), city: "India / Indonesia / Ireland / Israel / Italy / Jamaica / Japan / Jordan / Kazakhstan / Kenya / Kosovo / Kuwait / Kyrgyzstan / Laos / Latvia / Lebanon / Liberia / Libya / Slovakia / Slovenia / Solomon Islands / South Africa / South Korea / South Sudan / Spain / Sri Lanka / Suriname / Sweden / Switzerland / Taiwan / Tanzania / Thailand / Timor-Leste / Togo / Tonga / Trinidad And Tobago / Turkey / Turks And Caicos Islands / Tuvalu / Uganda / Ukraine / United Arab Emirates / United Kingdom / United States / Uruguay / Uzbekistan / Vanuatu / Venezuela / Vietnam / Virgin Islands, British / Virgin Islands, U.S. / Yemen / Zambia", Crypto_Assets: "XETH, XUSD", Fiat_Assets: "$ USD, € EUR", Payment_Rails: "Card, Bank Transfer, Local Method" },
      { name: "APS", status: "Pending", image: require('../../../../../../assets/APS.png'), city: "Austria / Belgium / Brazil / Bulgaria / Chile / Croatia / Cyprus / Czech Republic / Denmark / Estonia / Finland / France / Germany / Greece / Hungary / Ireland / Italy / Latvia / Lithuania / Luxembourg / Malta / Netherlands / Poland / Portugal / Romania / Slovakia / Slovenia / Spain / Sweden", Fiat_Assets: "$ BRL€ EUR$ CLP", Crypto_Assets: "XETH, XUSD" },
      { name: "BILIRA", status: "Pending", image: require('../../../../../../assets/BIRLA.png'), city: "Turkey", Fiat_Assets: "$ USD", Crypto_Assets: "XETH, XUSD, USDC" },
      { name: "ALFRED", status: "Pending", image: require('../../../../../../assets/ALFRED.png'), city: "Argentina / Brazil / Chile / Colombia / Dominican Republic / Mexico", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD", Payment_Rails: "Bank Transfer" },
      { name: "ANCLAP", status: "Pending", image: require('../../../../../../assets/ANCLAP.png'), city: "Argentina / Chile / Colombia / Mexico / Peru", Crypto_Assets: "XETH, XUSD, ARS,PEN,USDC,XLM", Fiat_Assets: "$ ARS $ USD", Payment_Rails: "CashCard, Bank Transfer, Local Method" },
      { name: "ARF", status: "Pending", image: require('../../../../../../assets/APS.png'), city: "China / Colombia / Singapore / Turkey / United States", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD" },
  ];
  const [chooseSearchQuery, setChooseSearchQuery] = useState('');
  const [chooseModalPair,setchooseModalPair]=useState(false);
  const chooseItemList = [
    { id: 1, name: "ETH/USDC" ,value:"XETH"},
    { id: 2, name: "BNB/USDC" ,value:"XUSD"},
  ]
  const [chooseModaldata,setchooseModaldata]=useState(chooseItemList[0].name);
  const chooseFilteredItemList = chooseItemList.filter(
    item => item.name.toLowerCase().includes(chooseSearchQuery.toLowerCase())
  );
  const chooseRenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {setRoute(item.value),setchooseModaldata(item.name),setchooseModalPair(false)}} style={styles.chooseItemContainer}>
      <Text style={styles.chooseItemText}>{item.name}</Text>
    </TouchableOpacity>
  );
    // const [PublicKey, setPublicKey] = useState("GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A");//comment for user
    // const [SecretKey, setSecretKey] = useState("SCJSKKPNYIZJSF6ROF7ZMVNXL6U6HVUA4RK4JLFDH6CLTNRCGZCUUU7S");//comment for user
    const[PublicKey,setPublicKey]=useState("");//uncomment for user
    const[SecretKey,setSecretKey]=useState("");//uncomment for user
    const [transactions, setTransactions] = useState([]);
    const [recipient_key,setrecipient_key]=useState("");
    useEffect(()=>{ //uncomment for user
        getData();
        if(route==="XUSD")
        {
          setrecipient_key("Your bank details shared with Anchor");
        }else if(route==="XETH")
        {
          setrecipient_key(state.wallet.address);
        }
        else{
          setrecipient_key("This Assest Coming Soon.");
        }
        fetchProfileData();
        setpayout_amount("");
    },[route,isFocused])
    
    useEffect(() => {
      setmodal_load(true);
      if (kyc_modal) {
        const timer1 = setTimeout(() => {
          setkyc_modal_text("Verifying KYC")
        }, 3000);
  
        const timer2 = setTimeout(() => {
          setkyc_modal_text("You recived "+payout_amount)
          setmodal_load(false);
        }, 6000);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }, [kyc_modal]);
    
    const fetchProfileData = async () => {
        try {
          const { res, err } = await authRequest("/users/getUserDetails", GET);
          if (err) return console.log(` ${err.message} please log in again!`);
          setemail(res.email)
        } catch (err) {
          console.log(":|:|L|",err)
        }
      };
    



    const getData = async () => {
        try {
            const storedData = await AsyncStorageLib.getItem('myDataKey');
            if (storedData !== null) {

              const parsedData = JSON.parse(storedData);
              const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
              console.log('Retrieved data:', matchedData);
              const publicKey = matchedData[0].publicKey;
              console.log("===========",publicKey)
              setPublicKey(publicKey)
              const secretKey_Key = matchedData[0].secretKey;
              console.log("===========",secretKey_Key)
              setSecretKey(secretKey_Key)
            }
            else {
                console.log('No data found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };
    const sendPayment = async (senderSecretKey, recipientPublicKey, g_amount, g_ASSET) => {
        const local_asset=g_ASSET;
        setshow(true);
        StellarSdk.Network.useTestNetwork();
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        const issuingAccountPublicKey = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
        const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecretKey);
        try {
            const account = await server.loadAccount(senderKeypair.publicKey());
            const XETHAsset = new StellarSdk.Asset(g_ASSET, issuingAccountPublicKey);
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: recipientPublicKey,
                        asset: XETHAsset,
                        amount: g_amount,
                    })
                )
                .addMemo(StellarSdk.Memo.text(email+"-"+g_amount))//TODO
                .setTimeout(30)
                .build();

            transaction.sign(senderKeypair);
            const transactionResult = await server.submitTransaction(transaction);
            console.log('Transaction Successful:', transactionResult);
            setshow(false);
            alert("success", "Payout Success");
            setkyc_modal(true);
            setindex_Anchor(false);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/////")
            SavePayout(issuingAccountPublicKey, recipientPublicKey, transactionResult.created_at, "", g_amount, XETHAsset, "Success");
            if(local_asset==="XETH")
            {
              const amount = parseInt(payout_amount);
              XETH_Payout_backend(email,amount,recipient_key);
            }
        } catch (error) {
            setshow(false);
            setindex_Anchor(false);
            const currentdate = new Date();
            var datetime =currentdate.getDate() + "/"
                      + (currentdate.getMonth()+1)  + "/" 
                      + currentdate.getFullYear() + " at "
                      + currentdate.getHours() + ":"  
                      + currentdate.getMinutes() + ":" 
                      + currentdate.getSeconds();
            SavePayout(issuingAccountPublicKey, recipientPublicKey, datetime, "", g_amount, local_asset, "Faild");
            console.error('Error making payment:', error);
            alert("error", "Payout failed.");
        }
    };

    const XETH_Payout_backend=async(email,amount,recipient_key)=>{
      console.log("----PAYOUT BACKEND CALLED---")
      const token = await getToken()
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+token);
        
        const raw = JSON.stringify({
          "email": email,
          "amount": amount,
          "recipient": recipient_key
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        fetch(REACT_APP_HOST+"/users/xeth_payout", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("status------",result.response.status);
            console.log("hash-------",result.response.transactionHash)
            if(result.response.status===1)
            {
              alert("Success","Payout Completed");
              setkyc_modal(true);
            }
          })
          .catch((error) => console.error(error));
      } catch (error) {
        alert("error","Payout not Executed successfully.")
      }
    }
  
    const get_stellar = async () => {
        try {
            console.log("<><", PublicKey)
            StellarSdk.Network.useTestNetwork();
            const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
            server.loadAccount(PublicKey)
                .then(account => {
                    console.log('Balances for account:',PublicKey);
                    account.balances.forEach(balance => {
                        if(balance.asset_code===route){
                            console.log(`${balance.asset_code}: ${balance.balance}`);
                        setAvailable(balance.balance)
                        setshow(false)
                        }
                    });
                })
                .catch(error => {
                    setshow(false);
                    console.log('Error loading account:', error);
                    // alert("error", "Account Balance not found.");
                });
        } catch (error) {
            console.log("Error in get_stellar")
            alert("error", "Something went wrong.");
        }
    }
    const fetchData = async () => {
        try {
          const result = await getAllDataAndShow('GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI');
          console.log("------",result)
          // setTransactions(result);  // FIXE
          console.log(";;;;;;;",transactions)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const anchor_res=(index)=>{
        setAnchor_modal(false)
        if(index==="SwiftEx")
        {
         setindex_Anchor(true);
         sub_function(SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route);
       }
       else{
         setindex_Anchor(false);
         alert("error","This anchor in Pending.")
       }
      }
    
    useEffect(() => {
      setindex_Anchor(false);
        get_stellar();
        // payout_amount("")
        fetchData();
    }, [PublicKey,route,isFocused])

    const sub_function = (senderSecretKey, recipientPublicKey, g_amount, g_ASSET) => {
        Keyboard.dismiss();
        console.log(">>?", senderSecretKey, recipientPublicKey, g_amount, g_ASSET)
        const temp=parseFloat(payout_amount);
        if(route==="XETH"||route==="XUSD")
        {
        if (temp<=0) {
            alert('error', "Invalid Amount Found.");
           setindex_Anchor(false);
        }
        else {
            sendPayment(senderSecretKey, recipientPublicKey, g_amount, g_ASSET);
        }
      }
      else{
        alert("success","Available Soon");
      }
    }

    const onChangeamount = (input) => {
      const formattedInput = input.replace(/[,\s-]/g, '');
      setpayout_amount(formattedInput)
    };

    const manage_button=(data)=>{
      Alert.alert("Confirm the address",`${recipient_key} `,[
        {
          text:"Cancel",
          onPress:()=>{}
        },
        {
          text:"Confirm",
          onPress:()=>{
            if(data==="XETH"||data==="XUSD")
      {
        setAnchor_modal(true)
      }
      else{
        alert("success","Available Soon");
      }
          }
        }

      ])
      // if(data==="XETH"||data==="XUSD")
      // {
      //   setAnchor_modal(true)
      // }
      // else{
      //   alert("success","Available Soon");
      // }
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
          {/* <TouchableOpacity
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
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalContainer_menu}>
       
      <TouchableOpacity style={styles.modalContainer_option_top}> 
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
      <Image source={Bridge} style={{width:"13%",height:"190%"}} />
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
        color={"#fff"}
      />
      <Text style={[styles.modalContainer_option_text,{color:"#fff"}]}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view} onPress={()=>{setmodalContainer_menu(false)}}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"#fff"}
      />
      <Text style={[styles.modalContainer_option_text,{color:"#fff"}]}>Close Menu</Text>
      </TouchableOpacity>
      </View>
      </TouchableOpacity>
    </Modal>
        </View>
      </View>
        <SafeAreaView style={styles.contener}>
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
                            setpayout_amount("");
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
                            setpayout_amount("");
                        }}>
                        <Text style={[route == "XUSD" ? { color: "#fff" } : { color: "#407EC9" }]}>XUSD</Text>
                    </Pressable>
                </LinearGradient>{
                }
            </View> */}
 <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
        <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:21,textAlign:"center"}}>Crypto Assets</Text>
                <TouchableOpacity style={{marginTop: 5, width: "100%", color: "white", justifyContent:"center",padding:13,borderRadius:10,borderColor:"rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",borderWidth:1 }} onPress={()=>{setchooseModalPair(true)}}>
                  <Text style={{textAlign:"center",color:"#fff",fontSize:19}}>{chooseModaldata}</Text>
                </TouchableOpacity>
                {/* <Picker
                  selectedValue={route}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -15 } : { marginTop: 3, width: "140%", color: "white", marginLeft: -25 }}
                  onValueChange={(itemValue, itemIndex) => setRoute(itemValue)}
                >
                  <Picker.Item label="ETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="USD" value="XUSD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="GBP" value="XGBP" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="INR" value="XINR" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="SWIFTEX" value="SWIFTEX" color={Platform.OS === "ios" ? "gray" : "gray"} />
                </Picker> */}
              </View>

              {/* <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:21,textAlign:"center"}}>Fiat/Crypto</Text>
                <Picker
                  selectedValue={route}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -11 } : { marginTop: 3, width: "140%", color: "white", marginLeft: -25 }}
                  onValueChange={(itemValue, itemIndex) => setRoute(itemValue)}
                >
                  <Picker.Item label="USD" value="XUSD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="ETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                </Picker>
              </View> */}
        </View>


<View style={[styles.Id_text,{marginTop:Platform.OS==="ios"?-19:10,alignItems:"center"}]}>
            <Text style={[ styles.gray,]}>{route === "XUSD" ? index_Anchor===true?XUSD:"SwiftEx" : index_Anchor===true?XETH:"SwiftEx"}</Text>
            <View style={{width:19,height:19}}>
            <Image source={darkBlue} style={{width:40,height:23}}/>
            </View>
</View>
            <View style={{ flexDirection: "row", width: wp(90) }}>
                <Text style={styles.balance}>Available Balance:- </Text>
                <View style={{ width: wp(13) }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(9) }}>
                        <Text style={{ marginLeft: 1.9, color: 'white' }}>
                            {balance ? balance : show === false ? <Text style={{ color: "white" }}>{Available===""?"0.00":Available}</Text> : <></>}
                        </Text>
                        {balance ? balance : show === true ? <ActivityIndicator color={"green"} /> : <></>}
                    </ScrollView>
                </View>
            {route==="XETH"||route==="XUSD"? Available>0.0000000?<></>:<Text style={{color:"red",padding:1.3,paddingHorizontal:2.9}}>Insufficient Balance</Text>:<Text style={{textAlign:"center",color:"orange",paddingHorizontal:2.9}}>Available Soon</Text>}

                {/* {Available>0.0000000?<></>:<Text style={{color:"red",borderColor:"rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",borderWidth:1.9,padding:1.3,borderRadius:10,paddingHorizontal:2.9}}>Insufficient Balance</Text>} */}
            </View>
            <View style={[styles.Id_text,styles.white]}>
            <TextInput  editable={Available>0.0000000} style={{width:"90%",color:"white",padding:1}} placeholder="Payout Amount" placeholderTextColor={"gray"} keyboardType="numeric" returnKeyType="done" value={payout_amount} onChangeText={(amount) => {
                onChangeamount(amount)
                // setpayout_amount(amount)
            }} />
           <Pressable onPress={()=>{setpayout_amount(Available)}}>
           <Text style={{alignSelf:'flex-end',color:'white'}}>MAX</Text>
           </Pressable>
            </View>
            <Text style={{color:"#fff",marginLeft:19}}>{route==="XETH"?"Ether Address":"Bank"}</Text>
            <TextInput editable={route==="XETH"} style={[styles.Id_text, styles.white,{marginTop:5}]} value={recipient_key} onChangeText={(value)=>{
              setrecipient_key(value)
            }}/>
            
            <Pressable style={[styles.button,{backgroundColor:route==="XETH"||route==="XUSD"?"#407EC9":"gray"}]} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route), manage_button(route) }}>

            {/* <Pressable style={styles.button} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route), sub_function(SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route) }}> */}
            {/* <Pressable style={styles.button} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route),payout_amount !== 0 && payout_amount !== null?setAnchor_modal(true):alert("error","Invalid Value")}}> */}
                <Text style={styles.btn_text}>{show === true ? <ActivityIndicator color={"white"} /> : route==="XETH"||route==="XUSD"?"Payout":"Available Soon"}</Text>
            </Pressable>
            <View style={[styles.bottom_text,{marginTop:Platform.OS==="android"?"137%":"145%",}]}>
      <Text style={styles.text_heading}>Your Crypto not supported by the Anchor ?</Text>
      <TouchableOpacity onPress={()=>{navigation.navigate("classic")}}><Text style={styles.text_heading}>Get your wrapped tokens here <Text style={[styles.text_heading,{color:"#4CA6EA"}]}>Bridge Tokens</Text></Text></TouchableOpacity>
      <View>
      </View>
     </View>
            {/* <Text style={{color:'white',fontSize:20,marginLeft:25,marginTop:"10%",fontWeight:"bold"}}>History</Text>
            <View style={{height:"30%",marginTop:10,justifyContent:'center'}}>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{padding:10,marginBottom:10,backgroundColor:'white',margin:15,borderRadius:10}}>
              <Text style={styles.text_color}>Status: <Text style={item.status==="Faild"?{color:'red',fontWeight:'bold'}:{color:"green",fontWeight:'bold'}}>{item.status}</Text></Text>
              <View style={{flexDirection:'row' }}>
              <Text style={styles.text_color}>Sender: </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(1) }}>
                   <Text style={[styles.text_color,styles.width_scrroll]}>{item.senderId}</Text>
                    </ScrollView>
                </View>
                <View style={{flexDirection:'row' }}>
              <Text style={styles.text_color}>Receiver: </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(1) }}>
                   <Text style={[styles.text_color,styles.width_scrroll]}>{item.receiverId}</Text>
                    </ScrollView>
                </View>
              <Text style={styles.text_color}>Amount: {item.g_amount}</Text>
              <Text style={styles.text_color}>Asset: {item.g_ASSET}</Text>
              <Text style={styles.text_color}>Created: {item.date}</Text>
              {/* <Text style={styles.text_color}>Time: {item.time}</Text> */}
            {/* </View> */}
          {/* )} */}
        {/* /> */}
      {/* ) : ( */}
        {/* <Text style={{textAlign:'center',color:'white',fontSize:19}}>No Payout found.</Text> */}
      {/* )} */}
    {/* </View> */}
    <View style={{backgroundColor:"black",}}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={Anchor_modal}
      >
        <View style={styles.container_a}>
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

          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <Text style={{ textAlign: "left", marginHorizontal: 10, marginTop: 10, fontWeight: "bold", fontSize: 20, color: "#fff" }}>Anchors</Text>
            <TouchableOpacity onPress={()=>{setAnchor_modal(false)}}>
          <Icon name={"close"} type={"materialCommunity"} color={"#fff"} size={24} style={{padding:10}} />
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
           {route==="XUSD"&&<Text style={{color:"yellow",textAlign:"center",fontSize:19,marginBottom:8}}>Your bank details shared with Anchor</Text>}
            {/* <TouchableOpacity style={{backgroundColor:"green",width:wp(22),alignSelf:"center",margin:9,borderRadius:10}}>
              <Text style={{padding:11,color:"#fff",fontSize:15,fontWeight:"bold"}}>Procced</Text>
            </TouchableOpacity> */}
        </View>
      </Modal>
       </View>
       <Modal
      animationType="fade"
      transparent={true}
      visible={kyc_modal}>
      <View style={styles.kyc_Container}>
        <View style={styles.kyc_Content}>
    <Image source={darkBlue} style={styles.logoImg_kyc} />
          <Text style={styles.kyc_text}>{kyc_modal_text}</Text>
          {modal_load===true?<ActivityIndicator size="large" color="green" />:<TouchableOpacity onPress={()=>{setkyc_modal(false)}} style={{width:"50%",height:"25%",backgroundColor:"green",marginTop:19,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"#fff",fontSize:19}}>Accept</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </Modal>
    <Modal
        animationType="slide"
        transparent={true}
        visible={chooseModalPair}
      >
        <TouchableOpacity style={styles.chooseModalContainer} onPress={() => setchooseModalPair(false)}>
          <View style={styles.chooseModalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={"gray"}
              onChangeText={text => setChooseSearchQuery(text)}
              value={chooseSearchQuery}
              autoCapitalize='none'
            />
            <FlatList
              data={chooseFilteredItemList}
              renderItem={chooseRenderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
        </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    white: {
        color: 'white'
    },
    gray: {
        color: 'gray'
    },
    contener: {
        backgroundColor: '#011434',
        flex: 1
    },
    Id_text: {
        borderColor: 'rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)',
        padding: 13,
        borderWidth: 1,
        margin: 19,
        borderRadius: 10,
        flexDirection:"row"
    },
    balance: {
        marginLeft: 19.9,
        color: 'white'
    },
    button: {
        backgroundColor: "#407EC9",
        width: wp(40),
        height: hp(6),
        alignSelf: 'center',
        borderRadius: 13,
        justifyContent: 'center',
        marginTop: 9
    },
    btn_text: {
        textAlign: 'center',
        fontSize: 19,
        color: '#fff',
        justifyContent: 'center',
        alignSelf: "center"
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
    toggleContainer: {
        alignSelf: "center",
        marginVertical: hp(4),
        borderColor: "#407EC9",
        borderWidth: StyleSheet.hairlineWidth * 1,
        flexDirection: "row",
        borderRadius: 8,
    },
    text_color:{
        color:"black",
        fontSize:19
    },
    width_scrroll:{
        marginLeft: 1.9
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
        height:hp(28.8),
        width:"94%",
        // alignItems: 'center',
        justifyContent: 'center',
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
  bottom_text:{
    justifyContent:"center",
    alignSelf:"center",
    marginTop:"150%",
    position:"absolute"
  },
  text_heading:{
    fontSize:15,
    color:"#fff"
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
color:"gray",
marginStart:5
},
chooseModalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
chooseModalContent: {
  backgroundColor: 'rgba(33, 43, 83, 1)',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  maxHeight: '80%',
},
searchInput: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingHorizontal: 10,
  color:"#fff"
},
  chooseItemContainer: {
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(28, 41, 77, 1)',
    borderWidth: 0.9,
    borderBottomColor: '#fff',
    marginBottom: 4,
  },
  chooseItemText: {
    marginLeft: 10,
    fontSize: 19,
    color: '#fff',
  },
})
export default Payout;