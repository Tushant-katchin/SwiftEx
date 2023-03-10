import React from "react";
import { useEffect, useState } from "react";
import { authRequest, GET, POST } from "../api";
import { Navbar } from "../components/nav";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const VERIFICATION_STATUS = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
  SUBMITTING: "SUBMITTING",
  OTP_SENT: "OTP_SENT",
  UPDATE_ON: "UPDATE_ON",
};

const VerifyActionButtonView = ({ onSubmit, status }) => {
  if (status === VERIFICATION_STATUS.VERIFIED) {
    return <Icon name="verified" size={30} />;
  }

  if (status === VERIFICATION_STATUS.UNVERIFIED) {
    return <Button title="verify" color={"blue"} onPress={onSubmit}></Button>;
  }

  if (status === VERIFICATION_STATUS.UPDATE_ON) {
    return <Button title="update" color={"blue"} onPress={onSubmit}></Button>;
  }

  if (status === VERIFICATION_STATUS.OTP_SENT) {
    return (
      <Button title="Resend OTP" color={"blue"} onPress={onSubmit}></Button>
    );
  }

  if (status === VERIFICATION_STATUS.SUBMITTING) {
    return <ActivityIndicator size={"small"} color={"blue"} />;
  }
};

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

const EmailView = ({ value, isVerified }) => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(value);
  const [message, setMessage] = useState("");
  const [isOtpSubmiting, setIsOtpSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(
    isVerified ? VERIFICATION_STATUS.VERIFIED : VERIFICATION_STATUS.UNVERIFIED
  );

  useEffect(() => {
    console.log(isVerified);
    setEmail(value);
  }, [value]);

  useEffect(() => {
    if (isVerified) setVerificationStatus(VERIFICATION_STATUS.VERIFIED);
    if (!isVerified) setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
  }, [isVerified]);

  const handleEmailChange = (e) => {
    setMessage("");
    console.log(e);
    let newValue = e;
    if (newValue === value) {
      setVerificationStatus(
        isVerified
          ? VERIFICATION_STATUS.VERIFIED
          : VERIFICATION_STATUS.UNVERIFIED
      );
    } else {
      setVerificationStatus(VERIFICATION_STATUS.UPDATE_ON);
    }
    setEmail(e);
  };
  const handleOtpChange = (e) => setOtp(e);

  const submitEmail = async () => {
    if (verificationStatus === VERIFICATION_STATUS.UPDATE_ON)
      return await submitEmailUpdate();
    return await submitEmailVerification();
  };

  const submitEmailVerification = async () => {
    try {
      setVerificationStatus(VERIFICATION_STATUS.SUBMITTING);
      const { err } = await authRequest("/users/verifyUserEmail", POST, {
        email,
      });
      if (err) throw new Error(err.message);
      setVerificationStatus(VERIFICATION_STATUS.OTP_SENT);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
      setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
    }
  };

  const submitEmailUpdate = async () => {
    try {
      setVerificationStatus(VERIFICATION_STATUS.SUBMITTING);
      const { err } = await authRequest("/users/updateEmail", POST, {
        email,
      });
      if (err) throw new Error(err.message);
      setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
      setVerificationStatus(VERIFICATION_STATUS.UPDATE_ON);
    }
  };

  const submitOtp = async () => {
    try {
      setIsOtpSubmitting(true);
      const { err } = await authRequest("/users/verifyUserEmail", POST, {
        email,
        otp,
      });
      if (err) throw new Error(err.message);
      setVerificationStatus(VERIFICATION_STATUS.VERIFIED);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const OutlinedInput = ({ EndAdornment, type }) => {
    return (
      <View
        style={{
          width: wp(60),
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {type === "email" ? (
          <EndAdornment status={verificationStatus} onSubmit={submitEmail} />
        ) : isOtpSubmiting ? (
          <ActivityIndicator size={"small"} color={"blue"} />
        ) : (
          <Button title="Submit" onPress={submitOtp}>
            submit
          </Button>
        )}
      </View>
    );
  };
  return (
    <View
      style={{
        width: wp(60),
        display: "flex",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Email</Text>
      <View style={{ display: "flex" }}>
        <TextInput
          style={styles.input}
          theme={{ colors: { text: "white" } }}
          value={email}
          placeholder={email}
          onChangeText={(text) => {
            // onChange(text)
            handleEmailChange(text);
            
          }}
          autoCapitalize={"none"}
          placeholderTextColor="#FFF"
        />
        <OutlinedInput
          EndAdornment={VerifyActionButtonView}
          type="email"
        />
      </View>
      {verificationStatus === VERIFICATION_STATUS.OTP_SENT && (
        <View>
        <TextInput
        style={styles.input}
        theme={{ colors: { text: "white" } }}
        value={otp}
        placeholder={email}
        onChangeText={(text) => {
          // onChange(text)
          handleOtpChange(text);
          
        }}
        autoCapitalize={"none"}
        placeholderTextColor="#FFF"
      />
        <OutlinedInput
          EndAdornment={
            isOtpSubmiting ? (
              <ActivityIndicator size={"small"} color={"blue"} />
            ) : (
              <Button title="Submit" onPress={submitOtp}>
                submit
              </Button>
            )
          }
          type="otp"
        />
        </View>
      )}
      <Text style={{ color: "red" }}>{message}</Text>
    </View>
  );
};

export const ProfileView = (props) => {
  const state = useSelector((state) => state);
  const [profile, setProfile] = useState({
    isVerified: false,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    walletAddress: "",
    isEmailVerified: false,
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
        <EmailView value={profile.email} isVerified={profile.isEmailVerified} />
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
  input: {
    height: hp("5%"),
    marginBottom: hp("2"),
    color: "black",
    marginTop: hp("1"),
    width: wp("60"),
    borderRadius: wp("20"),
    textAlign: "center",
    borderWidth: 2,
  },
});
