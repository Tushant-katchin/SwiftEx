import {
  APP_FEE_PERCENTAGE,
  BID_STATUS_ENUM,
  OFFER_STATUS_ENUM,
  TX_FEE_IN_USD,
} from "../utils/constants";
import { useEffect, useState } from "react";
import { GET, PATCH, authRequest } from "../api";
import { convertCurrencies } from "../utils/currencyConversion";
import { View, StyleSheet, ScrollView, Button } from "react-native";
import { Input, Text, Box } from "native-base";
import Modal from "react-native-modal";
import { DataTable } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button as Btn } from "native-base";
import { useToast } from "native-base";
import { ShowToast } from "../../../../reusables/Toasts";
import SnackBar from "react-native-snackbar-component";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

const UpdateBidModal = ({
  bid,
  getBids,
  setSnackbarVisible,
  setPaymentUrl,
}) => {
  const [modalMessage, setModalMessage] = useState("");
  const [updatedBid, setUpdatedBid] = useState({ pricePerUnit: "" });
  const [txFeeInUsd, setTxFeeInUsd] = useState(TX_FEE_IN_USD);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [breakDowns, setBreakdowns] = useState({
    finalPayable: 0,
    appFee: 0,
    subTotal: 0,
    convertedTxFee: null,
    convertedUnitPrice: null,
  });

  const offer = bid.offer;
  const toast = useToast();
  useEffect(() => {
    getTxFeeData(offer.assetName);
  }, []);

  const handleOpen = () => {
    setUpdatedBid({ pricePerUnit: "" });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getTxFeeData = async (txName) => {
    try {
      const { err, res: { gasPriceInUsd = TX_FEE_IN_USD } = {} } =
        await authRequest(`/users/getTxFeeData/${txName}`, GET);
      if (err) return setModalMessage(`${err.status}: ${err.message}`);

      return setTxFeeInUsd(Number(gasPriceInUsd));
    } catch (err) {
      console.log(err);
      setModalMessage(err.message || "Something went wrong");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event;

    const newState = { ...updatedBid };
    newState[name] = value;

    setUpdatedBid(newState);
    calTotalPayable(newState.pricePerUnit, bid.currencyName);
  };

  const updateBid = async () => {
    try {
      setLoading(true);
      const { err, res } = await authRequest(
        `/bids/updateBidPrice/${bid._id}`,
        PATCH,
        updatedBid
      );
      if (err) {
        setLoading(false);
        return setModalMessage(`${err.status}: ${err.message}`);
      }

      if (res) {
        console.log(res);
        if (res.paymentUrl) {
          setPaymentUrl(res.paymentUrl);
          setLoading(false);
          setOpen(false);
          setSnackbarVisible(true);
          return;
        }
      }
      await getBids();
      setLoading(false);
      setOpen(false);
      ShowToast(toast, "Bid updated successfuly");
      return setModalMessage("success");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setModalMessage(err.message || "Something went wrong");
    }
  };

  const calTotalPayable = async (pricePerUnit, currencyName) => {
    const subTotal = pricePerUnit * offer.amount;
    const convertedUnitPrice =
      currencyName !== offer.currencyName
        ? await convertCurrencies(
            currencyName,
            offer.currencyName,
            pricePerUnit
          )
        : null;
    const appFee = (subTotal * APP_FEE_PERCENTAGE).toFixed(2);
    let convertedTxFee = txFeeInUsd / 2;
    if (currencyName !== "USD")
      convertedTxFee = await convertCurrencies(
        "USD",
        currencyName,
        txFeeInUsd / 2
      );
    const finalPayable =
      subTotal + subTotal * APP_FEE_PERCENTAGE + convertedTxFee;
    setBreakdowns({
      finalPayable,
      appFee,
      subTotal,
      convertedTxFee,
      convertedUnitPrice,
    });
  };

  return (
    <>
      <View>
        <View style={{ margin: 5 }}>
          <Button
            title="Update"
            onPress={() => {
              handleOpen();
            }}
          />
        </View>

        {/* <TouchableOpacity
          onPress={() => {
            handleOpen();
          }}
          style={styles.cancelBtn}
        >
          <Text style={{ color: "white" }}>Update</Text>
        </TouchableOpacity> */}
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
          <Box alignItems="center" backgroundColor={"white"}>
            <Text>
              Update your bid unit price with current value: {bid.pricePerUnit}{" "}
              {bid.currencyName}
            </Text>
            <Text>{modalMessage}</Text>
            <Input
              mx="3"
              placeholder="Input"
              w="30%"
              onChangeText={(text) => {
                let event = {
                  value: text,
                  name: "pricePerUnit",
                };
                handleChange(event);
              }}
              value={updatedBid.pricePerUnit}
            />
            <View style={{ display: "flex", flexDirection: "column" }}>
              <View>
                {breakDowns.convertedUnitPrice !== 0 &&
                  breakDowns.convertedUnitPrice && (
                    <>
                      <Text>Converted Unit Price:</Text>
                      <Text>
                        {breakDowns.convertedUnitPrice}{" "}
                        <Text bold>{offer.currencyName}</Text>
                      </Text>
                    </>
                  )}
                <Text bold>Subtotal:</Text>
                <Text>
                  {breakDowns.subTotal} <Text>{bid.currencyName}</Text>
                </Text>
                <Text bold>App Fee:</Text>
                <Text>
                  {breakDowns.appFee} <Text>{bid.currencyName}</Text> (
                  <Text>{100 * APP_FEE_PERCENTAGE}%</Text>)
                </Text>
                <Text bold>Transaction Fee:</Text>
                <Text>
                  {txFeeInUsd / 2} <Text>USD</Text>{" "}
                  {breakDowns.convertedTxFee && (
                    <>
                      (
                      <Text>
                        {breakDowns.convertedTxFee} {bid.currencyName}
                      </Text>
                      )
                    </>
                  )}
                </Text>
                <Text bold>Total:</Text>
                <Text>
                  {breakDowns.finalPayable} <Text bold>{bid.currencyName}</Text>
                </Text>
              </View>
            </View>
            <View>
              <Text bold>Note:</Text>
              <Text>
                {" "}
                The above totals are just estimations that can vary depending on
                currency rates.
              </Text>
            </View>
            <View>
              <Btn onPress={updateBid} isLoading={loading}>
                Update Bid
              </Btn>
            </View>
          </Box>
        </Modal>
      </View>
    </>
  );
};

export const BidsListView = ({ bids, getBids }) => {
  const [message, setMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [txModal, setTxModal] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const SeeTransactions = () => {
    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={txModal}
          useNativeDriver={true}
          onBackdropPress={() => {
            setTxModal(false);
          }}
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            setTxModal(false);
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
              source={{ uri: `${paymentUrl}` }}
              onNavigationStateChange={(data) => {
                if (data?.url?.includes(`offers?session_id`)) {
                  ///do if payment successfull
                  ShowToast(toast, "Payment Success");
                  navigation("/Transactions");
                }

                if (data.url.includes("offers?payFailed=true")) {
                  ///do if payment is cancelled
                  setTxModal(false);
                  ShowToast(toast, "Payment failed");
                }
              }}
            />
          </View>
        </Modal>
      </View>
    );
  };

  const cancelBid = async (bidId) => {
    try {
      const { err } = await authRequest(`/bids/cancelBid/${bidId}`, PATCH);
      if (err) return setMessage(`${err.status}: ${err.message}`);

      await getBids();
      return setMessage("success");
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };
  return (
    bids && (
      <>
        <View style={{ backgroundColor: "#131E3A" }}>
          <Text color={"blue.400"}>{message}</Text>
          <LinearGradient
            style={styles.linearStyle1}
            start={[1, 0]}
            end={[0, 1]}
            colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
          >
            <View style={styles.tableHeader}>
              <Text style={styles.AssetText}>Asset Amount</Text>
              <Text style={styles.AssetText}>Bid Unit Price</Text>
              <Text style={styles.AssetText}>Bid Currency</Text>
              <Text style={styles.AssetText}>Offer Unit Price</Text>
              <Text style={styles.AssetText}>Offer Currency</Text>
              <Text style={styles.AssetText}>Offer Issuer</Text>
              <Text
                style={{ color: "#fff", width: wp(10), textAlign: "center" }}
              >
                Status
              </Text>
            </View>
            <ScrollView nestedScrollEnabled={true}>
              {bids.length ? (
                <>
                  {bids.map((bid, index) => (
                    <View>
                      <View key={bid._id} style={styles.mainDataContainer}>
                        <Text style={styles.textColor}>
                          {" "}
                          {bid.offer.assetName}
                        </Text>
                        <Text style={styles.textColor}>{bid.offer.amount}</Text>
                        <Text style={styles.textColor}>{bid.currencyName}</Text>
                        <Text style={styles.textColor}>
                          {bid.offer.pricePerUnit}
                        </Text>
                        <Text style={styles.textColor}>
                          {bid.offer.currencyName}
                        </Text>
                        <Text style={styles.textColor}>{bid.issuerName}</Text>
                        <Text style={{color:"#33B3EA",width:wp(10),textAlign:"center"}}>{bid.status}</Text>
                      </View>
                      {bid.offer.status === OFFER_STATUS_ENUM.ACTIVE && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            margin: 2,
                          }}
                        >
                          {bid.status === BID_STATUS_ENUM.ACTIVE && (
                            <>
                              <UpdateBidModal
                                bid={bid}
                                getBids={getBids}
                                setSnackbarVisible={setSnackbarVisible}
                                setPaymentUrl={setPaymentUrl}
                              />
                              <View style={{ margin: 5 }}>
                                <Button
                                  onPress={cancelBid(bid._id)}
                                  title="Cancel"
                                ></Button>
                              </View>
                            </>
                          )}
                          {bid.status === BID_STATUS_ENUM.CANCELED && (
                            <Button
                              title="Re-Activate"
                              onPress={cancelBid(bid._id)}
                            ></Button>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </>
              ) : (
                <View>
                  <Text style={styles.showText}>No Offers to show !</Text>
                </View>
              )}

              <SnackBar
                visible={snackbarVisible}
                position={"bottom"}
                textMessage="Bid is an exact match. Proceed to complete the transaction"
                actionHandler={() => {
                  //Linking.openURL(paymentUrl)
                  setTxModal(true);
                  SeeTransactions();
                  setSnackbarVisible(false);
                }}
                actionText="Proceed"
              />
            </ScrollView>
            <SeeTransactions />
          </LinearGradient>
        </View>
      </>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(50),
    color: "black",
    paddingBottom: wp(5),
  },
  container2: {
    width: wp(100),
    height: hp(57),
    color: "black",
  },
  scrollView: {
    width: wp(100),
  },
  tableHeader: {
    width: wp(95),
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "#EE96DF",
    paddingVertical: hp(1),
  },
  table: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#E2808A",
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
    width: wp(12),
    textAlign: "center",
  },
  linearStyle1: {
    width: wp(95),
    height: hp(33),
    marginBottom: hp(3),
    marginVertical: hp(2),
    borderRadius: 10,
    alignSelf: "center",
  },
  showText: {
    color: "#fff",
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  textColor: {
    color: "#fff",
    width: wp(10),
    textAlign: "center",
  },
  mainDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(95),
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp(1),
  },
  cancelBtn: {
    width: wp(17),
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#010C66",
    borderRadius: hp(0.6),
    marginLeft: wp(2),
    padding: 3,
  },
});
