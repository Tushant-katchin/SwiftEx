// import { useEffect, useState, useMemo } from 'react'
// import { authRequest, GET, POST } from "../api";
// import { GOERLI_ETHERSCAN, TX_FEE_IN_USD } from "../utils/constants";
// import { CHAIN_ID_TO_PROVIDER, CHAIN_ID_TO_SCANNER, transfer } from '../web3'
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Linking,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import Modal from "react-native-modal";
// import { DropDown } from "./dropDown";
// import { TextInput } from "react-native-paper";
// import { convertCurrencies } from "../utils/currencyConversion";
// import { useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import WebView from "react-native-webview";
// import { getCurrentChain } from '../utils/chainHandler'
// import { SelectView, _getCurrencyOptions } from './newAccount.model'
// import { getAssetToUsd } from '../utils/assetPriceHandler'
// import AsyncStorageLib from '@react-native-async-storage/async-storage';
// import { getEthTokenBalance } from '../../../../../utilities/web3utilities';
// import { DAI, USDT, WBTC } from '../utils/assetAddress';
// import { useToast } from 'native-base';
// import { ShowToast } from '../../../../reusables/Toasts';

// const _getAssetsOptions = (assetsList) =>
//    assetsList.map(({ name }) => ({ label: name, value: name }))

// export const NewOfferModal = ({ user, open, setOpen, getOffersData }) => {
//   const state = useSelector((state) => state);
//   const navigation = useNavigation();
//   const [modalMessage, setModalMessage] = useState("");
//   const[seeTx, openTx] = useState(false)
//   const [isRefetchingTxFee, setIsRefetchingTxFee] = useState(false);
//   const [txFeeInUsd, setTxFeeInUsd] = useState(TX_FEE_IN_USD);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [transactionHash, setTransactionHash] = useState(null)
//   const [txMessage, setTxMessage] = useState(null)
//   const [txLink, setTxLink] = useState(null)
//   const [loading, setLoading] = useState(false);
//   const [assetsList, setAssetsList] = useState([])
//   const [currentAsset, setCurrentAsset] = useState(null)
//   const [assetsOptions, setAssetsOptions] = useState([])
//   const currencyOptions = useMemo(() => _getCurrencyOptions(), [])
//   const [balance, setBalance] = useState()
//   const [disable, setDisable] = useState(true)
//   const toast = useToast()
//   const [breakDowns, setBreakdowns] = useState({
//     finalPayable: 0,
//     appFee: 0,
//     subTotal: 0,
//     convertedTxFee: null,
//   });
//   const [newOffer, setNewOffer] = useState({
//     amount: "",
//     assetName: "",
//     pricePerUnit: "",
//     currencyName: "",
//   });

//   const assetData = [
//     { label: "ETH", value: "ETH" },
//     { label: "USDT", value: "USDT" },
//     { label: "DAI", value: "DAI" },
//   ];

//   const currencyData = [
//     { label: "US Dollar", value: "USD" },
//     { label: "EURO", value: "EUR" },
//     { label: "Indian Rupee", value: "INR" },
//   ];

//   const getAssetUnitPrice = async (updatedOffer, chosenAsset) => {
//     const { assetName, currencyName } = updatedOffer
//     const { coingechoId } = chosenAsset

//     if (!assetName || !coingechoId) return

//     const unitPriceInUsd = await getAssetToUsd(coingechoId)
//     const unitPrice =
//       !currencyName || currencyName.toUpperCase() === 'USD'
//         ? unitPriceInUsd
//         : await convertCurrencies('usd', currencyName, unitPriceInUsd)

//     return unitPrice
//   }

//   const handleChange = async (input, type) => {
//     const name = type;
//     const value = input;

//     const update = { [name]: value }
//     const { currencyName, pricePerUnit } = newOffer

//     if (name === 'assetName') {
//       const chosenAsset = assetsList.filter(({ name }) => name === value)[0]
//       setCurrentAsset(chosenAsset)
//       getTxFeeData(value, chosenAsset.chainId)
//       update.pricePerUnit = await getAssetUnitPrice(
//         { ...newOffer, ...update },
//         chosenAsset
//       )
//     }

//     if (name === 'currencyName') {
//       update.pricePerUnit = await convertCurrencies(
//         currencyName,
//         value,
//         pricePerUnit
//       )
//     }

//     const newState = { ...newOffer, ...update }
//     setNewOffer(newState);

//     // Calculate break down
//     if (name === 'amount' || name === 'assetName' || name === 'currencyName')
//       if (newState.amount && newState.pricePerUnit)
//         calTotalPayable(
//           newState.amount * newState.pricePerUnit,
//           newState.currencyName
//         );
//   };

