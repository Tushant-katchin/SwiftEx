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

// import { LinearProgress } from "@mui/material";
// import { useEffect, useState } from "react";
// import { authRequest, GET } from "../api";
// import { NewBidModal } from "../components/newBid.modal";
// import { OfferBidsView } from "../components/offerBids.modal";
// import { TabView, SceneMap } from "react-native-tab-view";
// import { ActivityIndicator, DataTable } from "react-native-paper";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   useWindowDimensions,
//   Pressable,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { Provider as PaperProvider } from "react-native-paper";
// import { CHAIN_ID_TO_SCANNER } from "../web3";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "../../../../../icon";
// import OffersButton from "../../../../offersButton";
// import { style } from "@mui/system";

// const data = [
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
//   {
//     Amount: "0.01 Eth",
//     Price: "0.01 Eth",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
// ];

// const Biddata = [
//   {
//     Amount: "0.01 Eth",
//     Price: "1,000,000",
//     TotalPrice: "1,000 INR",
//     Status: "Active",
//     Bid: "6 Bids",
//   },
// ];

// export const OfferListView = ({ self = false, offers, profile, setChange }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <ScrollView contentContainerStyle={styles.tableContainer}>
//       <LinearGradient
//         style={styles.linearStyleContainer}
//         start={[1, 0]}
//         end={[0, 1]}
//         colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
//       >
//         <View style={styles.assetTextContainer}>
//           <Text style={styles.amountText}>Asset Amount</Text>
//           <Text style={styles.statustext}>Unit Price (of Eth)</Text>
//           <Text style={styles.statustext}>Total Price (In INR)</Text>
//           <View style={{ position: "relative" }}>
//             <Icon
//               name={"info"}
//               type={"feather"}
//               style={styles.infoIcon}
//               color={"#DBAFC9"}
//             />
//             <Text style={styles.textColor}>Status</Text>
//           </View>
//         </View>

//         {data.map((item, index) => {
//           return (
//             <>
//               <View style={styles.activeTextContainer}>
//                 <Text style={styles.textColor}>{item.Amount}</Text>
//                 <Text style={styles.textColor}>{item.Price}</Text>
//                 <Text style={styles.textColor}>{item.TotalPrice}</Text>
//                 <Text style={styles.textColor}>{item.Status}</Text>
//               </View>
//               <View style={styles.placeBidContainer}>
//                 <Text>{item.Bid}</Text>

//                 <LinearGradient
//                   style={styles.bidsBtnStyle}
//                   colors={["rgba(51, 179, 234, 1)", "rgba(56, 176, 234, 1)"]}
//                 >
//                   <TouchableOpacity>
//                     <Text style={styles.textColor}>Place Bid</Text>
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </View>
//             </>
//           );
//         })}
//       </LinearGradient>
//     </ScrollView>
//   );
// };
// export const OfferListViewHome = ({
//   self = false,
//   offers,
//   profile,
//   setChange,
//   setPressed,
// }) => {
//   const [open, setOpen] = useState(false);
  
//   return (
//     <ScrollView contentContainerStyle={styles.tableContainer}>
//       <LinearGradient
//         style={styles.offerlistStyleContainer}
//         start={[1, 0]}
//         end={[0, 1]}
//         colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
//       >
//         <View style={styles.assetTextContainer}>
//           <Text style={styles.amountText}>Asset Amount</Text>
//           <Text style={styles.statustext}>Unit Price (of Eth)</Text>
//           <Text style={styles.statustext}>Total Price (In INR)</Text>
//           <View style={{ position: "relative" }}>
//             <Icon
//               name={"info"}
//               type={"feather"}
//               style={styles.infoIcon}
//               color={"#DBAFC9"}
//             />
//             <Text style={styles.textColor}>Status</Text>
//           </View>
//         </View>

//         {Biddata.length ? (
//           <>
//             {Biddata.map((item, index) => {
//               return (
//                 <>
//                   <View style={styles.activeTextContainer}>
//                     <Text style={styles.textColor}>{item.Amount}</Text>
//                     <Text style={styles.textColor}>{item.Price}</Text>
//                     <Text style={styles.textColor}>{item.TotalPrice}</Text>
//                     <Text style={styles.textColor}>{item.Status}</Text>
//                   </View>
//                 </>
//               );
//             })}
//             <Pressable style={styles.BidsBtn}>
//               <Text style={styles.bidText}>See Bids</Text>
//             </Pressable>
//           </>
//         ) : (
//           <Text style={styles.noOfferText}>No Offers to show!</Text>
//         )}
//       </LinearGradient>
//     </ScrollView>
//   );
// };

// export const OfferView = () => {
//   const [message, setMessage] = useState();
//   const [offers, setOffers] = useState();
//   const [change, setChange] = useState(false);
//   const [profile, setProfile] = useState({
//     isVerified: false,
//     firstName: "tushant",
//     lastName: "chakravarty",
//     email: "tushant@gmail.com",
//     phoneNumber: "9340079982",
//     isEmailVerified: true,
//   });
//   const [paymentFollowUp, setPaymentFollowUp] = useState(false);
//   const [txLink, setTxLink] = useState(null);
//   const [refreshTx, setRefreshTx] = useState(false);
//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: "first", title: "Bid" },
//     { key: "second", title: "My Offers" },
//   ]);
//   const [bids, setBids] = useState();
//   const layout = useWindowDimensions();

//   useEffect(() => {
//     getOffersData();
//     fetchProfileData();
//     getBidsData();
//   }, []);

//   useEffect(() => {
//     getOffersData();
//     fetchProfileData();
//     getBidsData();
//   }, [change]);

