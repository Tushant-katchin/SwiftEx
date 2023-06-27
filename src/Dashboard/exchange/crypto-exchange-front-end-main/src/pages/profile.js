// import React from "react";
// import { useEffect, useState } from "react";
// import { authRequest, GET, POST } from "../api";
// import { Navbar } from "../components/nav";
// import { StyleSheet, Text, View, Button, TextInput } from "react-native";
// import { useSelector } from "react-redux";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { ActivityIndicator } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialIcons";

// const VERIFICATION_STATUS = {
//   VERIFIED: "VERIFIED",
//   UNVERIFIED: "UNVERIFIED",
//   SUBMITTING: "SUBMITTING",
//   OTP_SENT: "OTP_SENT",
//   UPDATE_ON: "UPDATE_ON",
// };

// const VerifyActionButtonView = ({ onSubmit, status }) => {
//   if (status === VERIFICATION_STATUS.VERIFIED) {
//     return <Icon name="verified" size={30} />;
//   }

//   if (status === VERIFICATION_STATUS.UNVERIFIED) {
//     return <Button title="verify" color={"blue"} onPress={onSubmit}></Button>;
//   }

//   if (status === VERIFICATION_STATUS.UPDATE_ON) {
//     return <Button title="update" color={"blue"} onPress={onSubmit}></Button>;
//   }

//   if (status === VERIFICATION_STATUS.OTP_SENT) {
//     return (
//       <Button title="Resend OTP" color={"blue"} onPress={onSubmit}></Button>
//     );
//   }

//   if (status === VERIFICATION_STATUS.SUBMITTING) {
//     return <ActivityIndicator size={"small"} color={"blue"} />;
//   }
// };

// export const FieldView = ({
//   fieldViewStyle,
//   title,
//   value,
//   type,
//   applyForKyc,
//   disabled = true,
// }) => {
//   return (
//     // <>
//     //    {type === "kyc" && value == true ? (
//     //     <>
//     //       <View style={styles.idCardContainer}>
//     //         <View style={styles.walletContainer}>
//     //           <Text style={styles.idtext}>Identity Status</Text>
//     //           <Image source={idCard} style={styles.idcardImg} />
//     //         </View>
//     //         <View style={styles.walletContainer}>
//     //           <Icon
//     //             name={"check-outline"}
//     //             type={"materialCommunity"}
//     //             color={"#008C62"}
//     //             style={styles.checkImg}
//     //           />
//     //           <Text style={styles.connectedText}>Verified!</Text>
//     //         </View>
//     //       </View>
//     //       <Text style={styles.readyText}>You are ready to</Text>
//     //     </>
//     //   ) : (
//     //     <Button
//     //       title="apply"
//     //       onPress={() => {
//     //         applyForKyc();
//     //       }}
//     //     />
//     //   )}
//     // </>
//     <View>
//       {type === "kyc" ? (
//         <>
//           <Text style={{ color: "#fff", textAlign: "center" }}>
//             KYC STATUS {value === false ? "FALSE" : "true"}
//           </Text>
//           {value === true ? (
//             <Text>KYC Done</Text>
//           ) : (
//             <Button
//               title="apply"
//               onPress={() => {
//                 applyForKyc();
//               }}
//             />
//           )}
//         </>
//       ) : (
//         <>
//           <Text>{title}</Text>
//           <Text style={{ backgroundColor: "grey" }}>{value}</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const EmailView = ({ value, isVerified }) => {
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState(value);
//   const [message, setMessage] = useState("");
//   const [isOtpSubmiting, setIsOtpSubmitting] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState(
//     isVerified ? VERIFICATION_STATUS.VERIFIED : VERIFICATION_STATUS.UNVERIFIED
//   );

//   useEffect(() => {
//     console.log(isVerified);
//     setEmail(value);
//   }, [value]);

//   useEffect(() => {
//     if (isVerified) setVerificationStatus(VERIFICATION_STATUS.VERIFIED);
//     if (!isVerified) setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
//   }, [isVerified]);

//   const handleEmailChange = (e) => {
//     setMessage("");
//     console.log(e);
//     let newValue = e;
//     if (newValue === value) {
//       setVerificationStatus(
//         isVerified
//           ? VERIFICATION_STATUS.VERIFIED
//           : VERIFICATION_STATUS.UNVERIFIED
//       );
//     } else {
//       setVerificationStatus(VERIFICATION_STATUS.UPDATE_ON);
//     }
//     setEmail(e);
//   };
//   const handleOtpChange = (e) => setOtp(e);

