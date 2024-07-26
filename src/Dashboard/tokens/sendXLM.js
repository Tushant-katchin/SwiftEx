import { Paste, SaveTransaction } from "../../utilities/utilities";
import React, { useRef, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Button,
    Keyboard,
    Alert,
    Modal
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Animated } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Icon from "../../icon";
import darkBlue from "../../../assets/darkBlue.png"
import { delay, isInteger } from "lodash";
import { alert } from "../reusables/Toasts";
import { isFloat } from "validator";
import { RNCamera } from 'react-native-camera';
const StellarSdK = require('stellar-base');
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const SendXLM = (props) => {
    const FOCUSED = useIsFocused()
    const [show, setshow] = useState(false);
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState();
    const [Loading, setLoading] = useState(false);
    const [balance, setBalance] = useState();
    const [steller_key, setsteller_key] = useState();
    const [steller_key_private, setsteller_key_private] = useState();
    const [disable, setdisable] = useState(false);
    const [Message, setMessage] = useState("");
    const [Payment_loading,setPayment_loading]=useState(false);
    const cameraRef = useRef(null);
    const [qrData, setQrData] = useState('');
    const state = useSelector((state) => state);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const onBarCodeRead = (e) => {
        if (e.data !== qrData) {
            setQrData(e.data);
            Alert.alert("QR Code ", "QR Code Decoded successfully..");
            setAddress("");
            setAddress(e.data);
            toggleModal();
        }
    };

    useEffect(async () => {
        setAddress()
        setAmount()
        setdisable(false)
        getData()
        setLoading(true)
        setMessage();
        setPayment_loading(false);
    }, [FOCUSED])
    useEffect(() => {
        let inputValidation;
        let inputValidation1;
        if (amount) {
          inputValidation = isFloat(amount);
          inputValidation1 = isInteger(amount);
             console.log(amount,balance,JSON.stringify(balance)<JSON.stringify(amount))
          if (Number(balance)<Number(amount)) {
            setMessage("Low Balance");
            setdisable(true)
          } else if (!inputValidation && !inputValidation1) {
            setMessage("Please enter a valid amount");
            setdisable(true)
          } else {
            setdisable(false)
            setMessage("");
          }
        }
      }, [amount]);
    const getData = async () => {
        try {
            const data = await AsyncStorageLib.getItem('myDataKey');
            if (data) {
                const parsedData = JSON.parse(data);
                const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
                const publicKey = matchedData[0].publicKey;
                setsteller_key(publicKey)
                get_stellar(publicKey);
                const secretKey_Key = matchedData[0].secretKey;
                setsteller_key_private(secretKey_Key)
            } else {
                console.log('No data found for key steller keys');
            }
        } catch (error) {
            console.error('Error getting data for key steller keys:', error);
        }
    }

    const get_stellar = async (steller_key) => {
        StellarSdk.Network.useTestNetwork();
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        server.loadAccount(steller_key)
            .then(account => {
                account.balances.forEach(balance => {
                    if (balance.asset_type === "native") {
                        console.log(`${balance.asset_code}: ${balance.balance}`);
                        setBalance(balance.balance)
                    }
                });
                setLoading(false)
            })
            .catch(error => {
                console.log('Error loading account:', error);
                setLoading(false);
                setdisable(true);
                setMessage("Activate Stellar Account from Exchange Tab.")
            });
    }
    const handleUsernameChange = (text) => {
        // Remove whitespace from the username
        const formattedUsername = text.replace(/\s/g, '');
        setAddress(formattedUsername);
    };
    function validateStellarAddress(address) {
        // Check if the address is 56 characters long and starts with 'G'
        if (address.length !== 56 || address[0] !== 'G') {
            return false;
        }
        try {
            // Use StellarSdk to verify if it's a valid Stellar address
            StellarSdK.StrKey.decodeEd25519PublicKey(address);
            return true;
        } catch (e) {
            return false;
        }
    }

        async function send_XLM(sourceSecret, destinationPublic, amount) {
            Keyboard.dismiss();
            try {
            alert("success","Sending Payment");
            const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
            StellarSdk.Networks.TESTNET;
              // Load the source account
              const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
              const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
          
              // Create the transaction
              const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: await server.fetchBaseFee(),
                networkPassphrase: StellarSdk.Networks.TESTNET,
              })
                .addOperation(
                  StellarSdk.Operation.payment({
                    destination: destinationPublic,
                    asset: StellarSdk.Asset.native(),
                    amount: amount,
                  })
                )
                .setTimeout(30)
                .build();
          
              // Sign the transaction
              transaction.sign(sourceKeypair);
          
              // Submit the transaction
              const transactionResult = await server.submitTransaction(transaction);
              console.log('Transaction successful!', transactionResult);
              alert("success","Transaction successful!");
              setdisable(false);
              setPayment_loading(false);
            } catch (error) {
              console.error('Error sending XLM:', error);
              alert("error","Transaction Failed");
              setdisable(false);
              setPayment_loading(false);
            }
          }


    return (
        <>
            {Platform.OS === "ios" ? <View style={{ backgroundColor: state.THEME.THEME===false?"#4CA6EA":"black", flexDirection: "row", height: hp(8),borderColor:"gray",borderWidth:0.5 }}>
                <Icon type={'antDesign'} name='left' size={29} color={'white'} onPress={() => { navigation.goBack() }} style={{ padding: hp(1.5), marginTop: '3%' }} />
                <Text style={{ color: "white", alignSelf: "center", marginLeft: "19%", marginTop: '9%', fontSize: 19 }}>Transaction Details</Text>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Image source={darkBlue} style={{
                        height: hp("9"),
                        width: wp("12"),
                        marginLeft: Platform.OS === "ios" ? wp(11) : wp(6)
                    }} />
                </TouchableOpacity>
            </View> :
                <View style={{ backgroundColor: state.THEME.THEME===false?"#4CA6EA":"black", flexDirection: "row",borderBottomColor:"gray",borderWidth:0.5 }}>
                    <Icon type={'antDesign'} name='left' size={29} color={'white'} onPress={() => { navigation.goBack() }} style={{ padding: hp(1.5), marginTop: '3%' }} />
                    <Text style={{ color: "white", alignSelf: "center", marginLeft: "20%", fontWeight: 'bold', fontSize: 17 }}>Transaction Details</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                        <Image source={darkBlue} style={{
                            height: hp("9"),
                            width: wp("12"),
                            marginLeft: wp(15)
                        }} />
                    </TouchableOpacity>
                </View>}

            <View style={{ backgroundColor: state.THEME.THEME===false?"#fff":"black", height: hp(100) }}>
                <View style={style.inputView}>
                    <TextInput
                        value={address}
                        onChangeText={(input) => {
                            console.log(input);
                            handleUsernameChange(input);
                        }}
                        placeholder="Recipient Address"
                        placeholderTextColor={"gray"}
                        style={style.input}
                    />
                    <TouchableOpacity onPress={() => {toggleModal()}}>
                        <Icon name="scan" type={"ionicon"} size={20} color={"blue"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Paste(setAddress)
                    }}>
                        <Text style={style.pasteText}>PASTE</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", width: wp(90) }}>
                    <Text style={[style.balance_heading,{color:state.THEME.THEME===false?"black":"#fff"}]}>Available balance :-{" "}</Text>
                    <View style={{ width: wp(13), flexDirection: "row" }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(11) }}>
                            <Text style={[style.balance,{color:state.THEME.THEME===false?"black":"#fff"}]}>
                                {balance ? balance : show === false ? <Text style={{ color: "#C1BDBD" }}>0</Text> : <></>}
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={{ height: "100%" }}>
                        {Loading === true ? <ActivityIndicator color={"green"} style={{ marginTop: 15, marginLeft: 5 }} /> : <></>}
                    </View>
                </View>
                <View style={style.inputView}>
                    <TextInput
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={(input) => {
                            console.log(input);
                            setAmount(input);
                        }}
                        placeholder="Amount"
                        placeholderTextColor={"gray"}
                        style={style.input}
                    ></TextInput>
                    <TouchableOpacity
                        onPress={() => {
                            setAmount(balance);
                        }}
                    >
                        <Text style={{ color: "blue" }}>MAX</Text>
                    </TouchableOpacity>
                </View>
                <Text style={style.msgText}>{Message}</Text>
                {/* <View style={style.btnView}> 
                    <Button
                        disabled={disable}
                        color="blue"
                        title="Send"
                        onPress={() => {
                            setdisable(true)
                            if (validateStellarAddress(address)) {
                                alert("success","Valid Stellar address");
                                send_XLM(setsteller_key_private, address, amount)
                            } else {
                                console.log('Invalid Stellar address');
                                alert("error","Invalid Stellar address");
                                setAddress();
                                setdisable(false);
                            }
                        }}
                    />
                            </View> */}

                    <TouchableOpacity
                        disabled={disable}
                        style={[style.btnView,{backgroundColor:disable?"gray":"green"}]}
                        onPress={() => {
                            setPayment_loading(true);
                           if(!address||!amount)
                           {
                             alert("error","Recipient Address and Amount Required")
                             setPayment_loading(false);
                           }
                           else{
                            setdisable(true)
                           if (validateStellarAddress(address)) {
                               alert("success","Valid Stellar address");
                               send_XLM(steller_key_private, address, amount)
                           } else {
                               console.log('Invalid Stellar address');
                               alert("error","Invalid Stellar address");
                               setAddress();
                               setdisable(false);
                             setPayment_loading(false);
                           }
                           }
                        }}
                    >
                        {Payment_loading===true?<ActivityIndicator color={"#fff"}/>:<Text style={{color:"#fff",fontSize:16}}>Send</Text>}
                    </TouchableOpacity>
            </View>
            <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
         <RNCamera
      ref={cameraRef}
      style={style.preview}
      onBarCodeRead={onBarCodeRead}
      captureAudio={false}
    >
         <View style={style.header}>
            <TouchableOpacity onPress={()=>{setModalVisible(false)}}>
      <Icon name="arrow-left" size={24} color="#fff" style={style.backIcon}/>
            </TouchableOpacity>
      <Text style={[style.title,{marginTop:Platform.OS==="ios"?hp(5):0}]}>Scan QR Code</Text>
    </View>
      <View style={style.rectangleContainer}>
        <View style={style.rectangle}>
          <View style={style.innerRectangle} />
        </View>
      </View>
    </RNCamera>
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ backgroundColor: '#145DA0', padding: 20, borderRadius: 10,width:"90%",height:"50%" }}>
            <Text style={{color:"white",fontWeight:"700",alignSelf:"center",fontSize:19}} onPress={()=>{
              toggleModal();
            }}>Scan QR.</Text>
              <View style={style.QR_con}>
                <RNCamera
                  ref={cameraRef}
                  style={style.preview}
                  onBarCodeRead={onBarCodeRead}
                  captureAudio={false}
                >
                  <View style={style.rectangleContainer}>
                    <View style={style.rectangle} />
                  </View>
                </RNCamera>
              </View>
          </View>
        </View> */}
      </Modal>
        </>

    );
};

