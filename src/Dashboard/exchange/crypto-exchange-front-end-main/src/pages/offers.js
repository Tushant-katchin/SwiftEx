import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { authRequest, GET } from "../api";
import { NewBidModal } from "../components/newBid.modal";
import { OfferBidsView } from "../components/offerBids.modal";
import { TabView, SceneMap } from "react-native-tab-view";
import { ActivityIndicator, DataTable } from "react-native-paper";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Provider as PaperProvider } from "react-native-paper";
import { CHAIN_ID_TO_SCANNER } from '../web3'

export const OfferListView = ({ self = false, offers, profile, setChange, }) => {
  const [open, setOpen] = useState(false);

  return (
    <PaperProvider>
      <DataTable style={styles.container}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Asset</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
          <DataTable.Title>Price</DataTable.Title>
          <DataTable.Title>Total Price</DataTable.Title>
          <DataTable.Title>Currency</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {offers ? (
            offers.map((offer) => {
              if (self)
                return (
                  offer.issuer === profile._id && (
                    <>
                      <View key={offer._id} style={{backgroundColor:'#E2808A'}}>
                        <ScrollView key={offer._id}>
                          <DataTable.Row key={offer._id}>
                            <DataTable.Cell >{offer.assetName}</DataTable.Cell>

                            <DataTable.Cell>{offer.amount}</DataTable.Cell>
                            <DataTable.Cell>
                              {offer.pricePerUnit}
                            </DataTable.Cell>
                            <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                            <DataTable.Cell>
                              {offer.currencyName}
                            </DataTable.Cell>
                            <DataTable.Cell>{offer.status}</DataTable.Cell>
                          </DataTable.Row>
                        </ScrollView>
                        <OfferBidsView offer={offer} self={self} setChange={setChange} />
                      </View>
                    </>
                  )
                );
              return (
                offer.issuer !== profile._id && (
                  <>
                    <ScrollView style={styles.scrollView}>
                      <DataTable.Row key={offer._id}>
                        <DataTable.Cell>{offer.assetName}</DataTable.Cell>
                        <DataTable.Cell>{offer.amount}</DataTable.Cell>
                        <DataTable.Cell>{offer.pricePerUnit}</DataTable.Cell>
                        <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                        <DataTable.Cell>{offer.currencyName}</DataTable.Cell>
                        <DataTable.Cell>{offer.status}</DataTable.Cell>
                      </DataTable.Row>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <View style={{ marginLeft: 10,marginBottom:hp(5) }}>
                          <OfferBidsView offer={offer} setChange={setChange} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <NewBidModal offer={offer}  />
                        </View>
                      </View>
                    </ScrollView>
                  </>
                )
              );
            })
          ) : (
            <View><ActivityIndicator size={"small"} color={'blue'}/></View>
          )}
        </ScrollView>
      </DataTable>
    </PaperProvider>
  );
};
export const OfferListViewHome = ({ self = false, offers, profile, setChange, setPressed }) => {
  const [open, setOpen] = useState(false);

  return (
    <PaperProvider>
      <DataTable style={styles.container2}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Asset</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
          <DataTable.Title>Price</DataTable.Title>
          <DataTable.Title>Total Price</DataTable.Title>
          <DataTable.Title>Currency</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {offers ? (
            offers.map((offer) => {
              if (self)
                return (
                  offer.issuer === profile._id && (
                    <>
                      <View key={offer._id} style={{backgroundColor:'#E2808A'}}>
                        <ScrollView key={offer._id}>
                          <DataTable.Row key={offer._id}>
                            <DataTable.Cell >{offer.assetName}</DataTable.Cell>

                            <DataTable.Cell>{offer.amount}</DataTable.Cell>
                            <DataTable.Cell>
                              {offer.pricePerUnit}
                            </DataTable.Cell>
                            <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                            <DataTable.Cell>
                              {offer.currencyName}
                            </DataTable.Cell>
                            <DataTable.Cell>{offer.status}</DataTable.Cell>
                          </DataTable.Row>
                        </ScrollView>
                        <OfferBidsView offer={offer} self={self} setChange={setChange} />
                      </View>
                    </>
                  )
                );
              return (
                offer.issuer !== profile._id && (
                  <>
                    <ScrollView style={styles.scrollView}>
                      <DataTable.Row key={offer._id}>
                        <DataTable.Cell>{offer.assetName}</DataTable.Cell>
                        <DataTable.Cell>{offer.amount}</DataTable.Cell>
                        <DataTable.Cell>{offer.pricePerUnit}</DataTable.Cell>
                        <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                        <DataTable.Cell>{offer.currencyName}</DataTable.Cell>
                        <DataTable.Cell>{offer.status}</DataTable.Cell>
                      </DataTable.Row>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <View style={{ marginLeft: 10,marginBottom:hp(5) }}>
                          <OfferBidsView offer={offer} setChange={setChange} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <NewBidModal offer={offer}  />
                        </View>
                      </View>
                    </ScrollView>
                  </>
                )
              );
            })
          ) : (
            <View><ActivityIndicator size={'large'} color={'white'}/></View>
          )}
        </ScrollView>
      </DataTable>
    </PaperProvider>
  );
};

