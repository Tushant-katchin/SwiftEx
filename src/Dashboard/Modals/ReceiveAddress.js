import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Clip,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, Title } from "react-native-paper";
import Bnbimage from "../../../assets/bnb-icon2_2x.png";
import Etherimage from "../../../assets/ethereum.png";
import maticImage from "../../../assets/matic.png";
import xrpImage  from "../../../assets/xrp.png"
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import Moralis from "moralis";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SnackBar from 'react-native-snackbar-component'
import { checkPendingTransactions } from "../../utilities/web3utilities";
import Header from "../reusables/Header";
import ModalHeader from "../reusables/ModalHeader";
const RippleAPI = require('ripple-lib').RippleAPI

const RecieveAddress = ({ modalVisible, setModalVisible, iconType }) => {
  const state = useSelector((state) => state);
  const WalletAddress = useSelector((state) => iconType==='Xrp' && state.wallet.xrp? state.wallet.xrp.address : state.wallet.address);
  const [selected, setSelected] = useState(false);
  const [selected1, setSelected1] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [qrvalue, setQrvalue] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [copiedText, setCopiedText] = useState("");
  const [transactions, setTransactions] = useState("");
  const[newTx,setNewTx] = useState()
  const dispatch = useDispatch();
  const navigation = useNavigation()

  let EtherLeftContent = (props) => (
    <Avatar.Image {...props} source={Etherimage} size={50} />
  );
  let BnbLeftContent = (props) => (
    <Avatar.Image {...props} source={Bnbimage} size={50} />
  );
  let maticLeftContent = (props) => (
    <Avatar.Image {...props} source={maticImage} size={50} />
  );
  let xrpLeftContent = (props) => (
    <Avatar.Image {...props} source={xrpImage} size={50} />
  );
  //iconType==='BNB'?BnbLeftContent:iconType==='ETH'?EtherLeftContent:maticLeftContent

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${state.wallet.address}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(iconType==='Xrp' && state.wallet.xrp? state.wallet.xrp.address:state.wallet.address);
    alert("Copied");
  };

  
  const saveTransactions = async (txData) => {
    const user = await state.user;
    let userTransactions = [];

    await AsyncStorageLib.getItem(`${user}-transactions`).then(
      async (transactions) => {
        console.log(JSON.parse(transactions));
        const data = JSON.parse(transactions);
        if (data) {
          data.map((item) => {
            userTransactions.push(item);
          });
          console.log(userTransactions);

          userTransactions.push(txData);
          await AsyncStorageLib.setItem(
            `${user}-transactions`,
            JSON.stringify(userTransactions)
          );

          return userTransactions;
        } else {
          let transactions = [];

          transactions.push(txData);
          await AsyncStorageLib.setItem(
            `${user}-transactions`,
            JSON.stringify(transactions)
          );
          console.log(transactions);
          return transactions;
        }
      }
    );
  };

  const findNewTransactions = async (transactions, allTransactions) => {
    const walletType = await AsyncStorageLib.getItem("walletType");
    let newArr = [];
    const walletAddress = await state.wallet.address
    let now = +new Date();
    var oneDay = 24 * 60 * 60 * 1000;
    //console.log('Retreiving all transactions from',  minTimestamp);


    allTransactions.filter(async (item, index) => {
      let found;
      let createdAt = +new Date(Date.parse(item.block_timestamp.toString()));

      if(walletAddress){

        //console.log( item.to_address.toUpperCase() == (await state.wallet.address).toUpperCase(),item.hash);
      }
      for (let index = 0; index < transactions.length; index++) {
        if (item.hash == transactions[index].hash) {
          found = true;
        }
      }
      console.log(found);
      if (!found) {
        console.log("TX_Time = ",item.block_timestamp)
        console.log("created at = ",now,createdAt )

        if(item.to_address.toUpperCase() == (await state.wallet.address).toUpperCase() && (now - createdAt) < oneDay){

          newArr.push({
            chainType: walletType==="BSC"?"BSC":walletType=="Ethereum"?"Eth":walletType=='Xrp'?"Xrp":walletType=='Matic'?"Matic":"Eth",
            hash: item.hash,
            type: "receive",
            walletType: JSON.parse(walletType),
          });
        }
      }
    });

    console.log("hi", newArr);

    //console.log("Hi", pendingData);
    return newArr;
  };

  const getTransactions = async () => {
    const user = await AsyncStorageLib.getItem("user");
    const resp = await AsyncStorageLib.getItem(`${user}-transactions`).then(
      (transactions) => {
        const data = JSON.parse(transactions);
        // console.log(data)
        if (data) {
          setTransactions(data.reverse());
          return data;
        }else{
          return []
        }
      }
    );
    return resp;
  };

  const checkIncomingTx = async (transactions,chainId) => {
    try {
      /* await Moralis.start({
        apiKey: "KRXC1pBilfY526QDwlrM1pINBUFgtZ2cLcSB8KYQyvlq3vHbrdknIZlfTK5DL1D0"
      });*/
      const response =
        await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
          chain: chainId,
          address: await state.wallet.address,
        });
      const allTx = response.raw.result;
      //  console.log(transactions);
      console.log("Hi Tx",response.raw.result);

      findNewTransactions(transactions, allTx).then((data) => {
        console.log(data);
        //let saved
        data.map((e) => {
          //console.log(e);
          if(e){
            setTimeout(() => {
              
              setSnackbarVisible(true)
              setNewTx(e)
            }, 0);
            /*saveTransactions(e)
            .then(()=>{
              return true
              
            })*/
          }
         
          

        });
        
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getIncomingXrpTx = (allTransactions, walletType) =>{


// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(async () => {
  console.log('Connected')

  const account_objects_request = {
    "id": 2,
    "command": "account_tx",
    "account": await state.wallet.address,
    "ledger_index_min": -1,
    "ledger_index_max": -1,
    "binary": false,
    "limit": 2,
    "forward": false
  }

  return api.connection.request(account_objects_request)
}).then(response => {
  let receiveTransactions =[]
  let newRecTx =[]
  //console.log("account_objects response:", response.transactions[0].tx, await state.wallet.address)
  const allTx = response.transactions
   allTx.map(async (item)=>{
    console.log(item.tx)
    if(item.tx.Destination===WalletAddress){
      console.log(true)
      receiveTransactions.push({
        hash:item.tx.hash
      })
    }
    //console.log(receiveTransactions)
    
  })
 
  console.log( receiveTransactions)
  //console.log(allTransactions)
  let found
  let newArr=[]
  receiveTransactions.filter((item)=>{
    console.log(item)
    for (let index = 0; index < allTransactions.length; index++) {
      if (item.hash == allTransactions[index].hash) {
        found = true;
      }
    }
    console.log(found);
    if (!found) {

        newArr.push({
          chainType: 'Xrp',
          hash: item.hash,
          type: "receive",
          walletType: walletType,
        });
    
    }
  })
  //console.log(newArr)
  newArr.map((e) => {
    console.log(e);
    if(e){
      setTimeout(() => {
        
        setSnackbarVisible(true)
        setNewTx(e)
      }, 0);
    }
  })
  return newArr
  
// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error) }

const getNewTransactions = async () =>{
  try {
        
    getTransactions().then(async (res) => {
      //console.log(res);
      const walletType = await AsyncStorageLib.getItem("walletType");
    console.log(JSON.parse(walletType))
      if(JSON.parse(walletType)=="BSC"){

        checkIncomingTx(res?res:[],"97");
      }else if(JSON.parse(walletType)=="Ethereum"){
        checkIncomingTx(res?res:[],"5");
      }
      else if(JSON.parse(walletType)=="Matic"){
        checkIncomingTx(res?res:[],"0x13881");
      }
      else if(JSON.parse(walletType)=="Xrp"){
        await getIncomingXrpTx(res?res:[],"Xrp")
        
      }
      else{
        //alert(`Saving receive tx for ${walletType} is  not supported yet`)
        console.log(JSON.parse(walletType))
      }
    });
  } catch (e) {
    console.log(e);
  }
}

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  }, [fadeAnim]);

  useEffect(async () => {
    if (WalletAddress) {
      setQrvalue(WalletAddress);
    }
    //  await check()
  }, []);

  useEffect(async ()=>{
   //await checkPendingTransactions(WalletAddress)
  },[])
  useFocusEffect(
    React.useCallback(() => {
      try {
        
        getTransactions().then(async (res) => {
          //console.log(res);
          const walletType = await AsyncStorageLib.getItem("walletType");
        console.log(JSON.parse(walletType))
          if(JSON.parse(walletType)=="BSC"){

            checkIncomingTx(res?res:[],"97");
          }else if(JSON.parse(walletType)=="Ethereum"){
            checkIncomingTx(res?res:[],"5");
          }
          else if(JSON.parse(walletType)=="Matic"){
            checkIncomingTx(res?res:[],"0x13881");
          }
          else if(JSON.parse(walletType)=="Xrp"){
            await getIncomingXrpTx(res?res:[],"Xrp")
            
          }
          else if(JSON.parse(walletType)==='Multi-coin'){
            
          }
          else{
            //alert(`Saving receive tx for ${walletType} is  not supported yet`)
            console.log(JSON.parse(walletType))
          }
        });
      } catch (e) {
        console.log(e);
      }
    }, [])
  );
  
  const closeModal = () =>{
     setModalVisible(false)
  }

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <Modal
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        animationInTiming={500}
        animationOutTiming={650}
        isVisible={modalVisible}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        statusBarTranslucent={true}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => {
          setModalVisible(false);
        }}
      >
        <View style={style.Body}>
          <ModalHeader Function={closeModal} name={'Address'} />
          <TouchableOpacity style={style.Box3} onPress={() => {}}>
            <Card
              style={{
                width: wp(90),
                height: hp(70),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Card.Title
                titleStyle={{ color: "black" }}
                title={iconType}
                left={
                  iconType === "BNB"
                    ? BnbLeftContent
                    : iconType === "ETH"
                    ? EtherLeftContent
                    :iconType ==="Xrp"
                    ?xrpLeftContent
                    : maticLeftContent
                }
              />
              <Card.Content
                style={{ display: "flex", flexDirection: "row", color: "#fff" }}
              >
                <Title style={{ color: "#fff" }}></Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <QRCode
            //QR code value
            value={qrvalue ? qrvalue : "NA"}
            //size of QR Code
            size={250}
            //Color of the QR Code (Optional)
            color="black"
            //Background Color of the QR Code (Optional)
            backgroundColor="white"
            //Logo of in the center of QR Code (Optional)
            logo={{
              url: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png",
            }}
            //Center Logo size  (Optional)
            logoSize={30}
            //Center Logo margin (Optional)
            logoMargin={2}
            //Center Logo radius (Optional)
            logoBorderRadius={15}
            //Center Logo background (Optional)
            logoBackgroundColor="yellow"
          />
          <Text style={{ marginTop: hp(3) }}>
            Address: { WalletAddress ? WalletAddress : ""}
          </Text>
          <View style={style.Button}>
            <TouchableOpacity
              style={{
                width: wp(14),
                height: hp(7),
                backgroundColor: selected ? "green" : "#D4F1F4",
                marginTop: 10,
                borderRadius: 20,
                marginLeft: wp(-5),
                margin: 10,
              }}
              onPress={() => {
                copyToClipboard();
                setSelected(true);
                setSelected1(false);
               // setSnackbarVisible(true)
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  marginTop: 12,
                }}
              >
                <Text style={{ color: selected ? "white" : "black" }}>
                  Copy
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: wp(14),
                height: hp(7),
                backgroundColor: selected1 ? "green" : "#D4F1F4",
                marginTop: 10,
                borderRadius: 20,
                margin: 10,
              }}
              onPress={() => {
                onShare();
                setSelected1(true);
                setSelected(false);
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  marginTop: 12,
                }}
              >
                <Text style={{ color: selected1 ? "white" : "black" }}>
                  Share
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          </View>
      <SnackBar visible={snackbarVisible} position={'bottom'} textMessage="New Receive Tx Found. Proceed to save it"  
          actionHandler={()=>{
            console.log('pressed')
            setTimeout(() => {
              
              console.log(newTx)    
              saveTransactions(newTx) 
              alert('Tx Saved! Check Transactions page for more details about the Tx')
              setSnackbarVisible(false)
              setModalVisible(false)
              
              //navigation.navigate("Transactions")
            }, 0);
          }} actionText="Proceed"/>
          </Modal>
    </Animated.View>
  );
};

export default RecieveAddress;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "white",
    height: hp(83),
    width: wp(90),
    alignItems: "center",
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    zIndex: 100,
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
    width: wp(20),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
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
