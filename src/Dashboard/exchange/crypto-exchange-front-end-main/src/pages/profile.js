import { useEffect, useState } from "react";
import { authRequest, GET, POST } from "../api";
import { Navbar } from "../components/nav";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const FieldView = ({
  title,
  value,
  type,
  applyForKyc,
  disabled = true,
}) => {
  return (
    <View>
      {type === "kyc" ? (
        <>
          <Text>KYC STATUS {value === false ? "FALSE" : "true"}</Text>
          {value === true ? (
            <Text>KYC Done</Text>
          ) : (
            <Button
              title="apply"
              onPress={() => {
                applyForKyc();
              }}
            />
          )}
        </>
      ) : (
        <>
          <Text>{title}</Text>
          <Text style={{ backgroundColor: "grey" }}>{value}</Text>
        </>
      )}
    </View>
  );
};

export const ProfileView = (props) => {
  const state = useSelector((state) => state);
  const [profile, setProfile] = useState({
    isVerified: false,
    firstName: "tushant",
    lastName: "chakravarty",
    email: "tushant@gmail.com",
    phoneNumber: "9340079982",
    walletAddress: `${
      state.wallet ? state.wallet.address : "No wallet Connected"
    }`,
    isEmailVerified: true,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setProfile(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  const applyForKyc = async () => {
    try {
      const { err } = await authRequest("/users/kyc", POST);
      if (err) return setMessage(`${err.status}: ${err.message}`);

      await fetchProfileData();
      return setMessage("KYC success");
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.content}>
      <Text>My Profile</Text>
      <Text>{message}</Text>

      <View style={styles.fieldView}>
        <View style={{ marginRight: 130, marginLeft: -50 }}>
          <FieldView title="First Name" value={profile.firstName} />
        </View>
        <FieldView title="Last Name" value={profile.lastName} />
      </View>
      <View style={styles.fieldView}>
        <View style={{ marginRight: 100 }}>
          <FieldView
            title="Phone Number"
            value={profile.phoneNumber}
            type="text"
          />
        </View>
        <FieldView
          title="Email Address"
          value={profile.email}
          disabled={profile.isEmailVerified}
          // disabled={profile.email ? true : false}
          type="email"
        />
      </View>
      <View style={styles.fieldView}>
        <FieldView title="Wallet Address" value={profile.walletAddress} />
      </View>
      <View style={styles.fieldView}>
        <FieldView
          title="KYC Status"
          value={profile.isVerified}
          applyForKyc={applyForKyc}
          type="kyc"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: hp(100),
    width: wp(100),
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
  },
  table: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: 20,
  },
  content: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: 20,
    height: hp(100),
  },
  fieldView: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
  },
});