//   const submitNewOffer = async (newOffer) => {
//     try {
//       const { err } = await authRequest("/offers/addNewOffer", POST, newOffer);
//       if (err) {
//         setModalMessage(`${err.status}: ${err.message}`);
//         setOpen(false);
//         return alert(err.message ? err.message : "transaction failed");
//       } else {
//         setOpen(false);
//         ShowToast(toast,"New Offer Created Successfully")
//        // alert("New Offer Created Successfully");
//       }
//     } catch (err) {
//       console.log(err);
//       alert(err.message ? err.message : "transaction failed");
//       setModalMessage(err.message || "Something went wrong");
//       setOpen(false);
//     }
//   };

//   const signAssetTransfer = async () => {
//     // connection validation
//     if (!state.wallet.address) {
//       throw new Error("You are not connected to a wallet");
//     }
//     const { res } = await authRequest("/users/getAdminWallet", GET);
//     const sender = await state.wallet.privateKey;
//     const receiver = "0x70200Cf83DB1a2d7c18F089E86a6faA98bFbADAE"; //await state.wallet.address
//     // Get signed transfer
//     const { signedTx, txHash, err } = await transfer(
//       currentAsset.address,
//       res.adminWalletAddress,
//       newOffer.amount,
//       sender,
//       state.wallet.address,
//       currentAsset.chainId,
//     );

//     return { signedTx, txHash, err }
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsSubmitting(true);
//       setLoading(true);
//       console.log(newOffer);
//       // data validation
//       const { amount, assetName, pricePerUnit, currencyName } = newOffer;
//       if (!amount || !assetName || !pricePerUnit || !currencyName)
//         throw new Error("All fields are required");

//         setTxMessage('Setting blockchain transaction parameters.')
//         const { signedTx, txHash, err } = await signAssetTransfer()
//         if (err) throw new Error(err.message || 'transaction failed')
//         if (txHash) setTransactionHash(txHash)
//         if (err) {
//         alert(err.message ? err.message : "transaction failed");
//         throw new Error(err.message || "transaction failed");
//       }

//       const newOfferBody = {
//         ...newOffer,
//         signedTx,
//         chainId: currentAsset.chainId,
//       }
//       await submitNewOffer(newOfferBody);
//     } catch (err) {
//       console.log(err);
//       alert(err.message ? err.message : "transaction failed");
//       setModalMessage(err.message || "transaction failed");
//     } finally {
//       getOffersData();
//       setIsSubmitting(false);
//       setLoading(false);
//       setOpen(false);
//     }
//   };

//   const calTotalPayable = async (subTotal, currencyName) => {
//     // const appFee = (subTotal * APP_FEE_PERCENTAGE).toFixed(2)
//     let convertedTxFee = null;
//     if (currencyName && currencyName !== "USD")
//       convertedTxFee = await convertCurrencies(
//         "USD",
//         currencyName,
//         txFeeInUsd / 2
//       );
//     const finalPayable =
//       subTotal - (currencyName === "USD" ? txFeeInUsd / 2 : convertedTxFee);

//     console.log(finalPayable);
//     setBreakdowns({ finalPayable, subTotal, convertedTxFee });
//   };

//   const getTxFeeData = async (assetName, chainId) => {
//     try {
//       setIsRefetchingTxFee(true);
//       const { err, res: { gasPriceInUsd = TX_FEE_IN_USD } = {} } =
//       await authRequest(`/users/getTxFeeData/${assetName}/${chainId}`, GET)
//       if (err) return setModalMessage(`${err.status}: ${err.message}`);

//       return setTxFeeInUsd(Number(gasPriceInUsd));
//     } catch (err) {
//       console.log(err);
//       setModalMessage(err.message || "Something went wrong");
//     } finally {
//       setIsRefetchingTxFee(false);
//     }
//   };

//   const handleTxEvents = async () => {
//     if (transactionHash) {
//       const ethersProvider = CHAIN_ID_TO_PROVIDER[currentAsset.chainId]
//       const scannerUrl = CHAIN_ID_TO_SCANNER[currentAsset.chainId]

//       setTxMessage(
//         '[BLOCKCHAIN]: The transaction is being submitted to blockchain.'
//       )
//       setTxLink(`${scannerUrl}/tx/${transactionHash}`)

//       const tx = await ethersProvider.getTransaction(transactionHash)
//       if (tx)
//         setTxMessage('[BLOCKCHAIN]: The transaction is pending to be mined.')
//       else
//         ethersProvider.on('pending', (tx) => {
//           if (tx.hash === transactionHash) {
//             setTxMessage(
//               '[BLOCKCHAIN]: The transaction is pending to be mined.'
//             )
//           }
//         })

//       ethersProvider.once(transactionHash, () =>
//         setTxMessage(
//           '[BLOCKCHAIN]: The transaction is mined. Your offer will be added shortly.'
//         )
//       )

//     }
//   }