//   const submitEmail = async () => {
//     if (verificationStatus === VERIFICATION_STATUS.UPDATE_ON)
//       return await submitEmailUpdate();
//     return await submitEmailVerification();
//   };

//   const submitEmailVerification = async () => {
//     try {
//       setVerificationStatus(VERIFICATION_STATUS.SUBMITTING);
//       const { err } = await authRequest("/users/verifyUserEmail", POST, {
//         email,
//       });
//       if (err) throw new Error(err.message);
//       setVerificationStatus(VERIFICATION_STATUS.OTP_SENT);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//       setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
//     }
//   };

//   const submitEmailUpdate = async () => {
//     try {
//       setVerificationStatus(VERIFICATION_STATUS.SUBMITTING);
//       const { err } = await authRequest("/users/updateEmail", POST, {
//         email,
//       });
//       if (err) throw new Error(err.message);
//       setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//       setVerificationStatus(VERIFICATION_STATUS.UPDATE_ON);
//     }
//   };

//   const submitOtp = async () => {
//     try {
//       setIsOtpSubmitting(true);
//       const { err } = await authRequest("/users/verifyUserEmail", POST, {
//         email,
//         otp,
//       });
//       if (err) throw new Error(err.message);
//       setVerificationStatus(VERIFICATION_STATUS.VERIFIED);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     } finally {
//       setIsOtpSubmitting(false);
//     }
//   };

//   const OutlinedInput = ({ EndAdornment, type }) => {
//     return (
//       <View
//         style={{
//           width: wp(60),
//           display: "flex",
//           alignContent: "center",
//           alignItems: "center",
//           backgroundColor: "white",
//         }}
//       >
//         {type === "email" ? (
//           <EndAdornment status={verificationStatus} onSubmit={submitEmail} />
//         ) : isOtpSubmiting ? (
//           <ActivityIndicator size={"small"} color={"blue"} />
//         ) : (
//           <Button title="Submit" onPress={submitOtp}>
//             submit
//           </Button>
//         )}
//       </View>
//     );
//   };
//   return (
//     <View
//       style={{
//         width: wp(60),
//         display: "flex",
//         alignContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Email</Text>
//       <View style={{ display: "flex" }}>
//         <TextInput
//           style={styles.input}
//           theme={{ colors: { text: "white" } }}
//           value={email}
//           placeholder={email}
//           onChangeText={(text) => {
//             // onChange(text)
//             handleEmailChange(text);
//           }}
//           autoCapitalize={"none"}
//           placeholderTextColor="#FFF"
//         />
//         <OutlinedInput EndAdornment={VerifyActionButtonView} type="email" />
//       </View>
//       {verificationStatus === VERIFICATION_STATUS.OTP_SENT && (
//         <View>
//           <TextInput
//             style={styles.input}
//             theme={{ colors: { text: "white" } }}
//             value={otp}
//             placeholder={email}
//             onChangeText={(text) => {
//               // onChange(text)
//               handleOtpChange(text);
//             }}
//             autoCapitalize={"none"}
//             placeholderTextColor="#FFF"
//           />
//           <OutlinedInput
//             EndAdornment={
//               isOtpSubmiting ? (
//                 <ActivityIndicator size={"small"} color={"blue"} />
//               ) : (
//                 <Button title="Submit" onPress={submitOtp}>
//                   submit
//                 </Button>
//               )
//             }
//             type="otp"
//           />
//         </View>
//       )}
//       <Text style={{ color: "red" }}>{message}</Text>
//     </View>
//   );
// };

