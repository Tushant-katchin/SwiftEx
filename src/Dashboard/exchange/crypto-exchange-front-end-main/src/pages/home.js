import { useState, useEffect } from "react";
import { authRequest, GET, POST } from "../api";
import { NewOfferModal } from "../components/newOffer.modal";
import { FieldView } from "./profile";
import { OfferListView, OfferListViewHome } from "./offers";
import { ConnectToWallet } from "../web3";
import { StyleSheet, Text, View, Button } from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { useSelector } from "react-redux";
import { getRegistrationToken } from "../utils/fcmHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { BidsListView } from "../components/bidsListView";

export const HomeView = ({setPressed}) => {
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
    <>
      <View style={styles.container}>
        <View style={styles.container}>
          {message ? <Text>{message}</Text> : <Text>No Messages!</Text>}
        </View>
        <View style={styles.container}>
          {state.wallet ? (
            <View>
              <Text>Wallet Connected</Text>
              <Text>{state.wallet.address}</Text>
            </View>
          ) : (
            <Text>Please select a wallet first!</Text>
          )}
        </View>
        {walletType === "Ethereum" || walletType === "Multi-coin" ? (
          <Text>{walletType} Wallet Connected</Text>
          ) : (
          <Text>Only Ethereum and Multi-coin based wallets are supported.</Text>
        )}
        <Text style={styles.container}>Actions</Text>
        {profile && (
          <View style={styles.container}>
            <FieldView
              title="KYC Status"
              value={profile.isVerified}
              applyForKyc={applyForKyc}
              type="kyc"
            />
            <View style={styles.container}>
              {profile.isVerified ? (
                <>
                  <Button
                    title="offer"
                    color={"green"}
                    onPress={() => {
                      if (walletType === "Ethereum" || walletType==="Multi-coin" ) {
                        setOpen(true);
                      } else {
                        alert("Only Ethereum wallet are supported");
                      }
                    }}
                  ></Button>
                  <NewOfferModal
                    user={profile}
                    open={open}
                    setOpen={setOpen}
                    getOffersData={getOffersData}
                  />
                </>
              ) : (
                <Text>Please do KYC to start adding offers</Text>
              )}
            </View>
          </View>
        )}
        <View style={{ marginTop: 5 }}>
          <Button
            title="logout"
            color="red"
            onPress={() => {
              const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
              AsyncStorage.removeItem(LOCAL_TOKEN);
              navigation.navigate("Settings");
            }}
          ></Button>
        </View>
        <View style={{ marginTop: 5, display: "flex", flexDirection: "row" }}>
          <View style={{ margin: 2 }}>
            <Button
              title={"Bids"}
              color={route === "Bids" ? "green" : "grey"}
              onPress={() => {
                setRoute("Bids");
              }}
            ></Button>
          </View>
          <View style={{ margin: 2 }}>
            <Button
              title={"Offers"}
              color={route === "Offers" ? "green" : "grey"}
              onPress={() => {
                setRoute("Offers");
              }}
            ></Button>
          </View>
        </View>

        {route === "Offers" ? (
          <View style={styles.container2}>
            <Text>Your Offers</Text>
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
              backgroundColor: "white",
            }}
          >
            <Text>Your Bids</Text>
            {bids && profile && (
              <BidsListView bids={bids} getBids={getBidsData}  />
            )}
          </View>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor:'white'
  },
  container2: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
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
