import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import DialogInput from "react-native-dialog-input";
import { SaveTransaction } from "../utilities/utilities";
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values";
import "@ethersproject/shims";
import TransactionPinModal from "./Modals/transactionPinModal";
import { useBiometricsForSendTransaction } from "../biometrics/biometric";
import { useToast } from 'native-base';
import { alert, ShowToast } from "./reusables/Toasts";
import { CommonActions } from "@react-navigation/native";

var ethers = require("ethers");
const ConfirmTransaction = (props) => {
  const state = useSelector((state) => state);
  const [Cost, setCost] = useState();
  const [disable, setDisable] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [pinViewVisible, setPinViewVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
 const navigation = useNavigation()
 const toast = useToast()

 const Navigate = () => {
  navigation.dispatch((state) => {
    // Remove the home route from the stack
    const routes = state.routes.filter((r) => r.name !== "Confirm Tx");

    return CommonActions.reset({
      ...state,
      routes,
      index: routes.length - 1,
    });
  });
};

 async function sendTx(){
 let provider=props.route.params.info.provider
 let type=props.route.params.info.type
 let rawTransaction=props.route.params.info.rawTransaction
 const emailid = await state.user;
 const token = await state.token;
 setLoading(true);
 setDisable(true);

 if (type === "Eth") {
   let txx = await provider.core
     .sendTransaction(rawTransaction)
     .catch((e) => {
       console.log(e);
       setLoading(false);
     });
   const tx = txx.wait();
   console.log("Sent transaction", await tx);

   if (txx.hash) {
     try {
       const type = "Send";
       const chainType = "Eth";
       const saveTransaction = await SaveTransaction(
         type,
         txx.hash,
         emailid,
         token,
         walletType,
         chainType
       );

       console.log(saveTransaction);
       ShowToast(toast,"Transaction Successful")
      
       setLoading(false);
       setDisable(false);
       Navigate();
       navigation.navigate("Transactions");
     } catch (e) {
       setLoading(false);
       setDisable(false);
       console.log(e);
       
       alert("error",e);
     }
   }
 } else if (type === "Matic") {
   let alchemy = provider;
   let txx = await alchemy.core.sendTransaction(
     rawTransaction
   );
   console.log("Sent transaction", txx.hash);
   if (txx.hash) {
     try {
       const type = "Send";
       const chainType = "Matic";

       const saveTransaction = await SaveTransaction(
         type,
         txx.hash,
         emailid,
         token,
         walletType
       );

       console.log(saveTransaction);
       ShowToast(toast,"Transaction Successful")

       setLoading(false);
       setDisable(false);
       setPinViewVisible(false);
       Navigate();
       navigation.navigate("Transactions");
     } catch (e) {
       setDisable(false);
       setLoading(false);
       console.log(e);
       alert("error",e);
     }
   }
 } else if (type === "BSC") {
   const txx = await provider
     .sendTransaction(rawTransaction)
     .catch((e) => {
       return alert("error",e);
     }); //SendTransaction(signer, token)
   if (txx.hash) {
     try {
       const type = "Send";
       const chainType = "BSC";

       const saveTransaction = await SaveTransaction(
         type,
         txx.hash,
         emailid,
         token,
         walletType,
         chainType
       );

       console.log(saveTransaction);
       ShowToast(toast,"Transaction Successful")

       setLoading(false);
       setDisable(false);
       Navigate()
       navigation.navigate("Transactions");
     } catch (e) {
       setDisable(false);
       setLoading(false);
       console.log(e);
       alert("error",e);
     }
   }
 } else {
   try {
     const client = provider;
     const signed = rawTransaction;
     const tx = await client.submitAndWait(signed.tx_blob);
     const type = "Send";
     const chainType = "Xrp";

     const saveTransaction = await SaveTransaction(
       type,
       signed.hash,
       emailid,
       token,
       walletType,
       chainType
     );

     console.log(saveTransaction);
     ShowToast(toast,"Transaction Successful")

     setLoading(false);
     setDisable(false);
     console.log(tx);
     Navigate()
     navigation.navigate("Transactions");
   } catch (e) {
     setDisable(false);
     setLoading(false);
     console.log(e);
     alert("error","please try again");
   }
 }
}


  useEffect(async () => {
    const user = await state.user;
    console.log(user);
    AsyncStorageLib.getItem("walletType").then(async (type) => {
      console.log(JSON.parse(type));
      const Type = JSON.parse(type);
      setWalletType(Type);
    });
    const fee = props.route.params.info.fee;
    const transactionCost = fee.toString();
    setCost(ethers.utils.formatEther(transactionCost));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{ opacity: fadeAnim }}
    >
      <View style={style.Body}>
        <View style={{ alignItems: "center" }}>
          <Text style={style.welcomeText}>Transaction details</Text>
          <Text style={style.welcomeText}>
            {" "}
            {props.route.params.info.amount}{" "}
          </Text>
        </View>
        <Text style={style.welcomeText2}> From: </Text>
        <Text style={style.welcomeText2}>
          {" "}
          {props.route.params.info.addressFrom}
        </Text>
        <Text style={style.welcomeText2}> To: </Text>
        <Text style={style.welcomeText2}>
          {" "}
          {props.route.params.info.addressTo}
        </Text>

        <Text style={style.welcomeText2}>
          Fee: {Cost ? Cost : "evaluating fees"} {props.route.params.info.type}
        </Text>
        <Text style={style.welcomeText2}>
          Final Amount (Amount+fee) :  {props.route.params.info.finalAmount}
        </Text>

        {Loading ? (
          <View style={{ marginBottom: hp("-4") }}>
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <Text> </Text>
        )}
        <View style={style.Button}>
          <Button
            title="confirm"
            color={"green"}
            disabled={disable ? true : false}
            onPress={async() => {
              //setVisible(!visible)
              

                const biometric = await AsyncStorageLib.getItem('Biometric')
                if(biometric==='SET'){
                  try{

                    useBiometricsForSendTransaction(sendTx)
                    return
                  }catch(e)
                  {
                    console.log(e)
                  }
                }
              
              //checkBioMetric()
              const type = props.route.params.info.type;
              console.log(type);
              setPinViewVisible(true);
              setLoading(true);
              setDisable(true);
             
            }}
          ></Button>
        </View>
      </View>
      <TransactionPinModal
        setPinViewVisible={setPinViewVisible}
        pinViewVisible={pinViewVisible}
        provider={props.route.params.info.provider}
        type={props.route.params.info.type}
        rawTransaction={props.route.params.info.rawTransaction}
        walletType={walletType}
        SaveTransaction={SaveTransaction}
        setLoading={setLoading}
        setDisable={setDisable}
      />
    </Animated.View>
  );
};

export default ConfirmTransaction;

const style = StyleSheet.create({
  Body: {
    display: "flex",
    backgroundColor: "#131E3A",
    height: hp(100),
    width: wp(100),
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(5),
    alignItems: "center",
  },
  welcomeText2: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: hp(5),
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
    color: "#fff",
    marginTop: hp("2"),
    width: wp("70"),
    paddingRight: wp("7"),
    backgroundColor: "white",
    borderColor: "white",
  },
});
