import { View, Text, StyleSheet, Image,ScrollView, ActivityIndicator,TouchableOpacity, TextInput, Pressable, FlatList } from "react-native"
import { SafeAreaView } from "react-navigation"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { alert } from "../../../../reusables/Toasts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { SavePayout, getAllDataAndShow} from "../../../../../utilities/utilities";
import { authRequest, GET, POST } from "../api";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Icon from "../../../../../icon";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";

const StellarSdk = require('stellar-sdk');


const Payout = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
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
    // const [PublicKey, setPublicKey] = useState("GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI");//comment for user
    // const [SecretKey, setSecretKey] = useState("SC5O7VZUXDJ6JBDSZ74DSERXL7W3Y5LTOAMRF7RQRL3TAGAPS7LUVG3L");//comment for user
    const[PublicKey,setPublicKey]=useState("");//uncomment for user
    const[SecretKey,setSecretKey]=useState("");//uncomment for user
    const [transactions, setTransactions] = useState([]);
    useEffect(()=>{ //uncomment for user
        getData();
        fetchProfileData();
    },[route,isFocused])

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
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/////")
            SavePayout(issuingAccountPublicKey, recipientPublicKey, transactionResult.created_at, "", g_amount, XETHAsset, "Success");
        } catch (error) {
            setshow(false);
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
          setTransactions(result);
          console.log(";;;;;;;",transactions)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    useEffect(() => {
        get_stellar();
        // payout_amount("")
        fetchData();
    }, [PublicKey,route,isFocused])

    const sub_function = (senderSecretKey, recipientPublicKey, g_amount, g_ASSET) => {
        Keyboard.dismiss();
        console.log(">>?", senderSecretKey, recipientPublicKey, g_amount, g_ASSET)
        if (!payout_amount) {
            alert('error', "Invalid Amount Found.");
        }
        else {
            sendPayment(senderSecretKey, recipientPublicKey, g_amount, g_ASSET);
        }
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
        <SafeAreaView style={styles.contener}>
            <View style={[styles.toggleContainer]}>
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
            </View>
            <Text style={[styles.Id_text, styles.gray]}>{route === "XUSD" ? XUSD : XETH}</Text>
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
            </View>
            <View style={[styles.Id_text,styles.white]}>
            <TextInput style={{width:"90%",color:"white",padding:1}} placeholder="Payout Amount" placeholderTextColor={"gray"} keyboardType="numeric" value={payout_amount} onChangeText={(amount) => {
                setpayout_amount(amount)
            }} />
           <Pressable onPress={()=>{setpayout_amount(Available)}}>
           <Text style={{alignSelf:'flex-end',color:'white'}}>MAX</Text>
           </Pressable>
            </View>
            <Pressable style={styles.button} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route), sub_function(SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route) }}>
                <Text style={styles.btn_text}>{show === true ? <ActivityIndicator color={"white"} /> : "Payout"}</Text>
            </Pressable>
            <Text style={{color:'white',fontSize:20,marginLeft:19,marginTop:"10%",fontWeight:"bold"}}>History</Text>
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
            </View>
          )}
        />
      ) : (
        <Text style={{textAlign:'center',color:'white',fontSize:19}}>No Payout found.</Text>
      )}
    </View>
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
        height: hp("9"),
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
      }
})
export default Payout;