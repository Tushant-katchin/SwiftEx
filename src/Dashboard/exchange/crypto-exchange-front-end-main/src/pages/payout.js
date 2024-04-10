import { View, Text, StyleSheet,Picker,Image,ScrollView, ActivityIndicator,TouchableOpacity, TextInput, Pressable, FlatList,Modal, Platform } from "react-native"
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
import { authRequest, GET, POST } from "../api";
import darkBlue from "../../../../../../assets/darkBlue.png";
import Icon from "../../../../../icon";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import { useSelector } from "react-redux";

const StellarSdk = require('stellar-sdk');


const Payout = () => {
  const AnchorViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

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
    const [Anchor_modal,setAnchor_modal]=useState(true);
    const [index_Anchor,setindex_Anchor]=useState(false);
    const Anchor = [
      { name: "SwiftEx", status: "Verified", image: require('../../../../../../assets/darkBlue.png'), city: "India / Indonesia / Ireland / Israel / Italy / Jamaica / Japan / Jordan / Kazakhstan / Kenya / Kosovo / Kuwait / Kyrgyzstan / Laos / Latvia / Lebanon / Liberia / Libya / Slovakia / Slovenia / Solomon Islands / South Africa / South Korea / South Sudan / Spain / Sri Lanka / Suriname / Sweden / Switzerland / Taiwan / Tanzania / Thailand / Timor-Leste / Togo / Tonga / Trinidad And Tobago / Turkey / Turks And Caicos Islands / Tuvalu / Uganda / Ukraine / United Arab Emirates / United Kingdom / United States / Uruguay / Uzbekistan / Vanuatu / Venezuela / Vietnam / Virgin Islands, British / Virgin Islands, U.S. / Yemen / Zambia", Crypto_Assets: "XETH, XUSD", Fiat_Assets: "$ USD, € EUR", Payment_Rails: "Card, Bank Transfer, Local Method" },
      { name: "APS", status: "Pending", image: require('../../../../../../assets/APS.png'), city: "Austria / Belgium / Brazil / Bulgaria / Chile / Croatia / Cyprus / Czech Republic / Denmark / Estonia / Finland / France / Germany / Greece / Hungary / Ireland / Italy / Latvia / Lithuania / Luxembourg / Malta / Netherlands / Poland / Portugal / Romania / Slovakia / Slovenia / Spain / Sweden", Fiat_Assets: "$ BRL€ EUR$ CLP", Crypto_Assets: "XETH, XUSD" },
      { name: "BILIRA", status: "Pending", image: require('../../../../../../assets/BIRLA.png'), city: "Turkey", Fiat_Assets: "$ USD", Crypto_Assets: "XETH, XUSD, USDC" },
      { name: "ALFRED", status: "Pending", image: require('../../../../../../assets/ALFRED.png'), city: "Argentina / Brazil / Chile / Colombia / Dominican Republic / Mexico", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD", Payment_Rails: "Bank Transfer" },
      { name: "ANCLAP", status: "Pending", image: require('../../../../../../assets/ANCLAP.png'), city: "Argentina / Chile / Colombia / Mexico / Peru", Crypto_Assets: "XETH, XUSD, ARS,PEN,USDC,XLM", Fiat_Assets: "$ ARS $ USD", Payment_Rails: "CashCard, Bank Transfer, Local Method" },
      { name: "ARF", status: "Pending", image: require('../../../../../../assets/APS.png'), city: "China / Colombia / Singapore / Turkey / United States", Crypto_Assets: "XETH, XUSD, USDC", Fiat_Assets: "$ USD" },
  ];
  
    // const [PublicKey, setPublicKey] = useState("GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A");//comment for user
    // const [SecretKey, setSecretKey] = useState("SCJSKKPNYIZJSF6ROF7ZMVNXL6U6HVUA4RK4JLFDH6CLTNRCGZCUUU7S");//comment for user
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
            setindex_Anchor(false);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/////")
            SavePayout(issuingAccountPublicKey, recipientPublicKey, transactionResult.created_at, "", g_amount, XETHAsset, "Success");
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
      const formattedInput = input.replace(/[.,\s-]/g, '');
      setpayout_amount(formattedInput)
    };

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
                <Picker
                  selectedValue={route}
                  style={Platform.OS === "ios" ? { marginTop: -50, width: '120%', color: "white", marginLeft: -15 } : { marginTop: 3, width: "140%", color: "white", marginLeft: -25 }}
                  onValueChange={(itemValue, itemIndex) => setRoute(itemValue)}
                >
                  <Picker.Item label="XETH" value="XETH" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="XUSD" value="XUSD" color={Platform.OS === "ios" ? "white" : "black"} />
                  <Picker.Item label="XGBP" value="XGBP" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="XINR" value="XINR" color={Platform.OS === "ios" ? "gray" : "gray"} />
                  <Picker.Item label="SWIFTEX" value="SWIFTEX" color={Platform.OS === "ios" ? "gray" : "gray"} />
                </Picker>
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




            <Text style={[styles.Id_text, styles.gray,{marginTop:Platform.OS==="ios"?-19:10}]}>{route === "XUSD" ? index_Anchor===true?XUSD:"Anchor" : index_Anchor===true?XETH:"Anchor"}</Text>
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
                {Available>0.0000000?<></>:<Text style={{color:"red",borderColor:"rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",borderWidth:1.9,padding:1.3,borderRadius:10,paddingHorizontal:2.9}}>Insufficient Balance</Text>}
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
            <TextInput style={[styles.Id_text, styles.gray,{marginTop:5}]} value={route==="XETH"?state.wallet.address:"Your bank details shared with Anchor"}/>
            

            <Pressable style={styles.button} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route), sub_function(SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route) }}>
            {/* <Pressable style={styles.button} disabled={!payout_amount} onPress={() => { console.log("PAYOUT_DATA:-:", SecretKey, route === "XETH" ? XETH : XUSD, payout_amount, route),payout_amount !== 0 && payout_amount !== null?setAnchor_modal(true):alert("error","Invalid Value")}}> */}
                <Text style={styles.btn_text}>{show === true ? <ActivityIndicator color={"white"} /> : route==="XETH"||route==="XUSD"?"Payout":"Available Soon"}</Text>
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
    <View style={{backgroundColor:"black",}}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={Anchor_modal}
      >
        <View style={styles.container_a}>
        <View style={{flexDirection:"row",justifyContent:"space-between",zIndex:20,position:"absolute",width:wp(95),marginTop:90}}>
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
                  </View>
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
           {route==="XUSD"&&<Text style={{color:"yellow",textAlign:"center",fontSize:19}}>Your bank details shared with Anchor</Text>}
            {/* <TouchableOpacity style={{backgroundColor:"green",width:wp(22),alignSelf:"center",margin:9,borderRadius:10}}>
              <Text style={{padding:11,color:"#fff",fontSize:15,fontWeight:"bold"}}>Procced</Text>
            </TouchableOpacity> */}
        </View>
      </Modal>
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
      },
      container_a: {
        height:hp(24.8),
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
      }
})
export default Payout;