export const OfferView = () => {
  const [message, setMessage] = useState();
  const [offers, setOffers] = useState();
  const[change,setChange] = useState(false)
  const [profile, setProfile] = useState({
    isVerified: false,
    firstName: "tushant",
    lastName: "chakravarty",
    email: "tushant@gmail.com",
    phoneNumber: "9340079982",
    isEmailVerified: true,
  });
  const [paymentFollowUp, setPaymentFollowUp] = useState(false);
  const [txLink, setTxLink] = useState(null);
  const [refreshTx, setRefreshTx] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Bid" },
    { key: "second", title: "My Offers" },
  ]);
  const [bids, setBids] = useState();
  const layout = useWindowDimensions();

  useEffect(() => {
    getOffersData();
    fetchProfileData();
    getBidsData();

  }, []);

  useEffect(() => {
    getOffersData();
    fetchProfileData();
    getBidsData();

  }, [change]);


  const getOffersData = async () => {
    try {
      const { res, err } = await authRequest("/offers", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setOffers(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      console.log(res);
      setProfile(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchTransactionData = async (sessionId) => {
    try {
      setPaymentFollowUp(true);
      const { res, err } = await authRequest(
        `/transactions/transactionDetails/${sessionId}`,
        GET
      );
      if (err) return setMessage(`${err.status}: ${err.message}`);
      const { status, cryptoTxHash, chainId } = res;
      if (status === "PAYMENT_PENDING") return setRefreshTx(true);
      if (cryptoTxHash)
        setTxLink(`${CHAIN_ID_TO_SCANNER[chainId]}/tx/${cryptoTxHash}`);
      setRefreshTx(false);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setPaymentFollowUp(false);
    }
  };
  const getBidsData = async () => {
    try {
      const { res, err } = await authRequest("/bids", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setBids(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white", height:hp(100) }}>
         <OfferListViewHome
              self={true}
              profile={profile}
              offers={offers}
              setChange={setChange}
            /> 
               </View>
  );


  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white" }}>
       <OfferListView
            offers={offers}
            profile={profile}
            setMessage={setMessage}
            setChange={setChange}
          />

    </View>
  );

  const renderScene = SceneMap({
    first: SecondRoute,
    second: FirstRoute,
  });
  return (
  
      <View style={{height:hp(100), backgroundColor:'white'}}>
                <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(80),
    color: "black",
    
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
    backgroundColor: "#DCDCDC",
    width: wp(100),
    
  },
  table: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    
  },
  content: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: hp(100),
    backgroundColor: "white",
  },
});
