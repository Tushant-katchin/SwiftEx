import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Button,
  Image,
  Animated,
  Easing,
  FlatList
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { _getCurrencyOptions } from "./newAccount.model";
import { alert } from "../../../../reusables/Toasts";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../../../icon";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native';
import { EthereumSecret, smart_contract_Address,RPC } from "../../../../constants";
import contractABI from './contractABI.json';
import { authRequest, GET, getToken, POST } from "../api";
import { REACT_APP_HOST } from "../ExchangeConstants";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Bridge from "../../../../../../assets/Bridge.png";
const Web3 = require('web3');
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const alchemyUrl = RPC.ETHRPC;
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
export const NewOfferModal = () => {
  const [chooseSearchQuery, setChooseSearchQuery] = useState('');
  const back_data=useRoute();
  const { user, open, getOffersData, onCrossPress }=back_data.params;
  const isFocused = useIsFocused();
  const state = useSelector((state) => state);
  const [loading, setloading] = useState(false)
  const [show, setshow] = useState(false)
  const [activ,setactiv]=useState(true);
  const [selectedValue, setSelectedValue] = useState("XETH");
  const [SelectedBaseValue, setSelectedBaseValue] = useState("XUSD");
  const [Balance, setbalance] = useState('');
  const [offer_amount, setoffer_amount] = useState('');
  const [offer_price, setoffer_price] = useState('');
  const [AssetIssuerPublicKey, setAssetIssuerPublicKey] = useState("");
  const [route, setRoute] = useState("BUY");
  const [Loading, setLoading] = useState(false);
  const [u_email,setemail]=useState('');
  const [titel,settitel]=useState("UPDATING..");
  // const [PublicKey, setPublicKey] = useState("GBHRHA3KGRJBXBFER7VHI3WS5SKUXOP5TQ3YITVD7WJ2D3INGK62FZJR");
  // const [SecretKey, setSecretKey] = useState("SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ");
  const [PublicKey, setPublicKey] = useState("");
  const [SecretKey, setSecretKey] = useState("");
  const inActiveColor = ["#131E3A", "#131E3A"];
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const navigation = useNavigation()
  const [show_bal,setshow_bal]=useState(false);
  const [deposit_loading,setdeposit_loading]=useState(false);
  const [postData, setPostData] = useState({
    email: "",
    publicKey: "",
  });
const [eth_modal_visible,seteth_modal_visible]=useState(false);
const [eth_modal_amount,seteth_modal_amount]=useState("");
const [eth_modal_load,seteth_modal_load]=useState(false);
const [account_message,setaccount_message]=useState('');
const [info_amount,setinfo_amount]=useState(false);
const [info_price,setinfo_price]=useState(false);
const [info_,setinfo_]=useState(false);
const [isVisible, setIsVisible] = useState(true);
const [modalContainer_menu,setmodalContainer_menu]=useState(false);
const [chooseModalPair,setchooseModalPair]=useState(false);
const getAccountDetails = async () => {
      const storedData = await AsyncStorageLib.getItem('myDataKey');
      const parsedData = JSON.parse(storedData);
      const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
      console.log('Retrieved data:', matchedData);
      const publicKey = matchedData[0].publicKey;
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      // console.log("_+++++++",res.email)
      setPostData({
        email: res.email,
        publicKey: publicKey,
      })
      setemail(res.email);
      if (err) return setMessage(` ${err.message} please log in again!`);

    } catch (err) {
      //console.log(err)
      setMessage(err.message || "Something went wrong");
    }
};

