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

const TransactionsListView = ({ transactions, self = false }) => {
  const [open, setOpen] = useState(false);
  const [txLink, setTxLink] = useState("");
  const proceedToPayment = (tx) => setOpen(true);
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
            <WebView source={{ uri: `${tx.tx}` }} />
          </View>
        </Modal>
      </View>
    );
  };

  return (
    transactions && (
      <>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Asset</DataTable.Title>
            <DataTable.Title>Amount</DataTable.Title>
            <DataTable.Title>Unit Price</DataTable.Title>
            <DataTable.Title>Total Price</DataTable.Title>
            <DataTable.Title>Currency</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {transactions.length ? (
              <>
                {transactions.map((tx) => (
                  <DataTable.Row key={tx._id}>
                    <DataTable.Cell>{tx.assetName}</DataTable.Cell>
                    <DataTable.Cell>{tx.amount}</DataTable.Cell>
                    <DataTable.Cell>{tx.pricePerUnit}</DataTable.Cell>
                    <DataTable.Cell>{tx.totalPrice}</DataTable.Cell>
                    <DataTable.Cell>{tx.currency}</DataTable.Cell>
                    {tx.status !== "SUCCEEDED" && (
                      <DataTable.Cell>{tx.status}</DataTable.Cell>
                    )}

                    {tx.status === "PAYMENT_PENDING" && (
                      <Button
                        title="Proceed to pay"
                        onPress={() => {
                          console.log(tx.sessionUrl);
                          setTxLink(tx.sessionUrl);
                          setOpen(true);
                        }}
                      ></Button>
                    )}

                    {tx.status === "SUCCEEDED" && (
                      <Button
                        title="See Tx"
                        onPress={() => {
                          console.log(tx.cryptoTxHash);
                          setTxLink(
                            `${GOERLI_ETHERSCAN}/tx/${tx.cryptoTxHash}`
                          );
                          setOpen(true);
                        }}
                      >
                        See tx
                      </Button>
                    )}
                    <SeeTransactions tx={txLink} />
                  </DataTable.Row>
                ))}
              </>
            ) : (
              <DataTable.Row>
                <DataTable.Cell>No Transactions Here</DataTable.Cell>
              </DataTable.Row>
            )}
          </ScrollView>
        </DataTable>
      </>
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
      <>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Asset</DataTable.Title>
            <DataTable.Title>Amount</DataTable.Title>
            <DataTable.Title>Unit Price</DataTable.Title>
            <DataTable.Title>Total Price</DataTable.Title>
            <DataTable.Title>Currency</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {transactions.length ? (
              <>
                {transactions.map((tx) => (
                  <DataTable.Row key={tx._id}>
                    <DataTable.Cell>{tx.assetName}</DataTable.Cell>
                    <DataTable.Cell>{tx.amount}</DataTable.Cell>
                    <DataTable.Cell>{tx.pricePerUnit}</DataTable.Cell>
                    <DataTable.Cell>{tx.totalPrice}</DataTable.Cell>
                    <DataTable.Cell>{tx.currency}</DataTable.Cell>
                    {tx.status !== "SUCCEEDED" && (
                      <DataTable.Cell>{tx.status}</DataTable.Cell>
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
                  </DataTable.Row>
                ))}
              </>
            ) : (
              <DataTable.Row>
                <DataTable.Cell>No Transactions Here</DataTable.Cell>
              </DataTable.Row>
            )}
          </ScrollView>
        </DataTable>
      </>
    )
  );
};

export const TransactionView = (props) => {
  const [message, setMessage] = useState();
  const [value, setValue] = useState(0);
  const [transactions, setTransactions] = useState();
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Bids Transactions" },
    { key: "second", title: "Offers Transactions" },
  ]);

  useEffect(() => {
    if (searchParams) {
      const newTx = searchParams.get("newTx");
      if (newTx) {
        setMessage("You have new transaction payment pending");
      }
    }
  }, [searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchTxPageData();
  }, []);

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

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <>
      <View style={{ height: hp(100) }}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text>Your Transactions</Text>
        </View>
        <Text>{message}</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(70),
  },
  scrollView: {
    width: wp(90),
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
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
