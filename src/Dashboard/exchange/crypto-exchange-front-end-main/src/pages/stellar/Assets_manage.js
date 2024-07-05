import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, FlatList, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_LOCAL_TOKEN } from "../../ExchangeConstants";
import { useEffect, useState } from "react";
import Icon from "../../../../../../icon";
import darkBlue from "../../../../../../../assets/darkBlue.png";
import Bridge from "../../../../../../../assets/Bridge.png";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
const StellarSdk = require('stellar-sdk');
const Assets_manage = () => {
    const FOCUSED = useIsFocused();
    const navigation = useNavigation();
    const [modalContainer_menu, setmodalContainer_menu] = useState(false);
    const [TRUST_ASSET, setTRUST_ASSET] = useState(false);
    const [assets, setassets] = useState([
         {
          "asset_code": "XETH",
          "asset_issuer": "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
          "asset_type": "credit_alphanum4",
          "balance": "0.0000000",
          "buying_liabilities": "0.0000000",
          "is_authorized": true,
          "is_authorized_to_maintain_liabilities": true,
          "last_modified_ledger": 367795,
          "limit": "922337203685.4775807",
          "selling_liabilities": "0.0000000",
        },
         {
          "asset_code": "XUSD",
          "asset_issuer": "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
          "asset_type": "credit_alphanum4",
          "balance": "0.0000000",
          "buying_liabilities": "0.0000000",
          "is_authorized": true,
          "is_authorized_to_maintain_liabilities": true,
          "last_modified_ledger": 367796,
          "limit": "922337203685.4775807",
          "selling_liabilities": "0.0000000",
        },
         {
          "asset_type": "native",
          "balance": "9999.9999800",
          "buying_liabilities": "0.0000000",
          "selling_liabilities": "0.0000000",
        },
      ]);
    const state = useSelector((state) => state);

    const get_stellar = async () => {
        try {
            const storedData = await AsyncStorageLib.getItem('myDataKey');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                const matchedData = parsedData.filter(item => item.Ether_address === state.wallet.address);
                const publicKey = matchedData[0].publicKey;
                StellarSdk.Network.useTestNetwork();
                const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
                server.loadAccount(publicKey)
                    .then(account => {
                        setassets([])
                        setassets(account.balances)
                    })
                    .catch(error => {
                        console.log('Error loading account:', error);
                    });
            }
            else {
                console.log('No data found in AsyncStorage');
            }
        } catch (error) {
            console.log("Error in get_stellar")
        }
    }

    const DATA = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Sam Johnson' },
      ];
      




    useEffect(() => {
        get_stellar()
    }, [FOCUSED])
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
                    <Text style={styles.text_TOP}>Assets</Text>
                ) : (
                    <Text style={[styles.text_TOP, styles.text1_ios_TOP]}>Assets</Text>
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
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalContainer_menu}>

                        <TouchableOpacity style={styles.modalContainer_option_top} onPress={() => { setmodalContainer_menu(false) }}>
                            <View style={styles.modalContainer_option_sub}>

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

                                <TouchableOpacity style={styles.modalContainer_option_view} onPress={() => {
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
                                    <Text style={[styles.modalContainer_option_text, { color: "#fff" }]}>Logout</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalContainer_option_view} onPress={() => { setmodalContainer_menu(false) }}>
                                    <Icon
                                        name={"close"}
                                        type={"materialCommunity"}
                                        size={30}
                                        color={"#fff"}
                                    />
                                    <Text style={[styles.modalContainer_option_text, { color: "#fff" }]}>Close Menu</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>

            <View style={[styles.main_con]}>
                <Text style={styles.mode_text}>My Assets</Text>
                <View style={styles.assets_con}>
                    {assets.map((list, index) => {
                        return (
                            <TouchableOpacity style={styles.assets_card} onPress={()=>{navigation.navigate("send_recive")}}>
                                <View style={{flexDirection:"column"}}>
                                    <Text style={[styles.mode_text, { fontSize: 19, fontWeight: "300" }]}>{list.asset_type==="native"?"Lumens":list.asset_code}</Text>
                                    <Text style={[styles.mode_text, { fontSize: 16, fontWeight: "300",color:"silver" }]}>{list.asset_type==="native"?"XLM"+" (stellar.org)":list.asset_code+" (stellar.org)"}</Text>
                                </View>
                       {/* <ScrollView style={{height:hp52)}}> */}

                                <Text style={[styles.mode_text, { fontSize: 19, fontWeight: "300" }]}>{list.balance}</Text>
                            {/* </ScrollView> */}
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={[styles.assets_con,{alignItems:"center",marginTop:60}]} onPress={()=>{setTRUST_ASSET(true)}}>
                <Text style={[styles.mode_text, { fontSize: 19, fontWeight: "300" }]}>Add Asset</Text>
                </TouchableOpacity>
            </View>
            <Modal
        animationType="slide"
        transparent={true}
        visible={false}
        onRequestClose={() => {
          setTRUST_ASSET(!TRUST_ASSET);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modal_heading}>Add Asset</Text>
        </View>
      </Modal>

        </>
    )
}
const styles = StyleSheet.create({
    main_con: {
        backgroundColor: "#011434",
        height: "100%",
        padding: 19
    },
    assets_card: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop:10
    },
    assets_con: {
        width: wp(90),
        borderWidth: 1.9,
        borderColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
        borderRadius: 15,
        marginTop: 19,
        padding: 10,
    },
    mode_text: {
        color: "#fff",
        textAlign: "left",
        fontSize: 21,
        fontWeight: "bold",
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
        marginLeft: wp(22),
    },
    text_TOP: {
        color: "white",
        fontSize: 19,
        fontWeight: "bold",
        alignSelf: "center",
        marginStart: wp(34)
    },
    text1_ios_TOP: {
        color: "white",
        fontWeight: "700",
        alignSelf: "center",
        marginStart: wp(31),
        top: 19,
        fontSize: 17
    },
    modalContainer_option_top: {
        // flex: 1,
        alignSelf: "flex-end",
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: "100%",
        height: "60%",
    },
    modalContainer_option_sub: {
        alignSelf: "flex-end",
        backgroundColor: 'rgba(33, 43, 83, 1)',
        padding: 10,
        borderRadius: 10,
        width: "65%",
        height: "70%"
    },
    modalContainer_option_view: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: "center",
    },
    modalContainer_option_text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "gray",
        marginStart: 5
    },
    modalView: {
        margin: 2,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems:'flex-start',
    },
    modal_heading:{
        fontSize:23,
        color:"#fff",
        fontWeight:"600"
    }
})
export default Assets_manage;