// export const ProfileView = (props) => {
//   const state = useSelector((state) => state);
//   const [profile, setProfile] = useState({
//     isVerified: false,
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     walletAddress: "",
//     isEmailVerified: false,
//   });
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = async () => {
//     try {
//       const { res, err } = await authRequest("/users/getUserDetails", GET);
//       if (err) return setMessage(`${err.status}: ${err.message}`);
//       setProfile(res);
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   const applyForKyc = async () => {
//     try {
//       const { err } = await authRequest("/users/kyc", POST);
//       if (err) return setMessage(`${err.status}: ${err.message}`);

//       await fetchProfileData();
//       return setMessage("KYC success");
//     } catch (err) {
//       console.log(err);
//       setMessage(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <View style={styles.content}>
//       <Text>My Profile</Text>
//       <Text>{message}</Text>

//       <View style={styles.fieldView}>
//         <View style={{ color: "pink" }}>
//           <FieldView title="First Name" value={profile.firstName} />
//         </View>
//         <FieldView title="Last Name" value={profile.lastName} />
//       </View>
//       <View style={styles.fieldView}>
//         <View style={{ marginRight: 100 }}>
//           <FieldView
//             title="Phone Number"
//             value={profile.phoneNumber}
//             type="text"
//           />
//         </View>
//         <FieldView
//           title="Email Address"
//           value={profile.email}
//           disabled={profile.isEmailVerified}
//           // disabled={profile.email ? true : false}
//           type="email"
//         />
//       </View>
//       <View style={styles.fieldView}>
//         <FieldView title="Wallet Address" value={profile.walletAddress} />
//       </View>
//       <View style={styles.fieldView}>
//         <EmailView value={profile.email} isVerified={profile.isEmailVerified} />
//       </View>
//       <View style={styles.fieldView}>
//         <FieldView
//           title="KYC Status"
//           value={profile.isVerified}
//           applyForKyc={applyForKyc}
//           type="kyc"
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     height: hp(100),
//     width: wp(100),
//   },
//   tableHeader: {
//     backgroundColor: "#DCDCDC",
//   },
//   table: {
//     display: "flex",
//     alignContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     margin: 20,
//   },
//   content: {
//     backgroundColor: "#fff",
//     alignItems: "center",
//     textAlign: "center",
//     height: hp(100),
//     width: wp(100),
//   },
//   fieldView: {
//     display: "flex",
//     flexDirection: "row",
//     marginTop: 30,
//   },
//   input: {
//     height: hp("5%"),
//     marginBottom: hp("2"),
//     color: "black",
//     marginTop: hp("1"),
//     width: wp("60"),
//     borderRadius: wp("20"),
//     textAlign: "center",
//     borderWidth: 2,
//   },
// });

import React from "react";
import idCard from "../../../../../../assets/idCard.png";

import { useEffect, useState } from "react";
import { authRequest, GET, POST } from "../api";
import { Navbar } from "../components/nav";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import girlProfile from "../../../../../../assets/girlProfile.jpg";
import editImage from "../../../../../../assets/editImage.png";
import walletImg from "../../../../../../assets/walletImg.png";
import copyRide from "../.././../../../../assets/copyRide.png";

import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ActivityIndicator } from "react-native-paper";
import Icon from "../../../../../icon";
import { LinearGradient } from "expo-linear-gradient";
import { NewAccountModal } from "../components/newAccount.model";
import BankModel from "../components/bankModel";
// import Icon from "react-native-vector-icons/MaterialIcons";

const data = [
  {
    bankname: "HDFC",
    bankholder: "RosieJackson",
    payoutType: "Standard",
    country: "India",
    currency: "INR",
  },
];

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
    // <View>
    //   {type === "kyc" ? (
    //     <>
    //       <Text style={{color:"#fff"}}>KYC STATUS {value === false ? "FALSE" : "true"}</Text>
    //       {value === true ? (
    //         <Text style={{color:"#fff"}}>KYC Done</Text>
    //       ) : (
    //         <Button
    //           title="apply"
    //           onPress={() => {
    //             applyForKyc();
    //           }}
    //         />
    //       )}
    //     </>
    //   ) : (
    //     <>
    //       <Text>{title}</Text>
    //       <Text style={{ backgroundColor: "grey" }}>{value}</Text>
    //     </>
    //   )}
    // </View>
    <>
      {type === "kyc" && value == true ? (
        <>
          <View style={styles.idCardContainer}>
            <View style={styles.walletContainer}>
              <Text style={styles.idtext}>Identity Status</Text>
              <Image source={idCard} style={styles.idcardImg} />
            </View>
            <View style={styles.walletContainer}>
              <Icon
                name={"check-outline"}
                type={"materialCommunity"}
                color={"#008C62"}
                style={styles.checkImg}
              />
              <Text style={styles.connectedText}>Verified!</Text>
            </View>
          </View>
          <Text style={styles.readyText}>You are ready to</Text>
        </>
      ) : (
        <Button
          title="apply"
          onPress={() => {
            applyForKyc();
          }}
        />
      )}
    </>
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
          backgroundColor: "white",
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
        <OutlinedInput EndAdornment={VerifyActionButtonView} type="email" />
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
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

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
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <Image source={girlProfile} style={styles.img} />
        <Text style={styles.rosieHeading}>Rosie Jasckon</Text>

        <View style={{ flexDirection: "row", marginLeft: wp(10) }}>
          <Icon
            type={"materialCommunity"}
            name={"check-outline"}
            size={hp(2)}
            color={"#698C81"}
          />
          <Text style={styles.verifiedText}>Identity Verified!</Text>
        </View>
      </View>
      <Image source={editImage} style={styles.editimgStyle} />
      <View style={styles.borderStyle}>
        <View style={styles.editField}>
          <Text style={styles.editmobileText}>Mobile No.</Text>
          <Text style={styles.emailFieldText}>E-mail Address</Text>
        </View>
        <View style={styles.editField}>
          <Text style={styles.editFieldText}>+918324343243</Text>
          <Text style={styles.editFieldText}>rosie12@gmail.com</Text>
        </View>
      </View>

      <View style={styles.walletCard}>
        <LinearGradient
          start={[1, 0]}
          end={[0, 1]}
          colors={["rgba(223, 172, 196, 1)", "rgba(192, 197, 234, 1)"]}
          style={styles.linearContainer}
        >
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

          <View style={styles.copyRideContainer}>
            <Text>1Lbcfr7sAHTD9CgdQo3HTMTkV</Text>
            <Image
              source={copyRide}
              style={styles.walletImg}
              color={"#1D7FA3"}
            />
          </View>
          <View style={styles.copyTextContainer}>
            <Text>8LK4ZnX71</Text>
            <Text style={styles.copyText}>Copy</Text>
          </View>
        </LinearGradient>
        {data.length ? (
          <View style={styles.deleteContainer}>
            <Text style={styles.accountText}>Account Details</Text>
            <View style={{ alignItems: "center" }}>
              <Icon
                name={"delete"}
                type={"materialCommunity"}
                size={hp(3)}
                color={"#E96A6A"}
              />
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </View>
        ) : (
          <Text></Text>
        )}

        {data.length ? (
          <>
            <View style={styles.tableContainer}>
              <LinearGradient
                style={{
                  borderRadius: wp(3),
                  borderColor: "#EE96DF",
                  borderWidth: 1,
                }}
                start={[1, 0]}
                end={[0, 1]}
                colors={["rgba(1, 12, 102, 1)", "rgba(224, 93, 154, 1)"]}
              >
                <View style={styles.assetTextContainer}>
                  <Text style={styles.amountText}>Bank Name</Text>
                  <Text style={styles.amountText}>Bank Holder</Text>
                  <Text style={styles.amountText}>Payout Type</Text>
                  <Text style={styles.amountText}>Country</Text>
                  <Text style={styles.amountText}>Currency</Text>
                </View>
                {data.map((item, index) => {
                  return (
                    <View style={styles.activeTextConatiner}>
                      <Text style={styles.amountText}>{item.bankname}</Text>
                      <Text style={styles.bankText}>{item.bankholder}</Text>
                      <Text style={styles.amountText}>{item.payoutType}</Text>
                      <Text style={styles.amountText}>{item.country}</Text>
                      <Text style={styles.amountText}>{item.currency}</Text>
                    </View>
                  );
                })}
              </LinearGradient>
            </View>
            <View style={styles.enableContainer}>
              <Text style={styles.enableText}>Charges Enabled: No</Text>
              <Text style={styles.payoutText}>Payout Enabled: {"  "} No</Text>
            </View>
          </>
        ) : (
          <View>
            <Text style={styles.addedText}>No Bank Account Added!</Text>
            <LinearGradient
              style={styles.addacountBtn}
              start={[1, 0]}
              end={[0, 1]}
              colors={["rgba(70, 169, 234, 1)", "rgba(185, 116, 235, 1)"]}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.accounttextColor}>Add Bank Account</Text>
              </TouchableOpacity>
            </LinearGradient>
            <NewAccountModal
              isVisible={modalVisible}
              onPress={() => {
                setModalVisible(!modalVisible);
                setIsSubmit(!isSubmit);
              }}
            />
            <BankModel
              isVisible={isSubmit}
              onPress={() => {
                setIsSubmit(!isSubmit);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: hp(100),
    backgroundColor: "#131E3A",
    alignSelf: "center",
    width: wp(100),
  },
  content: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: hp(100),
    width: wp(100),
    backgroundColor: "white",
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
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    marginTop: hp(3),
    width: wp(90),
    marginLeft: wp(3),
  },
  img: {
    height: hp(6),
    width: wp(13),
    borderRadius: hp(5),
  },
  rosieHeading: {
    fontSize: hp(2),
    color: "#CBBBDC",
    marginRight: wp(5),
  },
  verifiedText: {
    color: "#698C81",
    fontSize: hp(2),
    width: wp(25),
  },
  editimgStyle: {
    height: hp(4),
    width: wp(8),
    alignSelf: "flex-end",
    marginRight: hp(2),
    marginBottom: hp(1),
  },
  editField: {
    flexDirection: "row",
    width: wp(88),
    justifyContent: "space-between",
    alignSelf: "center",
  },
  editFieldText: {
    color: "#CBBBDC",
  },
  editmobileText: {
    color: "#CBBBDC",
    fontSize: hp(2.1),
  },
  bankText: {
    color: "#fff",
    width: wp(15),
  },
  emailFieldText: {
    color: "#CBBBDC",
    fontSize: hp(2),
    marginRight: wp(4),
    fontSize: hp(2.1),
  },
  walletCard: {
    width: wp(90),
    marginTop: hp(1.5),
    alignSelf: "center",
  },
  linearContainer: {
    marginTop: hp(1),
    padding: hp(2),
    borderWidth: StyleSheet.hairlineWidth * 1,
    paddingVertical: hp(4),
    borderRadius: hp(2),
    borderColor: "#659DEA",
  },
  iconwithTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: hp(1),
  },
  myWallet: {
    fontWeight: "700",
  },
  walletImg: {
    height: hp(2),
    width: wp(4),
  },
  connectedText: {
    color: "#008C62",
  },
  copyRideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(6.8),
  },
  copyTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: wp(4),
  },
  copyText: {
    color: "#2027AC",
  },
  accountText: {
    color: "#fff",
    fontSize: hp(2.3),
  },
  deleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(3),
  },
  deleteText: {
    color: "#E96A6A",
  },
  assetTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(93),
    padding: hp(2),
    alignItems: "center",
    paddingVertical: hp(2),
    borderBottomColor: "#EE96DF",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  tableContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
    alignSelf: "center",
  },
  statustext: {
    width: wp(20),
    color: "#fff",
  },
  amountText: {
    color: "#fff",
    width: wp(15),
  },
  standardText: {
    color: "#fff",
  },
  infoIcon: {
    alignSelf: "flex-end",
    position: "absolute",
    top: -8,
    right: -13,
  },
  activeTextConatiner: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2),
    justifyContent: "space-between",
    width: wp(93),
    paddingVertical: hp(2),
  },
  textColor: {
    color: "#fff",
  },
  bidText: {
    color: "#fff",
    textAlign: "center",
  },
  BidsBtn: {
    width: wp(20),
    height: hp(3.5),
    justifyContent: "center",
    borderRadius: wp(1.6),
    marginHorizontal: wp(4),
    backgroundColor: "#010C66",
    marginBottom: hp(2),
  },
  enableText: {
    color: "#CBBBDC",
    fontSize: hp(2.1),
  },
  enableContainer: {
    marginHorizontal: wp(5),
    marginVertical: hp(2),
  },
  payoutText: {
    color: "#CBBBDC",
    fontSize: hp(2.1),
    marginTop: hp(1),
  },
  borderStyle: {
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
    borderColor: "#659DEA",
    paddingBottom: hp(2),
    width: wp(90),
    alignSelf: "center",
  },
  addedText: {
    color: "#CE6064",
    textAlign: "center",
    fontSize: hp(2.8),
    marginTop: hp(3),
  },
  addacountBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(4.5),
    width: wp(50),
    alignSelf: "center",
    marginTop: hp(3),
    borderRadius: 8,
  },
  accounttextColor: {
    color: "#fff",
  },
  idCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(88),
    marginTop: hp(3),
    paddingBottom: hp(1),
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
    borderBottomColor: "#529C8C",
  },
  idcardImg: {
    height: hp(2),
    width: wp(4),
    marginHorizontal: hp(1),
  },
  checkImg: {
    marginHorizontal: hp(0.6),
  },
  idtext: {
    color: "#CBBBDC",
  },
  checkImg: {
    marginHorizontal: hp(0.6),
  },
  connectedText: {
    color: "#008C62",
  },
  readyText: {
    color: "#fff",
    fontSize: hp(2.3),
    textAlign:"center",
    marginVertical:hp(2)
  },
});