const chooseItemList = [
  { id: 1, name: "ETH/USDC" ,base_value:"XUSD",counter_value:"XETH",visible_0:"ETH",visible_1:"USDC"},
  { id: 2, name: "BTC/XLM" ,base_value:"XETH",counter_value:"XUSD",visible_0:"BTC",visible_1:"XLM"},
  { id: 3, name: "SWIFTEX/XLM" ,base_value:"XETH",counter_value:"XUSD",visible_0:"SWIFTEX",visible_1:"XLM"},
  { id: 4, name: "ETH/XLM" ,base_value:"XETH",counter_value:"XUSD",visible_0:"ETH",visible_1:"XLM"},
  { id: 5, name: "USDC/ETH" ,base_value:"XETH",counter_value:"XUSD",visible_0:"USDC",visible_1:"ETH"},

]
const [visible_value, setvisible_value] = useState(chooseItemList[0].name);
const [top_value,settop_value]=useState(chooseItemList[0].visible_0)
const [top_value_0,settop_value_0]=useState(chooseItemList[0].visible_1)
const chooseFilteredItemList = chooseItemList.filter(
  item => item.name.toLowerCase().includes(chooseSearchQuery.toLowerCase())
);
const chooseRenderItem = ({ item }) => (
  <TouchableOpacity onPress={() => {setvisible_value(item.name),settop_value(item.visible_0),settop_value_0(item.visible_1),setSelectedValue(item.base_value),setSelectedBaseValue(item.counter_value),setchooseModalPair(false)}} style={styles.chooseItemContainer}>
    <Text style={styles.chooseItemText}>{item.name}</Text>
  </TouchableOpacity>
);
  ///////////////////////////////////start offer function
 const Save_offer = async (asset, amount, price, forTransaction, status, date) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + asset + amount + date);
    let userTransactions = [];

    try {
        const transactions = await AsyncStorageLib.getItem(`offer_data`);
        console.log(JSON.parse(transactions));

        const data = JSON.parse(transactions);

        if (data) {
            data.forEach((item) => {
                userTransactions.push(item);
            });

            console.log("Existing transactions:", userTransactions);

            let txBody = {
                asset,
                amount,
                price,
                forTransaction,
                status,
                date,
            };
            userTransactions.push(txBody);
            await AsyncStorageLib.setItem(`offer_data`, JSON.stringify(userTransactions));
        } else {
            let transactions = [];
            let txBody = {
                asset,
                amount,
                price,
                forTransaction,
                status,
                date,
            };
            transactions.push(txBody);

            await AsyncStorageLib.setItem(`offer_data`, JSON.stringify(transactions));

            userTransactions = transactions;
        }

        console.log("Updated userTransactions:", userTransactions);

        return userTransactions;
    } catch (error) {
        console.error("Error saving transaction:", error);
        throw error;
    }
};
  async function Sell() {
    const temp_amount=parseInt(offer_amount);
    const temp_offer_price=parseInt(offer_price);
   if(temp_amount<=0||temp_offer_price<=0)
   {
    setLoading(false);
    alert("error","Invalid value")

   }else{
     const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Sell Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price, SecretKey, AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
      const counter_asset_buy = new StellarSdk.Asset(SelectedBaseValue, AssetIssuerPublicKey);
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
      const offer = StellarSdk.Operation.manageOffer({
        selling: base_asset_sell,
        buying: counter_asset_buy,
        amount: offer_amount, // XETH to sell
        price: offer_price, // 1 XETH in terms of XUSD
        offerId: parseInt(0)
      });

      const offerTx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(offer)
        .setTimeout(30)
        .build();
      offerTx.sign(sourceKeypair);
      const offerResult = await server.submitTransaction(offerTx);
      console.log('=> Sell Offer placed...',offerResult.hash);
      Save_offer(base_asset_sell, offer_amount, offer_price, "Sell", "Success", offerResult.hash);
      alert("success", "Sell offer created.");
      setLoading(false)
      // setOpen(false);
      return 'Sell Offer placed successfully';
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
      alert("error", "Sell Offer not-created.");
      setLoading(false)
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
   }
  }

  async function Buy() {
    const temp_amount=parseInt(offer_amount);
    const temp_offer_price=parseInt(offer_price);
   if(temp_amount<=0||temp_offer_price<=0)
   {
    setLoading(false);
    alert("error","Invalid value")

   }else{
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Buy Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price, SecretKey, AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
      const counter_asset_buy = new StellarSdk.Asset(SelectedBaseValue, AssetIssuerPublicKey);
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
      const offer = StellarSdk.Operation.manageOffer({
        selling: base_asset_sell,
        buying: counter_asset_buy,
        amount: offer_amount,
        price: offer_price,
        offerId: parseInt(0)
      });

      const offerTx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(offer)
        .setTimeout(30)
        .build();
      offerTx.sign(sourceKeypair);
      const offerResult = await server.submitTransaction(offerTx);
      console.log("++++++++++++++++++++++++++++",offerResult)
      console.log('=> Buy Offer placed...');
      Save_offer(counter_asset_buy, offer_amount, offer_price, "Buy", "Success", "1234");
      alert("success", "Buy offer created.")
      setLoading(false)
      // setOpen(false);
      return 'Sell Offer placed successfully';
    } catch (error) {
      alert("error", "Buy offer not-created.");
      setLoading(false)
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  }




  async function getAssetIssuerId(_code) {
    try {
      const account = await server.loadAccount(PublicKey);

      account.balances.forEach((balance) => {
        if (_code === balance.asset_code) {
          setAssetIssuerPublicKey(balance.asset_issuer)
          console.log("L:::::> ", AssetIssuerPublicKey)
        }
      });
    } catch (error) {
      console.log('Error loading account:', error);
    }
  }

  //////////////////////////////////end
  const getData = async () => {
    try {
      const data = await AsyncStorageLib.getItem('myDataKey');
      if (data) {
        const parsedData = JSON.parse(data);
        const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
        console.log('Retrieved data:', matchedData);
        const publicKey = matchedData[0].publicKey;
        console.log("===========",publicKey)
        setPublicKey(publicKey)
        const secretKey_Key = matchedData[0].secretKey;
        console.log("===========",secretKey_Key)
        setSecretKey(secretKey_Key)
      } else {
        console.log('No data found for key steller keys');
      }
    } catch (error) {
      console.error('Error getting data for key steller keys:', error);
    }
  };
  

  const get_stellar = async (asset) => {
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
       
          setbalance("");
          setshow(true)
          console.log("<><", publicKey)
          StellarSdk.Network.useTestNetwork();
          const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
          server.loadAccount(publicKey)
            .then(account => {
              console.log('Balances for account:', publicKey);
              account.balances.forEach(balance => {
                if (balance.asset_code === asset) {
                  console.log(`${balance.asset_code}: ${balance.balance}`);
                  setbalance(balance.balance)
                  setshow_bal(true)
                  setactiv(false)
                }
              });
              setshow(false)
            })
            .catch(error => {
              console.log('Error loading account:', error);
              // alert("error", "Account Balance not found.");
              setshow(false)
              setactiv(true)
              settitel("Activate Stellar Account for trading")
            });
        // }
      }
      else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.log("Error in get_stellar")
      alert("error", "Something went wrong.");
      setshow(false)
    }
  }

  const offer_creation = () => {
    if(selectedValue==="XETH"||selectedValue==="XUSD")
    {
    getData();
    if (titel!=="Activate Stellar Account for trading" && offer_amount !== "" && offer_price !== ""&& offer_amount !== "0"&& offer_price !== "0"&& offer_amount !== "."&& offer_price !== "."&& offer_amount !== ","&& offer_price !== ",") {
      { route === "SELL" ? Sell() : Buy() }
    }
    else {
      titel==="Activate Stellar Account for trading"? alert("success", "Activation Required"):alert("error", "Input Correct Value.")
      setLoading(false)
    }
    }
    else{
      setLoading(false)
      alert("success", "Available Soon.")
    }
  }
  const active_account=async()=>{
    console.log("<<<<<<<clicked");
    
    // const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
    const token = await getToken();
    console.log(token)
  try {
        settitel("Activating.....");
    const response = await fetch(REACT_APP_HOST+'/users/updatePublicKeyByEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();
     if(data.success===true)
     {
      Account_active()
     }
    if (response.ok) {
      console.log("===",data.success);
    } else {
      console.error('Error:', data);
      setactiv(false)
      settitel("Activate Stellar Account for trading");
      alert("error","Internal server error.")
    }
  } catch (error) {
    settitel("Activate Stellar Account for trading");
    console.error('Network error:', error);
    alert("error","Something went worng.")
    setactiv(true)
  }
  
  }
  const changeTrust = async (g_asset, secretKey) => {
    try {
        settitel("Adding trust...")
        const account = await server.loadAccount(StellarSdk.Keypair.fromSecret(secretKey).publicKey());

        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Network.current().networkPassphrase,
        })
            .addOperation(
                StellarSdk.Operation.changeTrust({
                    asset: new StellarSdk.Asset(g_asset, "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"),
                })
            )
            .setTimeout(30)
            .build();

        transaction.sign(StellarSdk.Keypair.fromSecret(secretKey));

        const result = await server.submitTransaction(transaction);

        console.log(`Trustline updated successfully for ${g_asset}`);
        get_stellar(selectedValue);

    } catch (error) {
        console.error(`Error changing trust for ${g_asset}:`, error);
    }
};

  const Account_active=()=>{
    console.log("clicked")
    changeTrust('XETH', SecretKey)
    .then(() => {
        return changeTrust('XUSD', SecretKey);
    })
    .then(() => {
        console.log('Trustline updates for XETH and XUSD are complete.');
        setactiv(false)
    })
    .catch((error) => {
        console.error('Error:', error);
        setactiv(false)
    });
  }
 
  
  useEffect(()=>{
    getAccountDetails();
    getData();
    get_stellar(selectedValue)
    getAssetIssuerId(selectedValue)

  },[isFocused])
  useEffect(() => {
    getAccountDetails();
    setinfo_(false);
    setinfo_amount(false);
    setinfo_price(false);
    get_stellar(selectedValue)
    getAssetIssuerId(selectedValue)
    // eth_services()
  }, [show_bal,selectedValue, route,isFocused])

 useEffect(()=>{
   setTimeout(()=>{
    // setemail(user.email);
    getAccountDetails();
    // setPostData({
    //   email: u_email,
    //   publicKey: PublicKey,
    // })
    seteth_modal_amount('');
    // console.log("MAIL:===",u_email)
   },1000)
 },[selectedValue, route,isFocused])