//   const SeeTransactions = () => {
//     return (
//       <View>
//         <Modal
//           animationIn="slideInRight"
//           animationOut="slideOutRight"
//           animationInTiming={100}
//           animationOutTiming={200}
//           isVisible={seeTx}
//           useNativeDriver={true}
//           onBackdropPress={() => {
//             openTx(false);
//           }}
//           onBackButtonPress={() => {
//             //setShowModal(!showModal);
//             openTx(false);
//           }}
//         >
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#fff",
//               marginTop: 50,
//               height: 10,
//             }}
//           >
//             <WebView
//               source={{ uri: `${txLink}` }}
//             />
//           </View>
//         </Modal>
//       </View>
//     );
//   };

//   const defaultTxFeeDataSetup = async () => {
//     // Get default chain Id from the connected wallet
//     const currentChainId = getCurrentChain()

//     // Get chain native coin/currency
//     const assetName = await getChainNativeAsset(currentChainId)

//     // Get tx fee data
//     await getTxFeeData(assetName, currentChainId)
//   }

//   const getAllAssets = async () => {
//     try {
//       setIsRefetchingTxFee(true)
//       const { err, res } = await authRequest(`/chains/getAllAssets`, GET)
//       if (err) return setModalMessage(`${err.status}: ${err.message}`)
//       setAssetsOptions(_getAssetsOptions(res))
//       return setAssetsList(res)
//     } catch (err) {
//       console.log(err)
//       setModalMessage(err.message || 'Something went wrong')
//     }
//   }

//   const getChainNativeAsset = async (chainId) => {
//     try {
//       setIsRefetchingTxFee(true)
//       const { err, res: { name = null } = {} } = await authRequest(
//         `/chains/getNetworkNativeAsset/${chainId}`,
//         GET
//       )
//       if (err) return setModalMessage(`${err.status}: ${err.message}`)
//       return name
//     } catch (err) {
//       console.log(err)
//       setModalMessage(err.message || 'Something went wrong')
//     }
//   }

//   const getBalance = async (assetName)=>{
//    const walletType = await AsyncStorageLib.getItem('walletType')
//    const walletAdress = await state.wallet.address
//    console.log(walletType)
//     if(assetName=='ETH')
//     {
//       if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
//       {
//         const balance = await state.EthBalance
//         console.log(balance)
//         setBalance(balance)
//         setModalMessage('')
//         return
//       }
//       setDisable(true)
//       return setModalMessage('You need an ethereum or Multi-coin wallet to do this transaction')
//     }
//     else if(assetName=="BNB")
//     {
//       if(JSON.parse(walletType)!=='BNB' || JSON.parse(walletType)!== "Multi-coin"){
//         const balance = await state.walletBalance
//         console.log(balance)
//         setBalance(balance)
//         setModalMessage('')
//         return
//       }
//       setDisable(true)
//       return setModalMessage('You need a BNB or Multi-coin wallet to do this transaction')

//     }
//     else if(assetName=="MATIC")
//     {
//       if(JSON.parse(walletType)=='Matic' || JSON.parse(walletType)=='Multi-coin'){
//       const balance = await state.MaticBalance
//       console.log(balance)
//       setBalance(balance)
//       setModalMessage('')
//       return
//       }
//       setDisable(true)
//       return setModalMessage('You need a BNB wallet to do this transaction')

//     }
//     else if(assetName =="WBTC")
//     {
//       if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
//       {
//         const balance = await getEthTokenBalance(walletAdress,WBTC)
//         console.log(balance)
//         setBalance(balance)
//         setModalMessage('')
//         return
//       }
//       setDisable(true)
//       return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')

//     }
//     else if(assetName =="DAI")
//     {
//       if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
//       {
//         const balance = await getEthTokenBalance(walletAdress,DAI)
//         console.log(balance)
//         setBalance(balance)
//         setModalMessage('')
//         return
//       }
//       setDisable(true)
//       return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')

//     }
//     else if(assetName =="USDT")
//     {
//       if(JSON.parse(walletType)=="Ethereum" || JSON.parse(walletType)=="Multi-coin")
//       {
//         const balance = await getEthTokenBalance(walletAdress,USDT)
//         console.log(balance)
//         setBalance(balance)
//         setModalMessage('')
//         return
//       }
//       setDisable(true)
//       return setModalMessage('You need a ETH or Multi-coin wallet to do this transaction')

//     }

//   }

//   const enableValidation = ()=>
//   {
//     if(newOffer.assetName&&newOffer.amount&&newOffer.currencyName&&newOffer.pricePerUnit&&newOffer.amount<balance)
//     {
//       setDisable(false)

//     }
//     else{
//       setDisable(true)
//       //setModalMessage('All fields are necessary')
//     }

//   }

//   useEffect(() => {
//     defaultTxFeeDataSetup()
//      getAllAssets()
//   }, []);

//   useEffect(() => {
//     handleTxEvents()
//   }, [transactionHash])

//   useEffect(()=>{
//     getBalance(newOffer.assetName)
//   },[newOffer.assetName])
//   useEffect(()=>{
//     enableValidation()
//   },[newOffer])
//   useEffect(()=>{
//     if(newOffer.amount>=balance)
//     {
//       setModalMessage('low balance')
//     }
//     else{
//       setModalMessage('')
//     }
//   },[newOffer.amount])