export default SendXLM;

const style = StyleSheet.create({
    Body: {
        display: "flex",
        backgroundColor: "white",
        height: hp(100),
        width: wp(100),
    },
    Text: {
        fontSize: 18,
        color: "black",
    },
    welcomeText2: {
        fontSize: 15,
        fontWeight: "200",
        color: "white",
        marginTop: hp(1),
    },
    Button: {
        marginTop: hp(10),
    },

    Text: {
        marginTop: hp(5),
        fontSize: 15,
        fontWeight: "200",
        color: "white",
    },
    textInput2: {
        borderWidth: 1,
        borderColor: "grey",
        width: wp(90),
        margin: 10,
        borderRadius: 10,
        shadowColor: "#000",
        height: wp(8),
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,

        elevation: 24,
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        width: wp(93),
        alignSelf: "center",
        borderColor: "#C1BDBD",
        marginTop: hp(3),
        paddingVertical: hp(1.5),
        borderRadius: hp(1),
    },
    pasteText: { color: "blue", marginHorizontal: wp(3) },
    balance: { marginLeft: wp(1), marginTop: hp(2) },
    balance_heading: { marginLeft: wp(5), marginTop: hp(2) },
    input: {
        width: wp(70),
        alignSelf: "center",
        paddingHorizontal: wp(4),
    },
    msgText: { color: "red", textAlign: "center" },
    btnView: { width: wp(40),height:hp(6.6),alignSelf: "center",alignItems:"center",justifyContent:"center", marginTop: hp(8),backgroundColor:"blue",borderRadius:19 },
    QR_con:{
        width:wp(80),
        height:hp(40),
        borderRadius:5,
        justifyContent:"center",
        alignItems:"center"
      },
      preview: {
        flex:1
      },
      rectangleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        height: 60,
      },
      backIcon: {
        marginRight:wp(28),
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color:"#fff"
      },
});