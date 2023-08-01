import { useState, useEffect } from "react";
import darkBlue from "../../../../../../assets/darkBlue.png";
import { authRequest, GET, POST } from "../api";
import { NewOfferModal } from "../components/newOffer.modal";
import { FieldView } from "./profile";
import { OfferListView, OfferListViewHome } from "./offers";
import { ConnectToWallet } from "../web3";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { useSelector } from "react-redux";
import { getRegistrationToken } from "../utils/fcmHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import walletImg from "../../../../../../assets/walletImg.png";
import idCard from "../../../../../../assets/idCard.png";

import copyRide from "../.././../../../../assets/copyRide.png";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { BidsListView } from "../components/bidsListView";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../../../icon";
import { alert } from "../../../../reusables/Toasts";

export const HomeView = ({ setPressed }) => {
  const state = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [bids, setBids] = useState();
  const [route, setRoute] = useState("Offers");
  const [profile, setProfile] = useState({
    isVerified: false,
    firstName: "jane",
    lastName: "doe",
    email: "xyz@gmail.com",
    phoneNumber: "93400xxxx",
    isEmailVerified: false,
  });
  const [offers, setOffers] = useState();
  const [walletType, setWalletType] = useState(null);
  const [change, setChange] = useState(false);
  const activeColor = ["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"];
  const inActiveColor = ["#131E3A", "#131E3A"];

  const bootstrapStyleSheet = new BootstrapStyleSheet();
  const { s, c } = bootstrapStyleSheet;
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfileData();
    getOffersData();
    getBidsData();
    syncDevice();
  }, []);
  useEffect(() => {
    fetchProfileData();
    getOffersData();
    getBidsData();
    syncDevice();
  }, [change]);

  const syncDevice = async () => {
    const token = await getRegistrationToken();
    console.log(token);
    console.log("hi", token);
    try {
      const { res } = await authRequest(
        `/users/getInSynced/${await getRegistrationToken()}`,
        GET
      );
      if (res.isInSynced) {
        const { err } = await authRequest("/users/syncDevice", POST, {
          fcmRegToken: await getRegistrationToken(),
        });
        if (err) return setMessage(`${err.message}`);
        return setMessage("Your device is synced");
      }

      return setMessage("");
    } catch (err) {
      //console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return setMessage(` ${err.message} please log in again!`);
      setProfile(res);
    } catch (err) {
      //console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const getOffersData = async () => {
    try {
      const { res, err } = await authRequest("/offers", GET);
      if (err) return setMessage(`${err.message}`);
      setOffers(res);
    } catch (err) {
      // console.log(err)
      setMessage(err.message || "Something went wrong");
    }
  };

  const applyForKyc = async () => {
    try {
      const { err } = await authRequest("/users/kyc", POST);
      if (err) return setMessage(`${err.message}`);

      await fetchProfileData();
      return setMessage("KYC success");
    } catch (err) {
      // console.log(err)
      setMessage(err.message || "Something went wrong");
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

  useEffect(() => {
    AsyncStorageLib.getItem("walletType").then((walletType) => {
      console.log(walletType);
      setWalletType(JSON.parse(walletType));
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: hp(20),
        backgroundColor: "#131E3A",
      }}
    >
      <View style={styles.container}>
        <LinearGradient
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(223, 172, 196, 1)", "rgba(192, 197, 234, 1)"]}
          style={styles.linearContainer}
        >
          <View>
            {state.wallet ? (
              <View>
                <View style={styles.iconwithTextContainer}>
                  <View style={styles.walletContainer}>
                    <Text style={styles.myWallet}>My Wallet </Text>
                    <Image source={walletImg} style={styles.walletImg} />
                  </View>
                  <View style={styles.walletContainer}>
                    <Icon
                      name={"check-outline"}
                      type={"materialCommunity"}
                      color={"#008C62"}
                    />
                    <Text style={styles.connectedText}>Connected!</Text>
                  </View>
                </View>
                <Text style={styles.textColor}>{state.wallet.address}</Text>
              </View>
            ) : (
              <Text style={styles.textColor}>
                Please select a wallet first!
              </Text>
            )}
          </View>

          <View>
            {message ? (
              <>
                <View style={styles.copyRideContainer}>
                  <Text style={styles.messageStyle}>{message}</Text>
                  <View>
                    <Image
                      source={copyRide}
                      style={styles.walletImg}
                      color={"#1D7FA3"}
                    />

                    <Text style={styles.copyText}>copy</Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.textColor}>No Messages!</Text>
            )}
          </View>
        </LinearGradient>

        {walletType === "Ethereum" || walletType === "Multi-coin" ? (
          <Text style={{ color: "black" }}>{walletType} Wallet Connected</Text>
        ) : (
          <Text style={styles.whiteColor}>
            Only Ethereum and Multi-coin based wallets are supported.
          </Text>
        )}
        <Text style={styles.actionText}>Actions</Text>
        {profile && (
          <View>
            <FieldView
              style={{ color: "#fff" }}
              title="KYC Status"
              value={profile.isVerified}
              applyForKyc={applyForKyc}
              type="kyc"
            />
            <View>
              {profile.isVerified ? (
                <>
                  {/* <LinearGradient
                    start={[1, 0]}
                    end={[0, 1]}
                    colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
                    style={styles.PresssableBtn}
                  > */}
                  <TouchableOpacity
                    style={styles.PresssableBtn}
                    onPress={() => {
                      console.log(walletType)
                     // setOpen(true)
                      if (
                        walletType === "Ethereum" ||
                        walletType === "Multi-coin"
                      ) {
                        setOpen(true);
                      } else {
                        
                        alert('error',"Only Ethereum wallet are supported");
                      }
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Create Offer</Text>
                  </TouchableOpacity>
                  {/* </LinearGradient> */}

                  <NewOfferModal
                    user={profile}
                    open={open}
                    setOpen={setOpen}
                    getOffersData={getOffersData}
                  />
                </>
              ) : (
                <Text style={styles.kycText}>
                  Please do KYC to start adding offers
                </Text>
              )}
            </View>
          </View>
        )}
        {/* <View style={{ marginTop: 5 }}>
          <Button
            title="logout"
            color="red"
            onPress={() => {
              const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
              AsyncStorage.removeItem(LOCAL_TOKEN);
              navigation.navigate("Settings");
            }}
          ></Button>
        </View> */}

        <View style={[styles.toggleContainer]}>
          <LinearGradient
            colors={route == "Bids" ? activeColor : inActiveColor}
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.toggleBtn,
                route == "Bid"
                  ? { borderRadius: hp(4) }
                  : { borderRadius: null },
              ]}
              onPress={() => {
                setRoute("Bids");
              }}
            >
              <Text
                style={[
                  route == "Bids" ? { color: "#fff" } : { color: "#407EC9" },
                ]}
              >
                Bid
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{ borderRadius: 8 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={route == "Offers" ? activeColor : inActiveColor}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.toggleBtn2]}
              onPress={() => {
                setRoute("Offers");
              }}
            >
              <Text
                style={[
                  route == "Offers" ? { color: "#fff" } : { color: "#407EC9" },
                ]}
              >
                My Offers
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {route === "Offers" ? (
          <View>
            <View style={styles.addofferText}>
              <Text style={styles.whiteColor}>My Offers</Text>
              <Text style={{ color: "#EE96DF" }}>Add Offer</Text>
            </View>

            <OfferListViewHome
              self={true}
              profile={profile}
              offers={offers}
              setChange={setChange}
            />
          </View>
        ) : (
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.bidText}>My Bids</Text>
            {bids && profile && (
              <BidsListView bids={bids} getBids={getBidsData} />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(100),
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#131E3A",
  },
  linearContainer: {
    width: wp(90),
    padding: hp(2),
    paddingVertical: hp(3),
    borderRadius: hp(2),
    marginTop: hp(3),
  },
  textColor: {
    color: "black",
  },
  iconwithTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  copyTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(1.9),
  },
  copyText: {
    color: "#2027AC",
  },
  myWallet: {
    fontWeight: "700",
  },
  walletContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  connectedText: {
    color: "#008C62",
  },
  walletImg: {
    height: hp(2.8),
    width: wp(5),
    alignSelf: "center",
  },
  copyRideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(6.8),
    width: wp(90),
  },
  copyText: {
    textAlign: "right",
    color: "black",
    marginHorizontal: wp(5),
  },
  messageStyle: {
    color: "black",
    width: wp(45),
  },
  PresssableBtn: {
    backgroundColor: "#4CA6EA",
    padding: hp(1),
    width: wp(30),
    alignSelf: "center",
    paddingHorizontal: wp(3),
    borderRadius: hp(0.8),
    marginBottom: hp(2),
    alignItems: "center",
  },
  addofferText: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(50),
    marginLeft: wp(40),
    alignItems: "center",
  },
  whiteColor: {
    color: "#fff",
    marginVertical: hp(2),
    width: wp(80),
  },
  toggleContainer: {
    alignSelf: "center",
    marginVertical: hp(2),
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
  logoImg: {
    height: hp("15"),
    width: wp("15"),
    alignSelf: "center",
  },
  actionText: {
    color: "#fff",
    marginBottom: hp(2),
  },
  kycText: {
    color: "#fff",
    marginTop: hp(2),
  },
  bidText: {
    color: "#fff",
  },
  
});

/*
<View style={{position:'absolute', height:hp(30)}}>

                  <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            />
            </View>
*/

// import { useState, useEffect } from "react";
// import { authRequest, GET, POST } from "../api";
// import { NewOfferModal } from "../components/newOffer.modal";
// import { FieldView } from "./profile";
// import { OfferListView, OfferListViewHome } from "./offers";
// import { ConnectToWallet } from "../web3";
// import { StyleSheet, Text, View, Button, Image, Pressable } from "react-native";
// import BootstrapStyleSheet from "react-native-bootstrap-styles";
// import { useSelector } from "react-redux";
// import { getRegistrationToken } from "../utils/fcmHandler";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
// import AsyncStorageLib from "@react-native-async-storage/async-storage";
// import { BidsListView } from "../components/bidsListView";
// import walletImg from "../../../../../../assets/walletImg.png";
// import idCard from "../../../../../../assets/idCard.png";

// import copyRide from "../.././../../../../assets/copyRide.png";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import Icon from "../../../../../icon";
// import { LinearGradient } from "expo-linear-gradient";
// import { id } from "ethers/lib/utils";

// export const HomeView = ({ setPressed }) => {
//   const state = useSelector((state) => state);
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState();
//   const [bids, setBids] = useState();
//   const [route, setRoute] = useState("Offers");
//   const [profile, setProfile] = useState({
//     isVerified: false,
//     firstName: "jane",
//     lastName: "doe",
//     email: "xyz@gmail.com",
//     phoneNumber: "93400xxxx",
//     isEmailVerified: false,
//   });
//   const [offers, setOffers] = useState();
//   const [walletType, setWalletType] = useState(null);
//   const [change, setChange] = useState(false);

//   const bootstrapStyleSheet = new BootstrapStyleSheet();
//   const { s, c } = bootstrapStyleSheet;
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchProfileData();
//     getOffersData();
//     getBidsData();
//     syncDevice();
//   }, []);
//   useEffect(() => {
//     fetchProfileData();
//     getOffersData();
//     getBidsData();
//     syncDevice();
//   }, [change]);

//   const syncDevice = async () => {
//     const token = await getRegistrationToken();
//     console.log(token);
//     console.log("hi", token);
//     try {
//       const { res } = await authRequest(
//         `/users/getInSynced/${await getRegistrationToken()}`,
//         GET
//       );
//       if (res.isInSynced) {
//         const { err } = await authRequest("/users/syncDevice", POST, {
//           fcmRegToken: await getRegistrationToken(),
//         });
//         if (err) return setMessage(`${err.message}`);
//         return setMessage("Your device is synced");
//       }

//       return setMessage("");
//     } catch (err) {
//       //console.log(err)
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const fetchProfileData = async () => {
//     try {
//       const { res, err } = await authRequest("/users/getUserDetails", GET);
//       if (err) return setMessage(` ${err.message} please log in again!`);
//       setProfile(res);
//     } catch (err) {
//       //console.log(err)
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const getOffersData = async () => {
//     try {
//       const { res, err } = await authRequest("/offers", GET);
//       if (err) return setMessage(`${err.message}`);
//       setOffers(res);
//     } catch (err) {
//       // console.log(err)
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const applyForKyc = async () => {
//     try {
//       const { err } = await authRequest("/users/kyc", POST);
//       if (err) return setMessage(`${err.message}`);

//       await fetchProfileData();
//       return setMessage("KYC success");
//     } catch (err) {
//       // console.log(err)
//       setMessage(err.message || "Something went wrong");
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

//   useEffect(() => {
//     AsyncStorageLib.getItem("walletType").then((walletType) => {
//       console.log(walletType);
//       setWalletType(JSON.parse(walletType));
//     });
//   }, []);

//   return (
//     <>
//       <View style={styles.container}>
//         <View style={styles.walletCard}>
//           <LinearGradient
//            start={[1, 0]}
//            end={[0, 1]}
//             colors={["rgba(223, 172, 196, 1)", "rgba(192, 197, 234, 1)"]}
//             style={styles.linearContainer}
//           >
//             <View style={styles.iconwithTextContainer}>
//               <View style={styles.walletContainer}>
//                 <Text style={styles.myWallet}>My Wallet </Text>
//                 <Image source={walletImg} style={styles.walletImg} />
//               </View>
//               <View style={styles.walletContainer}>
//                 <Icon
//                   name={"check-outline"}
//                   type={"materialCommunity"}
//                   color={"#008C62"}
//                 />
//                 <Text style={styles.connectedText}>Connected!</Text>
//               </View>
//             </View>

//             <View style={styles.copyRideContainer}>
//               <Text>1Lbcfr7sAHTD9CgdQo3HTMTkV</Text>
//               <Image
//                 source={copyRide}
//                 style={styles.walletImg}
//                 color={"#1D7FA3"}
//               />
//             </View>
//             <View style={styles.copyTextContainer}>
//               <Text>8LK4ZnX71</Text>
//               <Text style={styles.copyText}>Copy</Text>
//             </View>
//           </LinearGradient>
//         </View>

//         <View style={styles.idCardContainer}>
//           <View style={styles.walletContainer}>
//             <Text style={styles.idtext}>Identity Status</Text>
//             <Image source={idCard} style={styles.idcardImg} />
//           </View>
//           <View style={styles.walletContainer}>
//             <Icon
//               name={"check-outline"}
//               type={"materialCommunity"}
//               color={"#008C62"}
//               style={styles.checkImg}
//             />
//             <Text style={styles.connectedText}>Verified!</Text>
//           </View>
//         </View>

//         <Text style={styles.readyText}>You are ready to</Text>
//         <LinearGradient
//          start={[1, 0]}
//          end={[0, 1]}
//           colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
//           style={styles.PresssableBtn}
//         >
//           <Pressable>
//             <Text style={styles.textColor}>Bid On Offers!</Text>
//           </Pressable>
//         </LinearGradient>

//         <View style={styles.offerTextContainer}>
//           <Text style={styles.myoffer}>My Offers</Text>
//           <Text style={styles.addoffer}>Add Offer</Text>
//         </View>

//         <View style={styles.tableContainer}>
//           <LinearGradient
//             style={{ borderRadius: wp(3) }}
//             start={[1, 0]}
//             end={[0, 1]}
//             colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
//           >
//             <View style={styles.assetTextContainer}>
//               <Text style={styles.amountText}>Asset Amount</Text>
//               <Text style={styles.statustext}>Unit Price (of Eth)</Text>
//               <Text style={styles.statustext}>Total Price (In INR)</Text>
//               <View style={{ position: "relative" }}>
//                 <Icon
//                   name={"info"}
//                   type={"feather"}
//                   style={styles.infoIcon}
//                   color={"#DBAFC9"}
//                 />
//                 <Text style={styles.textColor}>Status</Text>
//               </View>
//             </View>
//             <View style={styles.activeTextConatiner}>
//               <Text style={styles.textColor}>1.4 Eth</Text>
//               <Text style={styles.textColor}>1,000,000</Text>
//               <Text style={styles.textColor}>1,50,040 INR</Text>
//               <Text style={styles.textColor}>Active</Text>
//             </View>
//             <Pressable style={styles.BidsBtn}>
//               <Text style={styles.bidText}>See Bids</Text>
//             </Pressable>
//           </LinearGradient>
//         </View>

//         {/* <View style={styles.container}>
//           {state.wallet ? (
//             <View>
//               <Text>Wallet Connected</Text>
//               <Text>{state.wallet.address}</Text>
//             </View>
//           ) : (
//             <Text>Please select a wallet first!</Text>
//           )}
//         </View>
//         {walletType === "Ethereum" || walletType === "Multi-coin" ? (
//           <Text>{walletType} Wallet Connected</Text>
//         ) : (
//           <Text>Only Ethereum and Multi-coin based wallets are supported.</Text>
//         )}
//         <Text style={styles.container}>Actions</Text>
//         {profile && (
//           <View style={styles.container}>
//             <FieldView
//               title="KYC Status"
//               value={profile.isVerified}
//               applyForKyc={applyForKyc}
//               type="kyc"
//             />
//             <View style={styles.container}>
//               {profile.isVerified ? (
//                 <>
//                   <Button
//                     title="offer"
//                     color={"green"}
//                     onPress={() => {
//                       if (
//                         walletType === "Ethereum" ||
//                         walletType === "Multi-coin"
//                       ) {
//                         setOpen(true);
//                       } else {
//                         alert("Only Ethereum wallet are supported");
//                       }
//                     }}
//                   ></Button>
//                   <NewOfferModal
//                     user={profile}
//                     open={open}
//                     setOpen={setOpen}
//                     getOffersData={getOffersData}
//                   />
//                 </>
//               ) : (
//                 <Text>Please do KYC to start adding offers</Text>
//               )}
//             </View>
//           </View>
//         )}
//         <View style={{ marginTop: 5 }}>
//           <Button
//             title="logout"
//             color="red"
//             onPress={() => {
//               const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
//               AsyncStorage.removeItem(LOCAL_TOKEN);
//               navigation.navigate("Settings");
//             }}
//           ></Button>
//         </View>
//         <View style={{ marginTop: 5, display: "flex", flexDirection: "row" }}>
//           <View style={{ margin: 2 }}>
//             <Button
//               title={"Bids"}
//               color={route === "Bids" ? "green" : "grey"}
//               onPress={() => {
//                 setRoute("Bids");
//               }}
//             ></Button>
//           </View>
//           <View style={{ margin: 2 }}>
//             <Button
//               title={"Offers"}
//               color={route === "Offers" ? "green" : "grey"}
//               onPress={() => {
//                 setRoute("Offers");
//               }}
//             ></Button>
//           </View>
//         </View>

//         {route === "Offers" ? (
//           <View style={styles.container2}>
//             <Text>Your Offers</Text>
//             <OfferListViewHome
//               self={true}
//               profile={profile}
//               offers={offers}
//               setChange={setChange}
//             />
//           </View>
//         ) : (
//           <View
//             style={{
//               alignContent: "center",
//               alignItems: "center",
//               backgroundColor: "white",
//             }}
//           >
//             <Text>Your Bids</Text>
//             {bids && profile && (
//               <BidsListView bids={bids} getBids={getBidsData} />
//             )}
//           </View>
//         )} */}
//       </View>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     // display: "flex",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     backgroundColor:"#391F7D",
//     height:hp(100)
//   },
//   container2: {
//     display: "flex",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//   },
//   linearContainer: {
//     marginTop: hp(1),
//     padding: hp(2),
//     paddingVertical: hp(4),
//     borderRadius: hp(2),
//   },
//   walletCard: {
//     width: wp(90),
//     marginTop:hp(1.5)
//   },
//   textColor: {
//     color: "#fff",
//   },
//   bidText:{
//     color:"#fff",
//     textAlign:"center",
//   },
//   copyRideContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingRight: wp(6.8),
//   },
//   idCardContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: wp(88),
//     marginTop: hp(3),
//     paddingBottom:hp(1),
//     borderBottomWidth:StyleSheet.hairlineWidth*1,
//     borderBottomColor:"#529C8C"
//   },
//   iconwithTextContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   copyTextContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingRight: wp(1.9),
//   },
//   copyText: {
//     color: "#2027AC",
//   },
//   myWallet:{
// fontWeight:"700",
//   },
//   walletContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     marginBottom:hp(1)
//   },
//   connectedText: {
//     color: "#008C62",
//   },
//   walletImg: {
//     height: hp(2),
//     width: wp(4),
//   },
//   idcardImg: {
//     height: hp(2),
//     width: wp(4),
//     marginHorizontal: hp(1),
//   },
//   checkImg: {
//     marginHorizontal: hp(0.6),
//   },
//   idtext: {
//     color: "#CBBBDC",
//   },
//   PresssableBtn: {
//     padding: hp(1),
//     paddingHorizontal: wp(3),
//     borderRadius: hp(0.8),
//     marginBottom: hp(2),
//   },
//   readyText: {
//     marginVertical: hp(3),
//     color:"#fff",
//     fontSize:wp(4.5)
//   },
//   offerTextContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: wp(76),
//     marginLeft: hp(18),
//     marginBottom:hp(2)
//   },
//   addoffer: {
//     color: "#EE96DF",
//   },
//   myoffer: {
//     fontSize: hp(2.3),
//     color:"#fff"
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
//   tableContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   statustext: {
//     width: wp(20),
//     color: "#fff",
//   },
//   amountText: {
//     width: wp(20),
//     color: "#fff",
//   },
//   BidsBtn: {
//     width: wp(20),
//     height: hp(3.5),
//     justifyContent:"center",
//     borderRadius: wp(1.6),
//     marginHorizontal:wp(4),
//     backgroundColor: "#010C66",
//     marginBottom:hp(2)
//   },
//   activeTextConatiner: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: wp(90),
//     padding: hp(2),
//     paddingHorizontal: wp(5),
//     paddingVertical: hp(1),
//   },
//   infoIcon: {
//     alignSelf: "flex-end",
//     position: "absolute",
//     // left:10,
//     top: -8,
//     right: -13,
//   },
// });