//   return (

//     <Modal
//       animationIn="slideInRight"
//       animationOut="slideOutRight"
//       animationInTiming={100}
//       animationOutTiming={200}
//       isVisible={true}
//       useNativeDriver={true}
//       useNativeDriverForBackdrop={true}
//       backdropTransitionOutTiming={0}
//       hideModalContentWhileAnimating
//       onBackdropPress={() => {
//         setOpen(false);
//       }}
//       onBackButtonPress={() => {
//         //setShowModal(!showModal);
//         setOpen(false);
//       }}
//     >
//       <View
//         style={{
//           height: hp(95),
//           width: wp(90),
//           backgroundColor: "white",
//           borderTopRightRadius: 10,
//           borderTopLeftRadius: 10,
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <View
//           style={{
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Text>Add New Offer</Text>
//           <Text style={{ color: "red" }}>{modalMessage}</Text>
//           {txMessage && (
//               <View>

//                 <Text>{txMessage}</Text>
//                 {txLink && (
//                   <View>
//                     <Text>Click the link below to check transaction</Text>
//                   <TouchableOpacity onPress={()=>{
//                     //Linking.openURL(txLink)
//                     openTx(true)
//                   }}>
//                     <Text style={{color:'blue'}}>Click here to check tx status</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             )}
//             {newOffer.pricePerUnit ?
//                   <Text> Unit Price: {+newOffer.pricePerUnit.toFixed(2)} {newOffer.currencyName || 'USD'}</Text>
//               :<Text></Text> }

//             <View
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginTop: hp(2),
//             }}
//           >
//             <DropDown
//               Title="Choose Asset"
//               dropdownData={assetsOptions}
//               setNewOffer={setNewOffer}
//               newOffer={newOffer}
//               handleChange={handleChange}
//             />

//             <DropDown
//               Title="Choose Currency"
//               dropdownData={currencyOptions}
//               setNewOffer={setNewOffer}
//               newOffer={newOffer}
//               handleChange={handleChange}
//             />
//           </View>

//           <View
//             style={{
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Text>Enter Amount</Text>
//             <TextInput
//               style={styles.input}
//               keyboardType="numeric"
//               theme={{ colors: { text: "white" } }}
//               value={newOffer.amount}
//               placeholder="Amount"
//               onChangeText={async (text) => {
//                 setNewOffer({
//                   amount:text
//                 })
//                 const type = "amount";
//                await handleChange(text, type);
//               }}
//               autoCapitalize={"none"}
//               placeholderTextColor="#FFF"
//             />

//           </View>
//           </View>

//         <View
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginTop: hp(2),
//           }}

//         >
//           <Text>Balance: {balance}</Text>
//           <Text>Subtotal Payable:</Text>
//           <Text>
//             {breakDowns.subTotal}
//             {newOffer.currencyName}
//           </Text>
//           <View
//             style={{
//               display: "flex",
//               alignItems: "center",
//               alignContent: "center",
//               alignSelf: "center",
//             }}
//           >
//             <Text>Transaction Fee:</Text>
//             {isRefetchingTxFee ? (
//               <View>
//                 <ActivityIndicator color={"blue"} size={"large"} />
//               </View>
//             ) : (
//               <View>
//                 <Text>{txFeeInUsd / 2} USD</Text>
//                 {breakDowns.convertedTxFee && (
//                   <View>
//                     <Text>
//                       {" "}
//                       {breakDowns.convertedTxFee}
//                       {newOffer.currencyName}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>
//           <Text>Total Payable Price:</Text>
//           <Text>{breakDowns.finalPayable.toFixed(2)} {newOffer.currencyName}</Text>
//           <Text>
//             Note: The above totals are just estimations that can vary depending
//             on currency rates.
//           </Text>
//         </View>
//         <View>
//           <View>
//             <Button title="Submit" disabled={disable} onPress={handleSubmit} color="green" />
//           </View>
//           {loading ? (
//             <ActivityIndicator size="small" color="blue" />
//           ) : (
//             <View></View>
//           )}
//           <View style={{ marginTop: hp(1) }}>
//             <Button title="Cancel" color="red"  onPress={() => setOpen(false)} />
//           </View>
//         </View>
//       </View>
//       {
//         txLink&&(
//           <View>
//             <SeeTransactions/>

//           </View>
//         )
//       }
//     </Modal>

//   );
// };

