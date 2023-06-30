import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { authRequest, GET, POST } from "../api";
import { GOERLI_ETHERSCAN } from "../utils/constants";
import { DataTable } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { CHAIN_ID_TO_SCANNER } from "../web3";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../../../icon";
import OffersButton from "../../../../offersButton";
import { OfferListView } from "./offers";

export const TransactionsListView = ({
  transactions,
  self = false,
  fetchTxPageData,
  setUpdateTx,
  setPressed,
}) => {
  const [open, setOpen] = useState(false);
  const [txLink, setTxLink] = useState("");
  const proceedToPayment = (tx) => setOpen(true);
  const navigation = useNavigation();
  const SeeTransactions = (tx) => {
    console.log(tx.tx);
    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={open}
          useNativeDriver={true}
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
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 50,
              height: 10,
            }}
          >
            <WebView
              source={{ uri: `${tx.tx}` }}
              onNavigationStateChange={(data) => {
                if (data.url.includes(`offers?session_id`)) {
                  ///do if payment successfull
                  setOpen(false);
                  setUpdateTx(true);
                  alert("Payment Successful");
                  navigation.navigate("/offers");
                  fetchTxPageData();
                }

                if (data.url.includes("offers?payFailed=true")) {
                  ///do if payment is cancelled
                  setOpen(false);
                  setUpdateTx(true);
                  alert("Payment failed. Please try again");
                  fetchTxPageData();
                }
              }}
            />
          </View>
        </Modal>
      </View>
    );
  };

  return (
    transactions && (
      <View style={styles.mainContainer}>
        <LinearGradient
          style={styles.linearStyle}
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
        >
          <View style={styles.tableHeader}>
            <Text style={styles.AssetText}>Asset Amount</Text>
            <Text style={styles.AssetText}>Unit Price</Text>
            <Text style={styles.AssetText}>Total Price</Text>
            <Text style={styles.AssetText}>Currency</Text>
            <View style={{ position: "relative" }}>
              <Icon
                name={"info"}
                type={"feather"}
                style={styles.infoIcon}
                color={"#DBAFC9"}
              />
              <Text style={styles.AssetText}>Status</Text>
            </View>
          </View>
          <ScrollView>
            {transactions.length ? (
              <>
                {transactions.map((tx) => (
                  <ScrollView contentContainerStyle={styles.scrollView}>
                    <View key={tx._id} style={styles.Table1Container}>
                      <Text style={styles.textColor}>
                        {tx.assetName} {tx.amount}
                      </Text>
                      <Text style={styles.textColor}>{tx.pricePerUnit}</Text>
                      <Text style={styles.textColor}>{tx.totalPrice}</Text>
                      <Text style={styles.textColor}>{tx.currency}</Text>
                      {tx.status !== "SUCCEEDED" && (
                        <Text style={styles.statusColor}>{tx.status}</Text>
                      )}

                      {tx.status === "PAYMENT_PENDING" && (
                        <View>
                          <Button
                            title="Proceed to pay"
                            onPress={() => {
                              console.log(tx.sessionUrl);
                              setTxLink(tx.sessionUrl);
                              setOpen(true);
                            }}
                          ></Button>
                        </View>
                      )}

                      {tx.status === "SUCCEEDED" && (
                        <Button
                          title="See Tx"
                          onPress={() => {
                            console.log(tx.cryptoTxHash);
                            setTxLink(
                              `${CHAIN_ID_TO_SCANNER[tx.chainId]}/tx/${
                                tx.cryptoTxHash
                              }`
                            );
                            setOpen(true);
                          }}
                        >
                          See tx
                        </Button>
                      )}
                      <SeeTransactions tx={txLink} />
                    </View>
                  </ScrollView>
                ))}
              </>
            ) : (
              <View>
                <Text style={styles.NoText}>No Transactions Here</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    )
  );
};

const OffersListView = ({ transactions, self = false }) => {
  const [open, setOpen] = useState(false);
  const [txLink, setTxLink] = useState("");

  const SeeTransactions = (tx) => {
    console.log("hi", tx.tx);
    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={open}
          useNativeDriver={true}
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
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 50,
              height: 10,
            }}
          >
            <WebView source={{ uri: `${GOERLI_ETHERSCAN}/tx/${tx.tx}` }} />
          </View>
        </Modal>
      </View>
    );
  };

  return (
    transactions && (
      <View style={styles.mainContainer}>
        <LinearGradient
          style={styles.linearStyle}
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
        >
          <View style={styles.tableHeader}>
            <Text style={styles.AssetText}>Asset Amount</Text>
            <Text style={styles.AssetText}>Unit Price</Text>
            <Text style={styles.AssetText}>Total Price</Text>
            <Text style={styles.AssetText}>Currency</Text>
            <View style={{ position: "relative" }}>
              <Icon
                name={"info"}
                type={"feather"}
                style={styles.infoIcon}
                color={"#DBAFC9"}
              />
              <Text style={styles.AssetText}>Status</Text>
            </View>
          </View>
          <ScrollView>
            {transactions.length ? (
              <>
                {transactions.map((tx) => (
                  <ScrollView>
                    <View key={tx._id} style={styles.Table1Container}>
                      <Text style={styles.textColor}>
                        {tx.assetName} {tx.amount}
                      </Text>
                      <Text style={styles.textColor}>{tx.pricePerUnit}</Text>
                      <Text style={styles.textColor}>{tx.totalPrice}</Text>
                      <Text style={styles.textColor}>{tx.currency}</Text>
                      {tx.status !== "SUCCEEDED" && (
                        <Text style={styles.transferdColor}>{tx.status}</Text>
                      )}

                      {tx.status === "SUCCEEDED" && (
                        <Button
                          title="See Tx"
                          onPress={() => {
                            if (tx.cryptoTxHash) {
                              console.log(tx.cryptoTxHash);
                              setTxLink(tx.cryptoTxHash);
                              setOpen(true);
                            }
                          }}
                        >
                          See tx
                        </Button>
                      )}
                      <SeeTransactions tx={txLink} />
                    </View>
                  </ScrollView>
                ))}
              </>
            ) : (
              <View>
                <Text style={styles.NoText}>No Transactions Here</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    )
  );
};

export const TransactionView = () => {
  const [route, setRoute] = useState("BID");
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const inActiveColor = ["#131E3A", "#131E3A"];
  const [message, setMessage] = useState();
  const [value, setValue] = useState(0);
  const [transactions, setTransactions] = useState();
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // const [searchParams] = useSearchParams();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [updateTx, setUpdateTx] = useState();
  const [routes] = useState([
    { key: "first", title: "Bids Transactions" },
    { key: "second", title: "Offers Transactions" },
  ]);

  /*useEffect(() => {
    if (searchParams) {
      const newTx = searchParams.get("newTx");
      if (newTx) {
        setMessage("You have new transaction payment pending");
      }
    }
  }, [searchParams]);*/

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchTxPageData();
  }, []);
  useEffect(() => {
    fetchTxPageData();
  }, [updateTx]);

  const fetchTxPageData = async () => {
    await fetchTransactionData();
    await fetchProfileData();
  };

  const fetchTransactionData = async () => {
    try {
      const { res, err } = await authRequest(
        "/transactions/getUserTansactions",
        GET
      );
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setTransactions(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setProfile(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TransactionsListView
        transactions={transactions.filter(
          (tx) => tx.customerId === profile._id
        )}
        fetchTxPageData={fetchTxPageData}
        setUpdateTx={setUpdateTx}
      />
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <OffersListView
        transactions={transactions.filter(
          (tx) => tx.assetOwner === profile._id
        )}
        self={true}
      />
    </View>
  );

  // const renderScene = SceneMap({
  //   first: FirstRoute,
  //   second: SecondRoute,
  // });

  return (
    <>
      <View style={{ height: hp(100), backgroundColor: "#131E3A" }}>
        <Text style={styles.transactionText}>Transactions</Text>
        <Text>{message}</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <OffersButton
              onPressBid={() => {
                setRoute("BID");
              }}
              textStyle1={
                route == "BID" ? { color: "#fff" } : { color: "#5D9EEA" }
              }
              textStyle2={
                route != "BID" ? { color: "#fff" } : { color: "#5D9EEA" }
              }
              title1="Of My Bids"
              title2="Of My Offers"
              firstColor={route == "BID" ? activeColor : inActiveColor}
              secondColor={route != "BID" ? activeColor : inActiveColor}
              onPressOffer={() => {
                setRoute("OFFERS");
              }}
            />
            {route == "BID" && (
              <View>
                <TransactionsListView
                  transactions={transactions.filter(
                    (tx) => tx.customerId === profile._id
                  )}
                  fetchTxPageData={fetchTxPageData}
                  setUpdateTx={setUpdateTx}
                />
                <TouchableOpacity style={styles.transactionBtn}>
                  <Text style={{ color: "#EE96DF" }}>Bid On Offers</Text>
                </TouchableOpacity>
              </View>
            )}
            {route == "OFFERS" && (
              <View>
                <OffersListView
                  transactions={transactions.filter(
                    (tx) => tx.assetOwner === profile._id
                  )}
                  self={true}
                />
                <TouchableOpacity style={styles.transactionBtn}>
                  <Text style={{ color: "#EE96DF" }}>Add Offer</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#131E3A",
    height: hp(100),
  },
  scrollView: {
    width: wp(90),
  },
  tableHeader: {
    width: wp(90),
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "#EE96DF",
    paddingVertical: hp(1),
  },
  table: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  content: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: hp(100),
  },
  AssetText: {
    color: "#fff",
    width: wp(15),
    textAlign: "center",
  },
  linearStyle: {
    width: wp(95),
    height: hp(30),
    marginBottom: hp(3),
    marginVertical: hp(2),
    borderRadius: 10,
    alignSelf: "center",
  },
  textColor: {
    color: "#fff",
    width: wp(18.5),
    textAlign: "center",
  },
  statusColor: {
    color: "#DFE96A",
    width: wp(18.5),
    textAlign: "center",
  },
  transferdColor: {
    color: "#1EEC7D",
    width: wp(18.5),
    textAlign: "center",
  },
  Table1Container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(90),
    marginTop: hp(2),
    marginBottom: hp(1),
    alignSelf: "center",
  },
  scrollView: {
    // width: wp(100),
    alignSelf: "center",
  },
  infoIcon: {
    alignSelf: "flex-end",
    position: "absolute",
    // left:10,
    top: -8,
    right: -5,
  },
  NoText: {
    color: "#fff",
    marginVertical: hp(2),
    marginHorizontal: wp(4),
  },
  transactionText: {
    color: "#fff",
    textAlign: "center",
    marginTop: hp(2),
    fontSize: hp(2.1),
  },
  transactionBtn: {
    width: wp(30),
    alignSelf: "center",
    borderRadius: 8,
    borderColor: "#EE96DF",
    borderWidth: StyleSheet.hairlineWidth * 1,
    padding: 8,
    alignItems: "center",
    marginTop: hp(5),
  },
});

/* 
<View style={{ borderBottom: 1, borderColor: 'divider' }}>
              <Button
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              />
                <Tab label="Bids Transactions" {...a11yProps(0)} />
                <Tab label="Offer Trasactions" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <div
              role="tabpanel"
              hidden={value !== 0}
              id={`simple-tabpanel-${0}`}
              aria-labelledby={`simple-tab-${0}`}
            >
              <TransactionsListView
                transactions={transactions.filter(
                  (tx) => tx.customerId === profile._id,
                )}
              />
            </div>
            <div
              role="tabpanel"
              hidden={value !== 1}
              id={`simple-tabpanel-${1}`}
              aria-labelledby={`simple-tab-${1}`}
            >
              <TransactionsListView
                transactions={transactions.filter(
                  (tx) => tx.assetOwner === profile._id,
                )}
                self={true}
              />
            </div>
          </Box>

*/