//  useEffect(() => {
//    const intervalId = setInterval(() => {
//      setIsVisible((prevVisible) => !prevVisible);
//    }, 1000); // Toggle every 1000 milliseconds (1 second)

//    return () => clearInterval(intervalId);
//  }, []);

 const onChangename = (input) => {
  const formattedInput = input.replace(/[,\s-]/g, '');
  setoffer_price(formattedInput);
};

const onChangeamount = (input) => {
  const formattedInput = input.replace(/[,\s-]/g, '');
  setoffer_amount(formattedInput)
};

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
  outputRange: ['gray', '#fff'],
});
const reves_fun=async(fist_data,second_data)=>{
  settop_value_0(fist_data)
  settop_value(second_data)
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
          <Text style={styles.text_TOP}>Create Offer</Text>
        ) : (
          <Text style={[styles.text_TOP, styles.text1_ios_TOP]}>Create Offer</Text>
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
        </View>
        <Modal
      animationType="fade"
      transparent={true}
      visible={modalContainer_menu}>
       
      <TouchableOpacity style={styles.modalContainer_option_top}  onPress={()=>{setmodalContainer_menu(false)}}> 
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
      <Image source={Bridge} style={{width:"14%",height:"190%"}} />
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
      <View
        style={{
          backgroundColor: "#011434",
          flex:1
        }}
      >
      

      <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 19,
        marginLeft: 6
      }}
    >
      <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 10 }}>
        <Text style={{ fontSize: 24, color: "#fff" }}>{top_value}</Text>
      </View>
      <View style={{ flex: 0 }}>
        <Icon
          name="swap-horizontal"
          type="materialCommunity"
          color="rgba(129, 108, 255, 0.97)"
          size={29}
          onPress={() => { reves_fun(top_value, top_value_0); }}
        />
      </View>
      <View style={{ flex: 1, alignItems: "flex-start", paddingLeft: 10 }}>
        <Text style={{ fontSize: 24, color: "#fff" }}>{top_value_0}</Text>
      </View>
    </View>
       
       <View style={{flexDirection:"row",justifyContent:"space-between",padding:Platform.OS==="android"?10:19}}>
       <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:21,textAlign:"center",marginLeft:Platform.OS==="android"&&30}}>{Platform.OS==="android"?"Trading Pair":"Trading Pair"}</Text>
                <TouchableOpacity  style={Platform.OS === "ios" ? { marginTop: 40, width: '120%', borderColor:"'rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",borderWidth:1, marginLeft: 15,paddingVertical:10 } : { marginTop: 13, width: "90%", color: "white", marginLeft:30,borderColor:"'rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",borderWidth:1,height:"19%",justifyContent:"center",alignItems:"center",borderRadius:5 }} onPress={()=>{setchooseModalPair(true)}}>
                  <Text style={{fontSize:15,color:"#fff"}}>{top_value+"/"+top_value_0}</Text>
                </TouchableOpacity>
                
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

              </View>

              <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={{color:"#fff",fontSize:21,textAlign:"center"}}>Select Offer</Text>
                <Picker
                  mode={"dropdown"}
                  selectedValue={route}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -15 } : { marginTop: 3, width: "90%", color: "white", marginLeft: 14 }}
                  onValueChange={(itemValue, itemIndex) => setRoute(itemValue)}
                >
                  <Picker.Item label="BUY" value="BUY" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="SELL" value="SELL" color={Platform.OS === "ios" ? "white" : "black"} />
                </Picker>
              </View>
       </View>

        
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginTop:Platform.OS==="ios"?-30:-80
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: 'row', width: '60%' }}>
              <Text style={{ color: "white", fontSize: hp(2) }}>Account: </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(3) }}>
                <Text style={{ color: "white", width: '100%', fontSize: hp(2) }}>{PublicKey}</Text>
              </ScrollView>
            </View>

            <View
              style={{
                display: "flex",
                alignSelf: "center",
              }}
            >

            

    <View style={{ flexDirection: "row",alignSelf:"center" }}>
              {activ===true?
              <TouchableOpacity style={styles.background_1} onPress={()=>{active_account()}}>
               <Animated.View style={[styles.frame_1, { borderColor: shiningAnimation }]}>
               <Text style={{color:'green',fontSize:19,textAlign:"center"}}>{titel}</Text>
                </Animated.View>
                </TouchableOpacity>
                :
                <View style={{flexDirection:"row"}}><Text style={styles.balance}>Balance:</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(9),marginLeft:1 }}>
                <Text style={styles.balance}>{Balance ? Number(Balance).toFixed(8) : 0.0} </Text></ScrollView>
                </View>
                }

                { show === true ? selectedValue==="XETH"?<></>:<ActivityIndicator color={"green"} /> : <></>}
              </View>






              
            </View>

           
          </View>
         
          <View
            style={{
              display: "flex",
            }}
          >
            <View style={{width:wp(37),alignSelf:"center"}}>
            {Balance==="0.0000000"&&<Text style={{textAlign:"center",color:"red",borderColor:"red",borderWidth:1.9,borderRadius:10}}>Insufficient Balance</Text>}
            {selectedValue==="XETH"||selectedValue==="XUSD"?<></>:<Text style={{textAlign:"center",color:"orange",borderColor:"orange",borderWidth:1.9,borderRadius:10}}>Available Soon</Text>}

            </View>
            <View style={styles.inputContainer}>
             <View style={{flexDirection:"row"}}>  
              <Text style={styles.unitText}>Amount</Text>
               <TouchableOpacity onPress={()=>{info_amount===false?setinfo_amount(true):setinfo_amount(false)}}>
               <Icon
                      name={"information-outline"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={21}
                      style={{marginLeft:10}}
                    />
               </TouchableOpacity>
{info_amount===true?<View style={{backgroundColor:"gray",backgroundColor:"#212B53",padding:3.6,borderRadius:10,zIndex:20,position:"absolute",marginStart:95}}>
                      <Text style={{color:"white"}}>Offered Amount for {selectedValue}</Text>
                    </View>:<></>}
             </View>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                returnKeyType="done"
                value={offer_amount}
                placeholder={"Amount of " + selectedValue}
                onChangeText={(text) => {
                  onChangeamount(text)
                  // setoffer_amount(text)
                  if (offer_amount > Balance) {
                    alert("error", "Inputed Balance not found in account.");
                  }
                }}
                disabled={Balance==="0.0000000"||Balance==="0"}
                autoCapitalize={"none"}
              />
              <View style={{flexDirection:"row"}}> 
              <Text style={styles.unitText}>Price</Text>
              <TouchableOpacity onPress={()=>{info_price===false?setinfo_price(true):setinfo_price(false)}}>
               <Icon
                      name={"information-outline"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={21}
                      style={{marginLeft:10}}
                    />
               </TouchableOpacity>
{info_price===true?<View style={{backgroundColor:"gray",backgroundColor:"#212B53",padding:3.6,borderRadius:10,zIndex:20,position:"absolute",marginStart:70}}>
                      <Text style={{color:"white"}}>Offered Price for {selectedValue}</Text>
                    </View>:<></>}
              </View>
              <TextInput
                style={styles.input}
                returnKeyType="done"
                keyboardType="numeric"
                value={offer_price}
                placeholder={"Price of " + route.toLocaleLowerCase()}
                onChangeText={(text) => {
                  onChangename(text)
                }}
                autoCapitalize={"none"}
                disabled={Balance==="0.0000000"||Balance==="0"}
              />
            </View>

          </View>
        </View>

        <View style={styles.Buttons}>
        

              <TouchableOpacity
                activeOpacity={true}
                style={[{
                  alignItems: "center", paddingVertical: hp(1.3), paddingHorizontal: wp(1),
                },styles.confirmButton]}
                onPress={() => { setLoading(true), offer_creation() }}
                color="green"
                disabled={Loading||Balance==="0.0000000"}
              >
                <Text style={styles.textColor}>{Loading === true ? <ActivityIndicator color={"white"} /> :"Create Offer"}</Text>
              </TouchableOpacity>
            
          {loading ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (
            <View></View>
          )}

        </View>
         
      </View>


    </>

  );
};

