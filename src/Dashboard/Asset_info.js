import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import darkBlue from "../../assets/darkBlue.png"
import brridge_new from "../../assets/brridge_new.png"
import Icon from "../icon"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import RecieveAddress from "./Modals/ReceiveAddress";
import { useState } from "react";
import { useEffect } from "react";
import { REACT_APP_HOST, REACT_APP_LOCAL_TOKEN } from "./exchange/crypto-exchange-front-end-main/src/ExchangeConstants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { GET, authRequest } from "./exchange/crypto-exchange-front-end-main/src/api";
import { delay } from "lodash";
import { alert } from "./reusables/Toasts";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { Area, Chart, HorizontalAxis, Line, Tooltip, VerticalAxis } from "react-native-responsive-linechart";
const Asset_info = ({ route }) => {
    const FOUCUSED = useIsFocused();
    const { asset_type } = route.params;
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false);
    const [iconType, seticonType] = useState("");
    const [open, setOpen] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [chart_show, setchart_show] = useState(true);
    const [final, setfinal] = useState([]);
    const [chart, setchart] = useState([]);
    const [Profile, setProfile] = useState({
        isVerified: false,
        firstName: "jane",
        lastName: "doe",
        email: "xyz@gmail.com",
        phoneNumber: "93400xxxx",
        isEmailVerified: false,
    });
    const [timeData, setTimeData] = useState([
        "5m",
        "10m",
        "15m",
        "20m",
        "25m",
        "30m",
    ]);
    useEffect(() => {
        setchart_show(true)
        setLoading(true)
        setVisible(false);
        seticonType("");
        handle_asset_call(asset_type)
        getChart(asset_type)
    }, [FOUCUSED])

    const handle_asset_call = async (asset_type) => {
        asset_type === "XLM" ? feth_detial_Xlm() : fetchKline()
    }

    async function feth_detial_Xlm() {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", "__cf_bm=jRWWuUDURQauf2.SdUFF5sQR5mN9SPjAeIRyk2xz6BE-1720688680-1.0.1.1-PZT64WLNsnH8o3HpegJCfI1zfCFYFPay83.rJCKEWPD4psmNDHv0RqDAqcW3JDmDYjs2CK.PPlu3jEWIruNWzQ");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://api.coingecko.com/api/v3/coins/stellar", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                let temp=[
                    {
                        current_price:result.market_data.current_price.usd,
                        high_24h:result.market_data.high_24h.usd,
                        low_24h:result.market_data.low_24h.usd,
                        market_cap:result.market_data.market_cap.usd,
                        total_volume:result.market_data.total_volume.usd,
                        total_supply:result.market_data.total_supply,
                        price_change_percentage_24h:result.market_data.price_change_percentage_24h,
                    }
                ];
                setfinal(temp)
                delay(() => {
                    setLoading(false);
                }, 1000)
            }
            )
            .catch((error) => console.error(error));
    }

    async function getChart(name) {

        await fetch(
            `https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1h&limit=5`,
            {
                method: "GET",
            }
        )
            .then((resp) => resp.json())
            .then((resp) => {
                const trades = resp.map((interval) => parseFloat(interval[1]));
                //   setchart(trades)
                const firstTrade = trades[0];
                const lastTrade = trades.slice(-1)[0];
                const percent = (
                    ((lastTrade - firstTrade) / firstTrade) *
                    100
                ).toFixed(2);
                //   setchart(trades)
                const transformedData = resp.map(item => ({
                    x: new Date(item[0]), // Use the timestamp for x
                    y: parseFloat(item[4]) // Use the closing price for y
                }));

                console.log("8******************_____", transformedData);
                setchart(transformedData)
                setchart_show(false)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchKline = async () => {
        try {
            const raw = "";
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await fetch(REACT_APP_HOST + "/market-data/getcryptodata", requestOptions)
                .then((response) => response.json())
                .then((responseJson) => {
                    res_find(responseJson[0].MarketData)
                })
                .catch((error) => {
                    console.error(error);
                    alert("error", "Somthing went worng");
                });
        } catch (error) {
            console.log(error);
        }
    };
    const res_find = async (Data) => {
        let find_temp = "";
        find_temp = asset_type;
        const filteredData = Data.filter(item => item.symbol === find_temp.toLowerCase());
        setfinal(filteredData);
        delay(() => {
            setLoading(false);
        }, 1500);

    }
    const cashout_manage = async () => {
        const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
        const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
        token ? navigation.navigate("payout") : navigation.navigate("exchangeLogin")
    }
    const trade_manage = async () => {
        const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
        const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
        token ? await for_trading() : navigation.navigate("exchangeLogin")
    }
    const for_trading = async () => {
        try {
            const { res, err } = await authRequest("/users/getUserDetails", GET);
            if (err) return [navigation.navigate("exchangeLogin")];
            setProfile(res);
            await getOffersData()
        } catch (err) {
            console.log(err)
        }
    };
    const getOffersData = async () => {
        try {
            const { res, err } = await authRequest("/offers", GET);
            if (err) return console.log(`${err.message}`);
            //  setOffers(res);
        } catch (err) {
            console.log(err)
        }

        navigation.navigate("newOffer_modal", {
            user: { Profile },
            open: { open },
            getOffersData: { getOffersData }
        });

    }


    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={(() => navigation.goBack())}>
                    <Icon type={'antDesign'} name='left' size={29} color={'white'} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.text}>{asset_type}</Text>
                <TouchableOpacity onPress={(() => navigation.navigate("Home"))}>
                    <Image source={darkBlue} style={styles.image} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.main_con}>
                <View style={styles.chart_con}>
                    {chart_show === false ? <Chart
                        style={{ height: hp(35), width: wp(99), padding: 1 }}
                        data={chart}
                        padding={{ left: 40, bottom: 30, right: 20, top: 30 }}
                        xDomain={{ min: new Date(chart[0].x).getTime(), max: new Date(chart[chart.length - 1].x).getTime() }}
                        yDomain={{ min: Math.min(...chart.map(d => d.y)), max: Math.max(...chart.map(d => d.y)) }}
                    >
                        <VerticalAxis tickCount={10} theme={{ labels: { formatter: (v) => v.toFixed(2) } }} />
                        <HorizontalAxis tickCount={10} theme={{
                            labels: {
                                formatter: (v) => {
                                    const date = new Date(v);
                                    return `${date.getHours()}:${date.getMinutes()}`;
                                },
                            },
                        }} />
                        <Area theme={{ gradient: { from: { color: '#44bd32' }, to: { color: '#44bd32', opacity: 0.2 } } }} />
                        <Line
                            tooltipComponent={<Tooltip />}
                            theme={{ stroke: { color: '#44bd32', width: 5 }, scatter: { default: { width: 8, height: 8, rx: 4, color: '#44ad32' }, selected: { color: 'red' } } }}
                        />
                    </Chart> : <ActivityIndicator color={"green"} size={"large"} />}

                </View>
                <View style={styles.opt_con}>
                    <TouchableOpacity style={styles.opt_cons} onPress={() => {
                        asset_type === "XLM" ? navigation.navigate("SendXLM") :
                            navigation.navigate("Send", {
                                token: asset_type === "ETH" ? "Ethereum" : asset_type,
                            })
                    }}>
                        <Icon type={'materialCommunity'} name='arrow-top-right' size={25} color={"#4CA6EA"} style={styles.opt_icon} />
                        <Text style={styles.opt_text}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.opt_cons} disabled={asset_type==="XRP"||asset_type==="XLM"} onPress={() => { navigation.navigate("classic",{Asset_type:asset_type}) }}>
                        <Image source={brridge_new} style={styles.image_brige} />
                        {/* <Icon type={'materialCommunity'} name='swap-horizontal-variant' size={25} color={"#4CA6EA"} style={styles.opt_icon} /> */}
                        <Text style={styles.opt_text}>Bridge</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.opt_cons} onPress={() => {
                        setVisible(true);
                        seticonType(asset_type);
                    }}>
                        <Icon type={'materialCommunity'} name='arrow-bottom-left' size={25} color={"#4CA6EA"} style={styles.opt_icon} />
                        <Text style={styles.opt_text}>Request</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.opt_other}>
                    <View style={styles.T_C_con}>
                        <TouchableOpacity style={styles.opt_other_cons} onPress={() => { trade_manage() }}>
                            <Icon type={'materialCommunity'} name='chart-timeline-variant' size={25} color={"#4CA6EA"} style={styles.opt_icon} />
                            <Text style={styles.opt_other_text}>Trade</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.opt_other_cons} onPress={() => { cashout_manage() }}>
                            <Icon type={'materialCommunity'} name='cash' size={25} color={"#4CA6EA"} style={styles.opt_icon} />
                            <Text style={styles.opt_other_text}>Cashout</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.horizontalLine} />
                    {Loading === true ? <ActivityIndicator color={"green"} size={"large"} style={{ alignSelf: "center" }} /> :
                        final.map((list, index) => {
                            return (
                                <>
                                    <Text style={[styles.opt_market_head, { marginTop: hp(1) }]}>{asset_type} price (24H)</Text>
                                    <View style={{ flexDirection: "row", padding: 4 }}>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Price</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.current_price : asset_type === "XLM" ? list.current_price : list.current_price} price (24H)</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Price (USD)</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.current_price : list.current_price}$</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginLeft: 1.9 }}>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>24H high</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.high_24h : list.high_24h}$</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>24H low</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.low_24h : list.low_24h}$</Text>
                                        </View>
                                    </View>

                                    {/* Market */}
                                    <View style={styles.horizontalLine} />
                                    <Text style={[styles.opt_market_head, { marginTop: hp(1), marginLeft: 1 }]}>Market stats</Text>
                                    <View style={{ flexDirection: "row", padding: 4 }}>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Market cap</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.market_cap : list.market_cap}$</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Volume</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.total_volume : list.total_volume}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginLeft: 1.9 }}>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Supply</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.total_supply : list.total_supply}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.opt_market_head, { fontSize: 14, color: "gray" }]}>Price changes % 24h</Text>
                                            <Text style={[styles.opt_market_head, { marginTop: -10, fontSize: 15 }]}>{asset_type === "XLM" ? list.price_change_percentage_24h : list.price_change_percentage_24h}</Text>
                                        </View>
                                    </View>
                                </>
                            )
                        })}

                </View>
                <RecieveAddress
                    modalVisible={visible}
                    setModalVisible={setVisible}
                    iconType={iconType}
                />

            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#4CA6EA",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: Platform.OS === "ios" ? hp(8.5) : hp(10), // Adjust as needed
        paddingHorizontal:  Platform.OS === "ios" ? wp(3.5):wp(2),
    },
    icon: {
        paddingVertical: hp(1.9),
    },
    text: {
        color: "white",
        fontSize: Platform.OS === "ios" ? 19 : 17,
        fontWeight: Platform.OS === "ios" ? "normal" : "bold",
        textAlign: "center",
        flex: 1,
        marginLeft: 19.5,
        marginTop:Platform.OS === "ios" ?hp(3):hp(0)
    },
    image: {
        height: hp(9),
        width: wp(12),
    },
    image_brige: {
        marginTop: hp(1.3),
        height: hp(3),
        width: wp(9),
        marginBottom: hp(1)
    },
    main_con: {
        height: hp(100),
        width: wp(100),
        backgroundColor: "#e6e6e6"
    },
    chart_con: {
        height: hp(39),
        width: wp(100),
        backgroundColor: "#e6e6e6",
        padding: 4
    },
    opt_con: {
        height: hp(10.5),
        flexDirection: "row",
        width: wp(95),
        backgroundColor: "#fff",
        alignSelf: "center",
        borderRadius: 10,
        marginTop: -25,
        justifyContent: "space-around",
        alignItems: "center"
    },
    opt_other: {
        // height: hp(9.5),
        width: wp(95),
        backgroundColor: "#fff",
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 13,
        alignItems: "flex-start",
        paddingLeft: 19,
        marginBottom: hp(3),
        paddingBottom: hp(1)
    },
    T_C_con: {
        flexDirection: "row",
        width: wp(80),
        height: hp(10),
        backgroundColor: "#fff",
        alignItems: "flex-start",
        justifyContent: "space-around",
    },
    opt_text: {
        color: "black",
        fontSize: 13
    },
    opt_icon: {
        paddingVertical: hp(1),
    },
    opt_cons: {
        alignItems: "center",
    },
    opt_other_text: {
        color: "black",
        fontSize: 14,
        marginLeft: 10
    },
    opt_market_head: {
        color: "black",
        fontSize: 16,
        padding: 5,
        fontWeight: "500"
    },
    opt_other_cons: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        borderColor: "#4CA6EA",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: wp(3),
        width: wp(30)
    },
    horizontalLine: {
        height: 1,
        width: wp(80),
        backgroundColor: 'gray',
        marginVertical: 5,
        marginTop: hp(2)
    },
});

export default Asset_info;