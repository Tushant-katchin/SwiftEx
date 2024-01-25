import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  ScrollView,
  Pressable,
  Platform
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
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
export const NewOfferModal = ({ user, open, setOpen, getOffersData, onCrossPress }) => {
  const state = useSelector((state) => state);
  const [loading, setloading] = useState(false)
  const [show, setshow] = useState(false)
  const [selectedValue, setSelectedValue] = useState("XUSD");
  const [Balance, setbalance] = useState('');
  const [offer_amount, setoffer_amount] = useState('');
  const [offer_price, setoffer_price] = useState('');
  const [AssetIssuerPublicKey,setAssetIssuerPublicKey]=useState("");
  const [route, setRoute] = useState("BUY");
  const [PublicKey, setPublicKey] = useState("GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A");
  const [SecretKey, setSecretKey] = useState("SCJSKKPNYIZJSF6ROF7ZMVNXL6U6HVUA4RK4JLFDH6CLTNRCGZCUUU7S");
  const inActiveColor = ["#131E3A", "#131E3A"];
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  ///////////////////////////////////start offer function

  async function Sell() {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Sell Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price,SecretKey,AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
      const counter_asset_buy = new  StellarSdk.Asset(selectedValue==="XETH"?"XUSD":"XETH", AssetIssuerPublicKey);
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
      console.log('=> Sell Offer placed...');
      alert("success","Sell offer created.");
      return 'Sell Offer placed successfully';
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
      alert("error","Buy offer not-created.");
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async function Buy() {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Buy Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price,SecretKey,AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue==="XETH"?"XUSD":"XETH", AssetIssuerPublicKey);
      const counter_asset_buy = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
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
      console.log('=> Buy Offer placed...');
      alert("success","Buy offer created.")
      return 'Sell Offer placed successfully';
    } catch (error) {
      alert("error","Buy offer not-created.");
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }




  async function getAssetIssuerId(_code) {
    try {
      const account = await server.loadAccount(PublicKey);
  
      account.balances.forEach((balance) => {
        if(_code===balance.asset_code){
          setAssetIssuerPublicKey(balance.asset_issuer)
          console.log("L:::::> ",AssetIssuerPublicKey)
        }
      });
    } catch (error) {
      console.error('Error loading account:', error);
    }
  }

  //////////////////////////////////end
  const getData = async () => {
    try {
      const storedData = await AsyncStorageLib.getItem('myDataKey');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved data:', parsedData);
        const publicKey = parsedData.key1
        const secretKey = parsedData.key2
        setPublicKey(publicKey)
        setSecretKey(secretKey)
      }
      else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const get_stellar = async (asset) => {
    try {
      setbalance("");
      setshow(true)
      console.log("<><", PublicKey)
      StellarSdk.Network.useTestNetwork();
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      server.loadAccount(PublicKey)
        .then(account => {
          console.log('Balances for account:', PublicKey);
          account.balances.forEach(balance => {
            if (balance.asset_code === asset) {
              console.log(`${balance.asset_code}: ${balance.balance}`);
              setbalance(balance.balance)
            }
          });
          setshow(false)
        })
        .catch(error => {
          console.log('Error loading account:', error);
          alert("error", "Account Balance not found.");
        });
    } catch (error) {
      console.log("Error in get_stellar")
      alert("error", "Account Balance not found.");
    }
  }
   
  const offer_creation=()=>{
    if(offer_amount!==""&&offer_price!=="")
    {
      {route==="SELL"?Sell():Buy()}
    }
    else{
     alert("error","Empty input found.")
    }
  }


  useEffect(() => {
    get_stellar(selectedValue)
    // getData()
    getAssetIssuerId(selectedValue)
  }, [selectedValue, route])



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
        setOpen(false);
      }}
    >
      <View
        style={{
          height: hp(90),
          // paddingBottom:hp(10),
          paddingVertical: hp(1),
          width: wp(95),
          backgroundColor: "#131E3A",
          borderRadius: 10,
          borderBottomLeftRadius: 10,
          alignSelf: "center",
          display: "flex",
          // alignItems: "center",
        }}
      >
        <Icon type={'entypo'} name='cross' color={'gray'} size={24} style={styles.crossIcon} onPress={onCrossPress} />
        <View style={[styles.toggleContainer]}>
          <LinearGradient
            colors={route == "BUY" ? activeColor : inActiveColor}
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <Pressable
              activeOpacity={0.8}
              style={[
                styles.toggleBtn,
                route == "BUY"
                  ? { borderRadius: hp(4) }
                  : { borderRadius: null },
              ]}
              onPress={() => {
                setRoute("BUY");
                setoffer_amount("");
                setoffer_price("");
              }}
            >
              <Text style={[route == "BUY" ? { color: "#fff" } : { color: "#407EC9" }]}>BUY</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={route == "SELL" ? activeColor : inActiveColor}
          >
            <Pressable
              activeOpacity={0.8}
              style={[styles.toggleBtn2]}
              onPress={() => {
                setRoute("SELL");
                setoffer_amount("");
                setoffer_price("");
              }}>
              <Text style={[route == "SELL" ? { color: "#fff" } : { color: "#407EC9" }]}>SELL</Text>
            </Pressable>
          </LinearGradient>{
          }
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: 'row', width: '60%' }}>
              <Text style={{ color: "white", fontSize: hp(2)}}>Account: </Text>
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
              {Balance === "0" ? <TouchableOpacity
                style={styles.BuyButton}
              // onPress={() => setOpen(false)}
              >
                <Text style={{ color: 'white' }}>Add {selectedValue}</Text>
              </TouchableOpacity> :
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.balance}>Balance: {Balance ? Number(Balance).toFixed(2) : 0.0} </Text>
                  {show === true ? <ActivityIndicator color={"green"} /> : <></>}
                </View>}
            </View>

            <View style={[styles.dropdownContainer, Platform.OS === "ios" ? styles.down : <></>]}>

              <View style={{ width: '40%',marginTop:19 }}>
                <Text style={Platform.OS==="ios"?[styles.assetText,styles.down_]:styles.assetText}>Select Asset</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={Platform.OS === "ios" ? { marginTop: -60,width: '120%', color: "white" } : { marginTop: 3, width: "100%", color: "white",marginLeft:10 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                  <Picker.Item label="XUSD" value="XUSD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="XETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                </Picker>
              </View>

              <View style={{ width: '40%',marginTop:19 }}>
                <Text style={Platform.OS==="ios"?[styles.currencyText,styles.down_]:styles.currencyText}> Curency</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={Platform.OS === "ios" ? { marginTop: -60,width: '120%' } : { marginTop: 3, width: '100%',marginLeft:10 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                  <Picker.Item label="USD" value="USD" color="white" />
                </Picker>
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.unitText}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={offer_amount}
                placeholder={"Amount of "+selectedValue}
                onChangeText={(text) => {
                  setoffer_amount(text)
                  if (offer_amount > Balance) {
                    alert("error", "Inputed Balance not found in account.");
                  }
                }}
                autoCapitalize={"none"}
              />

              <Text style={styles.unitText}>Price</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={offer_price}
                placeholder={"Price of "+route.toLocaleLowerCase()}
                onChangeText={(text) => {
                  setoffer_price(text)
                }}
                autoCapitalize={"none"}
              />
            </View>

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

                activeOpacity={true}
                style={{
                  width: wp(23), alignItems: "center", paddingVertical: hp(0.7),
                }}
                onPress={()=>{offer_creation()}}
                color="green"
              >
                <Text style={styles.textColor}>Create</Text>
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
            // onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelText}>Add Asset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.noteText}>
          <Text style={{ fontWeight: "700" }}>Note:</Text> The above totals are
          just estimations that can vary depending on currency rates.
        </Text>
      </View>

    </Modal>
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
    marginLeft:10,
  },
  currencyText: {
    color: "#fff",
    fontSize: hp(2),
    marginLeft:7.6,
    
  },
  down_:{
    marginBottom:-16
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
  },
  confirmButton: {
    alignItems: "center",
    width: wp(23),
    borderRadius: 6,
  },
  cancelButton: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "green",
    width: wp(23),
    paddingVertical: hp(0.7),
    borderRadius: 6,
    backgroundColor:'green',
  },
  BuyButton: {
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "green",
    width: wp(23),
    paddingVertical: hp(1),
    borderRadius: 6,
    margin: 1,
    marginTop:48,
    backgroundColor: 'green',
    height:40
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
    color: "white",
  },
  crossIcon: {
    alignSelf: "flex-end",
    padding: hp(1)
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
});