//  const styles = StyleSheet.create({
//    input: {
//      height: hp("5%"),
//      marginBottom: hp("2"),
//      color: "#fff",
//      marginTop: hp("1"),
//      width: wp("60"),
//      backgroundColor: "#131E3A",
//    },
//    content: {
//      display: "flex",
//      alignItems: "center",
//     textAlign: "center",
//     justifyContent: "space-evenly",
//      marginTop: hp("1"),
//     color: "white",
//    },
//  });
/*
<Text>Enter Price</Text>
            <TextInput
              style={styles.input}
              theme={{ colors: { text: "white" } }}
              placeholder="Unit Price"
              value={newOffer.pricePerUnit}
              onChangeText={(text) => {
                const type = "pricePerUnit";
                handleChange(text, type);
              }}
              autoCapitalize={"none"}
              placeholderTextColor="#FFF"
            />
*/

import { useEffect, useState, useMemo } from "react";
import { authRequest, GET, POST } from "../api";
import { GOERLI_ETHERSCAN, TX_FEE_IN_USD } from "../utils/constants";
import { CHAIN_ID_TO_PROVIDER, CHAIN_ID_TO_SCANNER, transfer } from "../web3";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { DropDown } from "./dropDown";
import { TextInput } from "react-native-paper";
import { convertCurrencies } from "../utils/currencyConversion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import WebView from "react-native-webview";
import { getCurrentChain } from "../utils/chainHandler";
import { SelectView, _getCurrencyOptions } from "./newAccount.model";
import { getAssetToUsd } from "../utils/assetPriceHandler";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { getAllBalances, getEthTokenBalance } from "../../../../../utilities/web3utilities";
import { DAI, USDT, WBTC } from "../utils/assetAddress";
import { useToast } from "native-base";
import { alert, ShowToast } from "../../../../reusables/Toasts";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../../../icon";

const _getAssetsOptions = (assetsList) =>
  assetsList.map(({ name }) => ({ label: name, value: name }));

