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
import { useNavigation } from '@react-navigation/native'
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
export const NewOfferModal = ({ user, open, setOpen, getOffersData, onCrossPress }) => {
  const state = useSelector((state) => state);
  const [loading, setloading] = useState(false)
  const [show, setshow] = useState(false)
  const [activ,setactiv]=useState(true);
  const [selectedValue, setSelectedValue] = useState("XUSD");
  const [Balance, setbalance] = useState('');
  const [offer_amount, setoffer_amount] = useState('');
  const [offer_price, setoffer_price] = useState('');
  const [AssetIssuerPublicKey, setAssetIssuerPublicKey] = useState("");
  const [route, setRoute] = useState("BUY");
  const [Loading, setLoading] = useState(false);
  const [u_email,setemail]=useState('');
  const [titel,settitel]=useState("Activate Account");
  // const [PublicKey, setPublicKey] = useState("GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A");
  // const [SecretKey, setSecretKey] = useState("SCJSKKPNYIZJSF6ROF7ZMVNXL6U6HVUA4RK4JLFDH6CLTNRCGZCUUU7S");
  const [PublicKey, setPublicKey] = useState("");
  const [SecretKey, setSecretKey] = useState("");
  const inActiveColor = ["#131E3A", "#131E3A"];
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const navigation = useNavigation()
  const [show_bal,setshow_bal]=useState(false)
  const [postData, setPostData] = useState({
    email: "",
    publicKey: "",
  });
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
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Sell Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price, SecretKey, AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
      const counter_asset_buy = new StellarSdk.Asset(selectedValue === "XETH" ? "XUSD" : "XETH", AssetIssuerPublicKey);
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
      Save_offer(base_asset_sell, offer_amount, offer_price, "Sell", "Success", "1234");
      alert("success", "Sell offer created.");
      setLoading(false)
      setOpen(false);
      return 'Sell Offer placed successfully';
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
      alert("error", "Sell Offer not-created.");
      setLoading(false)
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async function Buy() {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SecretKey);
    console.log("Buy Offer Peram =>>>>>>>>>>>>", offer_amount, offer_price, SecretKey, AssetIssuerPublicKey)
    try {
      const account = await server.loadAccount(sourceKeypair.publicKey());
      const base_asset_sell = new StellarSdk.Asset(selectedValue === "XETH" ? "XUSD" : "XETH", AssetIssuerPublicKey);
      const counter_asset_buy = new StellarSdk.Asset(selectedValue, AssetIssuerPublicKey);
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
      console.log('=> Buy Offer placed...');
      Save_offer(counter_asset_buy, offer_amount, offer_price, "Buy", "Success", "1234");
      alert("success", "Buy offer created.")
      setLoading(false)
      setOpen(false);
      return 'Sell Offer placed successfully';
    } catch (error) {
      alert("error", "Buy offer not-created.");
      setLoading(false)
      console.error('Error occurred:', error.response ? error.response.data.extras.result_codes : error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
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
        });
    } catch (error) {
      console.log("Error in get_stellar")
      alert("error", "Something went wrong.");
      setshow(false)
    }
  }

  const offer_creation = () => {
    if (offer_amount !== "" && offer_price !== "") {
      { route === "SELL" ? Sell() : Buy() }
    }
    else {
      alert("error", "Empty input found.")
      setLoading(false)
    }
  }

  const active_account=async()=>{
    console.log("<<<<<<<clicked")
  try {
    const response = await fetch('http://localhost:3001/users/updatePublicKeyByEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      alert("error","Internal server error.")
    }
  } catch (error) {
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
    getData();
    get_stellar(selectedValue)
    getAssetIssuerId(selectedValue)
  },[show_bal,selectedValue, route])
  useEffect(() => {
    get_stellar(selectedValue)
    getAssetIssuerId(selectedValue)
  }, [show_bal,selectedValue, route])

 useEffect(()=>{
   setTimeout(()=>{
    setemail(user.email);
    setPostData({
      email: u_email,
      publicKey: PublicKey,
    })
    console.log("MAIL:===",u_email)
   },1000)
 },[selectedValue, route])

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

              <View style={{ flexDirection: "row" }}>
              {activ===true?<TouchableOpacity onPress={()=>{active_account()}}><View><Text style={{margin:10,color:'green',fontSize:19}}>{titel}</Text></View></TouchableOpacity>: <Text style={styles.balance}>Balance: {Balance ? Number(Balance).toFixed(2) : 0.0} </Text>}
                {show === true ? <ActivityIndicator color={"green"} /> : <></>}
              </View>
            </View>

            <View style={[styles.dropdownContainer, Platform.OS === "ios" ? styles.down : <></>]}>

              <View style={{ width: '30%', marginTop: 19 }}>
                <Text style={Platform.OS === "ios" ? [styles.assetText, styles.down_] : styles.assetText}>Select Asset</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={Platform.OS === "ios" ? { marginTop: -60, width: '120%', color: "white", marginLeft: -25 } : { marginTop: 3, width: "140%", color: "white", marginLeft: -25 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                  <Picker.Item label="XUSD" value="XUSD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="XETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                </Picker>
              </View>

              <View style={{ width: '40%', marginTop: 19 }}>
                <Text style={Platform.OS === "ios" ? [styles.currencyText, styles.down_] : styles.currencyText}> Curency</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={Platform.OS === "ios" ? { marginTop: -60, width: '90%' } : { marginTop: 3, width: '100%', marginLeft: 3 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                  <Picker.Item label="USD" value="USD" color="white" />
                </Picker>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    borderWidth: StyleSheet.hairlineWidth * 1,
                    borderColor: "green",
                    width: wp(23),
                    paddingVertical: hp(1.3),
                    borderRadius: 6,
                    marginTop: 51,
                    backgroundColor: 'green',
                  }}
                  onPress={() => { setOpen(false), navigation.navigate("Payment") }}
                >
                  <Text style={styles.cancelText}>Add Funds</Text>
                </TouchableOpacity>
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
                placeholder={"Amount of " + selectedValue}
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
                placeholder={"Price of " + route.toLocaleLowerCase()}
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
                  alignItems: "center", paddingVertical: hp(1.3), paddingHorizontal: wp(1),
                }}
                onPress={() => { setLoading(true), offer_creation() }}
                color="green"
              >
                <Text style={styles.textColor}>{Loading === true ? <ActivityIndicator color={"white"} /> : "Create Offer"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (
            <View></View>
          )}

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