const styles = StyleSheet.create({
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    marginTop: hp("1"),
    borderBottomWidth: 1,
    width: wp(80),
  },
  content: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-evenly",
    marginTop: hp("1"),
    color: "white",
  },
  addingText: {
    color: "#fff",
    fontSize: hp(3),
    borderRadius: 0,
    borderWidth: 0,
    marginVertical: hp(1),
    marginBottom: hp(5)
  },
  assetText: {
    color: "#fff",
    fontSize: hp(2),
    width: wp(25),
    marginLeft: -20,
  },
  currencyText: {
    color: "#fff",
    fontSize: hp(2),
    marginLeft: 7.6,

  },
  down_: {
    marginBottom: -16
  },
  dropdownText: {
    width: wp(28),
    borderColor: "#407EC9",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(70),
  },
  down: {
    marginBottom: -69
  },
  unitText: {
    color: "#fff",
    fontSize: hp(2),
    marginTop: hp(0),
  },
  inputContainer: {
    marginRight: wp(0),
    marginTop: hp(1)
  },
  balance: {
    color: "#fff",
    textAlign: "center",
    marginVertical: hp(2),
    fontSize: hp(2),
  },
  textColor: {
    color: "#fff",
  },
  noteText: {
    color: "#fff",
    marginVertical: hp(3),
    marginHorizontal: wp(17),
    width: wp(58),
    color:"orange"
  },
  confirmButton: {
    alignItems: "center",
    width: wp(30),
    borderRadius:10,
    borderRadius: 9,
    backgroundColor:"#212B53",
    borderColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
    borderWidth:0.9,
  },
  cancelButton: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "green",
    width: wp(23),
    paddingVertical: hp(0.7),
    borderRadius: 6,
    backgroundColor: 'green',
  },
  BuyButton: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "green",
    width: wp(23),
    paddingVertical: hp(1),
    borderRadius: 6,
    margin: 1,
    marginTop: 48,
    backgroundColor: 'green',
    height: 40
  },
  Buttons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(3),
    justifyContent: "center",
    alignSelf: "center",
    width: wp(100),
  },
  cancelText: {
    color: "white",
  },
  crossIcon: {
    alignSelf: "flex-end",
    padding: hp(1)
  },
  toggleContainer: {
    alignSelf: "center",
    marginVertical: hp(3),
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
    marginStart:wp(27)
  },
  text1_ios_TOP: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    marginStart: wp(31),
    top:19,
    fontSize:17
  },
  background_1: {
    // width: '8%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
    marginTop:15,
    marginBottom:5
  },
  frame_1: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10
  },
  text_1: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer_option_top: {
    // flex: 1,
    alignSelf:"flex-end",
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
});