export const NewOfferModal = ({ user, open, setOpen, getOffersData,onCrossPress }) => {
  const state = useSelector((state) => state);
  const navigation = useNavigation();
  const [modalMessage, setModalMessage] = useState("hhhhhhhhhhhhhhhhhhh");
  const [seeTx, openTx] = useState(false);
  const [isRefetchingTxFee, setIsRefetchingTxFee] = useState(false);
  const [txFeeInUsd, setTxFeeInUsd] = useState(TX_FEE_IN_USD);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [txMessage, setTxMessage] = useState(null);
  const [txLink, setTxLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assetsOptions, setAssetsOptions] = useState([]);
  const currencyOptions = useMemo(() => _getCurrencyOptions(), []);
  const [balance, setBalance] = useState();
  const [disable, setDisable] = useState(true);
  const toast = useToast();
  const dispatch = useDispatch()
  const [breakDowns, setBreakdowns] = useState({
    finalPayable: 0,
    appFee: 0,
    subTotal: 0,
    convertedTxFee: null,
  });
  const [newOffer, setNewOffer] = useState({
    amount: "",
    assetName: "",
    pricePerUnit: "",
    currencyName: "",
  });

  const assetData = [
    { label: "ETH", value: "ETH" },
    { label: "USDT", value: "USDT" },
    { label: "DAI", value: "DAI" },
  ];

  const currencyData = [
    { label: "US Dollar", value: "USD" },
    { label: "EURO", value: "EUR" },
    { label: "Indian Rupee", value: "INR" },
  ];

  const getAssetUnitPrice = async (updatedOffer, chosenAsset) => {
    const { assetName, currencyName } = updatedOffer;
    const { coingechoId } = chosenAsset;

    if (!assetName || !coingechoId) return;

    const unitPriceInUsd = await getAssetToUsd(coingechoId);
    const unitPrice =
      !currencyName || currencyName.toUpperCase() === "USD"
        ? unitPriceInUsd
        : await convertCurrencies("usd", currencyName, unitPriceInUsd);

    return unitPrice;
  };

  const handleChange = async (input, type) => {
    const name = type;
    const value = input;

    const update = { [name]: value };
    const { currencyName, pricePerUnit } = newOffer;

    if (name === "assetName") {
      const chosenAsset = assetsList.filter(({ name }) => name === value)[0];
      setCurrentAsset(chosenAsset);
      getTxFeeData(value, chosenAsset.chainId);
      update.pricePerUnit = await getAssetUnitPrice(
        { ...newOffer, ...update },
        chosenAsset
      );
    }

    if (name === "currencyName") {
      update.pricePerUnit = await convertCurrencies(
        currencyName,
        value,
        pricePerUnit
      );
    }

    const newState = { ...newOffer, ...update };
    setNewOffer(newState);

    // Calculate break down
    if (name === "amount" || name === "assetName" || name === "currencyName")
      if (newState.amount && newState.pricePerUnit)
        calTotalPayable(
          newState.amount * newState.pricePerUnit,
          newState.currencyName
        );
  };

  const submitNewOffer = async (newOffer) => {
    try {
      const { err } = await authRequest("/offers/addNewOffer", POST, newOffer);
      if (err) {
        setModalMessage(`${err.status}: ${err.message}`);
        setOpen(false);

        return alert("error", err.message ? err.message : "transaction failed");
      } else {
        setOpen(false);
        ShowToast(toast, "New Offer Created Successfully");
        getBalance(newOffer.assetName);
        getAllBalances(state,dispatch)
        // alert("New Offer Created Successfully");
      }
    } catch (err) {
      console.log(err);
      alert("error", err.message ? err.message : "transaction failed");
      setModalMessage("Something went wrong");
      setOpen(false);
    }
  };

  const signAssetTransfer = async () => {
    // connection validation
    if (!state.wallet.address) {
      throw new Error("You are not connected to a wallet");
    }
    const { res } = await authRequest("/users/getAdminWallet", GET);
    const sender = await state.wallet.privateKey;
    const receiver = "0x70200Cf83DB1a2d7c18F089E86a6faA98bFbADAE"; //await state.wallet.address
    // Get signed transfer
    const { signedTx, txHash, err } = await transfer(
      currentAsset.address,
      res.adminWalletAddress,
      newOffer.amount,
      sender,
      state.wallet.address,
      currentAsset.chainId
    );

    return { signedTx, txHash, err };
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      console.log(newOffer);
      // data validation
      const { amount, assetName, pricePerUnit, currencyName } = newOffer;
      if (!amount || !assetName || !pricePerUnit || !currencyName)
        throw new Error("All fields are required");

      setTxMessage("Setting blockchain transaction parameters.");
      const { signedTx, txHash, err } = await signAssetTransfer();
      if (err) throw new Error(err.message || "transaction failed");
      if (txHash) setTransactionHash(txHash);
      if (err) {
        alert("error", err.message ? err.message : "transaction failed");
        throw new Error( "transaction failed");
      }

      const newOfferBody = {
        ...newOffer,
        signedTx,
        chainId: currentAsset.chainId,
      };
      await submitNewOffer(newOfferBody);
    } catch (err) {
      console.log(err);
      alert("error", err.message ? err.message : "transaction failed");
      setModalMessage("transaction failed");
    } finally {
      getOffersData();
      setIsSubmitting(false);
      setLoading(false);
      setOpen(false);
    }
  };

  const calTotalPayable = async (subTotal, currencyName) => {
    // const appFee = (subTotal * APP_FEE_PERCENTAGE).toFixed(2)
    let convertedTxFee = null;
    if (currencyName && currencyName !== "USD")
      convertedTxFee = await convertCurrencies(
        "USD",
        currencyName,
        txFeeInUsd / 2
      );
    const finalPayable =
      subTotal - (currencyName === "USD" ? txFeeInUsd / 2 : convertedTxFee);

    console.log(finalPayable);
    setBreakdowns({ finalPayable, subTotal, convertedTxFee });
  };

  const getTxFeeData = async (assetName, chainId) => {
    try {
      setIsRefetchingTxFee(true);
      const { err, res: { gasPriceInUsd = TX_FEE_IN_USD } = {} } =
        await authRequest(`/users/getTxFeeData/${assetName}/${chainId}`, GET);
      if (err) return setModalMessage(`${err.status}: ${err.message}`);

      return setTxFeeInUsd(Number(gasPriceInUsd));
    } catch (err) {
      console.log(err);
      setModalMessage(err.message || "Something went wrong");
    } finally {
      setIsRefetchingTxFee(false);
    }
  };

  const handleTxEvents = async () => {
    if (transactionHash) {
      const ethersProvider = CHAIN_ID_TO_PROVIDER[currentAsset.chainId];
      const scannerUrl = CHAIN_ID_TO_SCANNER[currentAsset.chainId];

      setTxMessage(
        "[BLOCKCHAIN]: The transaction is being submitted to blockchain."
      );
      setTxLink(`${scannerUrl}/tx/${transactionHash}`);

      const tx = await ethersProvider.getTransaction(transactionHash);
      if (tx)
        setTxMessage("[BLOCKCHAIN]: The transaction is pending to be mined.");
      else
        ethersProvider.on("pending", (tx) => {
          if (tx.hash === transactionHash) {
            setTxMessage(
              "[BLOCKCHAIN]: The transaction is pending to be mined."
            );
          }
        });

      ethersProvider.once(transactionHash, () =>
        setTxMessage(
          "[BLOCKCHAIN]: The transaction is mined. Your offer will be added shortly."
        )
      );
    }
  };
  const SeeTransactions = () => {
    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={seeTx}
          useNativeDriver={true}
          onBackdropPress={() => {
            openTx(false);
          }}
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            openTx(false);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 50,
              height: 10,
            }}
          >
            <WebView source={{ uri: `${txLink}` }} />
          </View>
        </Modal>
      </View>
    );
  };

  const defaultTxFeeDataSetup = async () => {
    // Get default chain Id from the connected wallet
    const currentChainId = getCurrentChain();

    // Get chain native coin/currency
    const assetName = await getChainNativeAsset(currentChainId);

    // Get tx fee data
    await getTxFeeData(assetName, currentChainId);
  };

  const getAllAssets = async () => {
    try {
      setIsRefetchingTxFee(true);
      const { err, res } = await authRequest(`/chains/getAllAssets`, GET);
      if (err) return setModalMessage(`${err.status}: ${err.message}`);
      setAssetsOptions(_getAssetsOptions(res));
      return setAssetsList(res);
    } catch (err) {
      console.log(err);
      setModalMessage("Something went wrong");
    }
  };

  const getChainNativeAsset = async (chainId) => {
    try {
      setIsRefetchingTxFee(true);
      const { err, res: { name = null } = {} } = await authRequest(
        `/chains/getNetworkNativeAsset/${chainId}`,
        GET
      );
      if (err) return setModalMessage(`${err.status}: ${err.message}`);
      return name;
    } catch (err) {
      console.log(err);
      setModalMessage("Something went wrong");
    }
  };

  const getBalance = async (assetName) => {
    const walletType = await AsyncStorageLib.getItem("walletType");
    const walletAdress = await state.wallet.address;
    console.log(walletType);
    console.log("assetname", assetName);
    if (assetName == "ETH") {
      if (
        JSON.parse(walletType) == "Ethereum" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        const balance = await state.EthBalance;
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage(
        "You need an ethereum or Multi-coin wallet to do this transaction"
      );
    } else if (assetName == "BNB") {
      if (
        JSON.parse(walletType) == "BNB" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        
        const balance = await state.walletBalance;
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage(
        "You need a BNB or Multi-coin wallet to do this transaction"
      );
    } else if (assetName == "MATIC") {
      if (
        JSON.parse(walletType) == "Matic" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        const balance = await state.MaticBalance;
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage("You need a BNB wallet to do this transaction");
    } else if (assetName == "WBTC") {
      if (
        JSON.parse(walletType) == "Ethereum" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        const balance = await getEthTokenBalance(walletAdress, WBTC);
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage(
        "You need a ETH or Multi-coin wallet to do this transaction"
      );
    } else if (assetName == "DAI") {
      if (
        JSON.parse(walletType) == "Ethereum" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        const balance = await getEthTokenBalance(walletAdress, DAI);
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage(
        "You need a ETH or Multi-coin wallet to do this transaction"
      );
    } else if (assetName == "USDT") {
      if (
        JSON.parse(walletType) == "Ethereum" ||
        JSON.parse(walletType) == "Multi-coin"
      ) {
        const balance = await getEthTokenBalance(walletAdress, USDT);
        console.log(balance);
        setBalance(balance);
        setModalMessage("");
        return;
      }
      setDisable(true);
      return setModalMessage(
        "You need a ETH or Multi-coin wallet to do this transaction"
      );
    }
  };

  const enableValidation = () => {
    if (
      newOffer.assetName &&
      newOffer.amount &&
      newOffer.currencyName &&
      newOffer.pricePerUnit &&
      Number(newOffer.amount) < Number(balance)
    ) {
      setDisable(false);
    } else {
      setDisable(true);
      //setModalMessage('All fields are necessary')
    }
  };

  useEffect(() => {
    console.log(newOffer);
    defaultTxFeeDataSetup();
    getAllAssets();
  }, []);

  useEffect(() => {
    handleTxEvents();
  }, [transactionHash]);

  useEffect(() => {
    console.log(newOffer);
    getBalance(newOffer.assetName);
  }, [newOffer.assetName]);
  useEffect(() => {
    enableValidation();
  }, [newOffer]);
  useEffect(() => {
    if (Number(newOffer.amount) >= Number(balance)) {
      setModalMessage("low balance");
    } else {
      setModalMessage("");
    }
  }, [newOffer.amount]);

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={100}
      animationOutTiming={200}
      isVisible={open}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={() => {
        setOpen(false);
      }}
      onBackButtonPress={() => {
        //setShowModal(!showModal);
        setOpen(false);
      }}
    >
      <View
        style={{
          height: hp(96),
          // paddingBottom:hp(10),
          paddingVertical: hp(3),
          width: wp(95),
          backgroundColor: "#131E3A",
          borderRadius: 10,
          borderBottomLeftRadius: 10,
          alignSelf: "center",
          display: "flex",
          // alignItems: "center",
        }}
      >
        <Icon type={'entypo'} name='cross' color={'gray'} size={24} style={styles.crossIcon} onPress={onCrossPress}/>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text style={styles.addingText}>Adding Offer</Text>

          <Text style={{ color: "white" }}>{modalMessage.slice(0, 100)}</Text>
          {txMessage && (
            <View>
              <Text style={{ color: "white" }}>{txMessage}</Text>
              {txLink && (
                <View>
                  <Text style={{ color: "white" }}>
                    Click the link below to check transaction
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      //Linking.openURL(txLink)
                      openTx(true);
                    }}
                  >
                    <Text style={{ color: "#4CA6EA" }}>
                      Click here to check tx status
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          {newOffer.pricePerUnit ? (
            <Text style={{ color: "white" }}>
              {" "}
              Unit Price: {+newOffer.pricePerUnit.toFixed(2)}{" "}
              {newOffer.currencyName || "USD"}
            </Text>
          ) : (
            <Text></Text>
          )}

          <View
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <View style={styles.dropdownContainer}>
              <View>
                <Text style={styles.assetText}>Select Asset</Text>
                <DropDown
                  dropdownStyle={styles.dropdownText}
                  placeholderTextStyle={{ color: "white" }}
                  Title="Assets"
                  dropdownData={assetsOptions}
                  setNewOffer={setNewOffer}
                  newOffer={newOffer}
                  handleChange={handleChange}
                />
              </View>
              <View>
                <Text style={styles.currencyText}>Select Curency</Text>

                <DropDown
                  placeholderTextStyle={{ color: "white" }}
                  dropdownStyle={styles.dropdownText}
                  Title="INR"
                  dropdownData={currencyOptions}
                  setNewOffer={setNewOffer}
                  newOffer={newOffer}
                  handleChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.unitText}>Enter Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                // theme={{ colors: { text: "white" } }}
                value={newOffer.amount}
                placeholder="1,00,000"
                onChangeText={async (text) => {
                  setNewOffer({
                    amount: text,
                  });
                  const type = "amount";
                  await handleChange(text, type);
                }}
                autoCapitalize={"none"}
                // placeholderTextColor="#FFF"
              />
            </View>
            <Text style={styles.priceMsg}>
              0.001 Eth for 1,00,000 INR Unit Price!
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            alignSelf: "center",
            marginTop: hp(2),
          }}
        >
          <Text style={styles.balance}>Balance: {balance}</Text>
          <View style={styles.subTotal}>
            <Text style={styles.textColor}>Subtotal:</Text>

            <Text style={styles.textColor}>
              {breakDowns.subTotal}
              {newOffer.currencyName}
            </Text>
          </View>
          <View style={styles.subTotal}>
            <Text style={styles.transactionColor}>Transaction Fee:</Text>
            {isRefetchingTxFee ? (
              <View>
                <ActivityIndicator color={"blue"} size={"large"} />
              </View>
            ) : (
              <View>
                <Text style={styles.textColor}>{txFeeInUsd / 2} USD</Text>
                {breakDowns.convertedTxFee && (
                  <View>
                    <Text style={styles.textColor}>
                      {" "}
                      {breakDowns.convertedTxFee}
                      {newOffer.currencyName}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={styles.paybleContainer}>
            <Text style={styles.textColor}>Total:</Text>
            <Text style={styles.textColor}>
              {breakDowns.finalPayable.toFixed(2)} {newOffer.currencyName}
            </Text>
          </View>
        </View>
        <View style={styles.Buttons}>
          <View>
            <LinearGradient
              style={styles.confirmButton}
              start={[1, 0]}
              end={[0, 1]}
              colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
            >
              <TouchableOpacity
                disabled={disable}
                onPress={handleSubmit}
                color="green"
              >
                <Text style={styles.textColor}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (
            <View></View>
          )}
          <View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.noteText}>
          <Text style={{ fontWeight: "700" }}>Note:</Text> The above totals are
          just estimations that can vary depending on currency rates.
        </Text>
      </View>
      {txLink && (
        <View>
          <SeeTransactions />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    marginTop: hp("1"),
    borderBottomWidth: 1,
    width: wp(50),
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
  },
  assetText: {
    color: "#fff",
    fontSize: hp(2),
    width: wp(25),
  },
  currencyText: {
    color: "#fff",
    fontSize: hp(2),
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
  unitText: {
    color: "#fff",
    fontSize: hp(2),
    marginTop: hp(3),
  },
  inputContainer: {
    marginRight: wp(20),
  },
  priceMsg: {
    color: "#fff",
  },
  subTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(60),
    marginTop: hp(1),
  },
  balance: {
    color: "#fff",
    textAlign: "center",
    marginVertical: hp(2),
  },
  textColor: {
    color: "#fff",
  },
  noteText: {
    color: "#fff",
    marginVertical: hp(5),
    marginHorizontal: wp(17),
    width: wp(58),
  },
  confirmButton: {
    alignItems: "center",
    width: wp(23),
    paddingVertical: hp(0.7),
    borderRadius: 6,
  },
  cancelButton: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "#EA979A",
    width: wp(23),
    paddingVertical: hp(0.7),
    borderRadius: 6,
  },
  paybleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(60),
    marginTop: hp(4),
  },
  Buttons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(3),
    justifyContent: "space-between",
    alignSelf: "center",
    width: wp(58),
  },
  cancelText: {
    color: "#EA979A",
  },
  transactionColor: {
    color: "#fff",
    // marginHorizontal:wp(10)
  },
  crossIcon:{
    alignSelf:"flex-end",
    padding:hp(1)
  }
});