//   const getOffersData = async () => {
//     try {
//       const { res, err } = await authRequest("/offers", GET);
//       if (err) return setMessage(`${err.status}: ${err.message}`);
//       setOffers(res);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const fetchProfileData = async () => {
//     try {
//       const { res, err } = await authRequest("/users/getUserDetails", GET);
//       if (err) return setMessage(`${err.status}: ${err.message}`);
//       console.log(res);
//       setProfile(res);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const fetchTransactionData = async (sessionId) => {
//     try {
//       setPaymentFollowUp(true);
//       const { res, err } = await authRequest(
//         `/transactions/transactionDetails/${sessionId}`,
//         GET
//       );
//       if (err) return setMessage(`${err.status}: ${err.message}`);
//       const { status, cryptoTxHash, chainId } = res;
//       if (status === "PAYMENT_PENDING") return setRefreshTx(true);
//       if (cryptoTxHash)
//         setTxLink(`${CHAIN_ID_TO_SCANNER[chainId]}/tx/${cryptoTxHash}`);
//       setRefreshTx(false);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     } finally {
//       setPaymentFollowUp(false);
//     }
//   };
//   const getBidsData = async () => {
//     try {
//       const { res, err } = await authRequest("/bids", GET);
//       if (err) return setMessage(`${err.status}: ${err.message}`);
//       setBids(res);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const FirstRoute = () => (
//     <View>
//       <OfferListViewHome
//         self={true}
//         profile={profile}
//         offers={offers}
//         setChange={setChange}
//       />
//       {Biddata.length ? (
//         <TouchableOpacity style={styles.transactionBtn}>
//           <Text style={{ color: "#EE96DF" }}>See Transaction</Text>
//         </TouchableOpacity>
//       ) : (
//         <Text style={styles.pleaseText}>Please wait a while, someone will be adding their offer, so you can Bid!</Text>
//       )}
//     </View>
//   );

//   const SecondRoute = () => (
//     <View>
//       <OfferListView
//         offers={offers}
//         profile={profile}
//         setMessage={setMessage}
//         setChange={setChange}
//       />
//     </View>
//   );

//   const renderScene = SceneMap({
//     first: SecondRoute,
//     second: FirstRoute,
//   });

//   return (
//     <View style={{ height: hp(100), backgroundColor: "#131E3A" }}>
//       <Text style={styles.offerText}>Offers</Text>

//       <TabView
//         renderTabBar={(e) => {
//           console.log("{}{}{}{}{}{}", e);
//           return <OffersButton {...e} />;
//         }}
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: wp(100),
//     height: hp(100),
//     color: "black",
//   },
//   container2: {
//     width: wp(100),
//     height: hp(57),
//     color: "black",
//   },
//   scrollView: {
//     width: wp(100),
//   },
//   tableHeader: {
//     backgroundColor: "#DCDCDC",
//     width: wp(100),
//   },
//   table: {
//     display: "flex",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     backgroundColor: "white",
//   },
//   content: {
//     display: "flex",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     height: hp(100),
//     backgroundColor: "white",
//   },
//   tableContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "center",
//     marginTop: hp(2),
//   },
//   amountText: {
//     width: wp(20),
//     color: "#fff",
//   },
//   assetTextContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: wp(90),
//     alignItems: "center",
//     paddingHorizontal: wp(5),
//     paddingVertical: hp(2),
//     borderBottomColor: "#EE96DF",
//     borderBottomWidth: StyleSheet.hairlineWidth * 1,
//   },
//   statustext: {
//     width: wp(20),
//     color: "#fff",
//   },
//   infoIcon: {
//     alignSelf: "flex-end",
//     position: "absolute",
//     // left:10,
//     top: -8,
//     right: -13,
//   },
//   activeTextContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: wp(90),
//     padding: hp(2),
//     marginTop: hp(2),
//     paddingHorizontal: wp(5),
//     paddingVertical: hp(1),
//   },
//   placeBidContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     width: wp(40),
//     marginHorizontal: wp(5),
//   },
//   textColor: {
//     color: "#fff",
//   },
//   BidsBtn: {
//     width: wp(20),
//     height: hp(3.5),
//     justifyContent: "center",
//     borderRadius: wp(1.6),
//     marginHorizontal: wp(4),
//     backgroundColor: "#010C66",
//     marginBottom: hp(2),
//   },
//   bidText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   bidsBtnStyle: {
//     width: wp(20),
//     alignItems: "center",
//     padding: 4,
//     borderRadius: 7,
//   },
//   linearStyleContainer: {
//     borderRadius: hp(2.5),
//     height: hp(80),
//     width: wp(95),
//     borderColor: "#EE96DF",
//     borderWidth: StyleSheet.hairlineWidth * 1,
//   },
//   offerlistStyleContainer: {
//     borderRadius: hp(2.5),
//     height: hp(20),
//     borderColor: "#EE96DF",
//     borderWidth: StyleSheet.hairlineWidth * 1,
//     width: wp(95),
//   },
//   transactionBtn: {
//     width: wp(40),
//     alignSelf: "center",
//     borderRadius: 8,
//     borderColor: "#EE96DF",
//     borderWidth: StyleSheet.hairlineWidth * 1,
//     padding: 8,
//     alignItems: "center",
//     marginTop: hp(6),
//   },
//   offerText: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: hp(3),
//     marginTop: hp(3),
//   },
//   noOfferText: {
//     color: "#fff",
//     marginVertical: hp(2),
//     marginHorizontal: wp(6),
//   },
//   pleaseText:{
//     color:"#fff",
//     width:wp(70),
//     alignSelf:"center",
//     marginRight:wp(13),
//     marginVertical:hp(3)
//   }
// });
