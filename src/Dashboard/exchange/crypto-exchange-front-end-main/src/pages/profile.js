import React from "react";
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
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import Bridge from "../../../../../../assets/Bridge.png";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import editImage from "../../../../../../assets/editImage.png";
// import girlProfile from "../../../../../../assets/girlProfile.jpg";
import Profile from "../../../../../../assets/Profile.png"
import walletImg from "../../../../../../assets/walletImg.png";
import copyRide from "../.././../../../../assets/copyRide.png";
import { REACT_APP_LOCAL_TOKEN } from "../ExchangeConstants";
import darkBlue from "../../../../../../assets/darkBlue.png";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ActivityIndicator } from "react-native-paper";
import Icon from "../../../../../icon";
import { LinearGradient } from "expo-linear-gradient";
import { NewAccountModal } from "../components/newAccount.model";
import BankModel from "../components/bankModel";
import idCard from "../../../../../../assets/idCard.png";
import * as Clipboard from "expo-clipboard";
import { alert } from "../../../../reusables/Toasts";
const VERIFICATION_STATUS = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
  SUBMITTING: "SUBMITTING",
  OTP_SENT: "OTP_SENT",
  UPDATE_ON: "UPDATE_ON",
};

const VerifyActionButtonView = ({ onSubmit, status }) => {
  if (status === VERIFICATION_STATUS.VERIFIED) {
    return <Icon
    name={"check-outline"}
    type={"materialCommunity"}
    color={"#008C62"}
    style={styles.checkImg}
  />;
    //  <Icon name="verified" size={20} color={'red'} />;
  }

  if (status === VERIFICATION_STATUS.UNVERIFIED) {
    return <TouchableOpacity style={styles.resend1} onPress={onSubmit}>
      <Text style={{color:"white",fontSize:12}}>Verify</Text>
    </TouchableOpacity>;
    //  <View style={{ flexDirection: "row", marginLeft: wp(10) }}>
    //   <Icon
    //     type={"materialCommunity"}
    //     name={"check-outline"}
    //     size={hp(2)}
    //     color={"#698C81"}
    //     onPress={onSubmit}
    //   />
    //   <Text style={styles.verifiedText}>Identity Verified!</Text>
    // </View>
  }

  if (status === VERIFICATION_STATUS.UPDATE_ON) {
    return <Button title="update" color={"blue"} onPress={onSubmit}></Button>;
  }

  if (status === VERIFICATION_STATUS.OTP_SENT) {
    return (
      <TouchableOpacity style={styles.resend} onPress={onSubmit}>
        <Text style={{ color: "white", fontSize: 12 }}>Resend OTP</Text>
      </TouchableOpacity>
    );
  }

  if (status === VERIFICATION_STATUS.SUBMITTING) {
    return <ActivityIndicator size={"small"} color={"blue"} />;
  }
};

export const FieldView = ({
  valueStyle,
  emailStyle,
  title,
  value,
  type,
  applyForKyc,
  disabled = true,
}) => {
  return (
    // <>
    //    {type === "kyc" && value == true ? (
    //     <>
    //       <View style={styles.idCardContainer}>
    //         <View style={styles.walletContainer}>
    //           <Text style={styles.idtext}>Identity Status</Text>
    //           <Image source={idCard} style={styles.idcardImg} />
    //         </View>
    //         <View style={styles.walletContainer}>
    //           <Icon
    //             name={"check-outline"}
    //             type={"materialCommunity"}
    //             color={"#008C62"}
    //             style={styles.checkImg}
    //           />
    //           <Text style={styles.connectedText}>Verified!</Text>
    //         </View>
    //       </View>
    //       <Text style={styles.readyText}>You are ready to</Text>
    //     </>
    //   ) : (
    //     <Button
    //       title="apply"
    //       onPress={() => {
    //         applyForKyc();
    //       }}
    //     />
    //   )}
    // </>

    <View>
      {type === "kyc" ? (
        <>
          <Text style={styles.KYC}>
            KYC STATUS{" "}
            {value === false ? (
              "FALSE"
            ) : (
              <Icon
                name={"check-outline"}
                type={"materialCommunity"}
                color={"#008C62"}
                style={styles.checkImg}
              />
            )}
          </Text>
          {value === true ? (
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
            </>
          ) : 
          // (
            // <Button
            //   title="apply"
            //   onPress={() => {
            //     applyForKyc();
            //   }}
            // />
            // )
            <></>
          }
        </>
      ) : (
        <>
          <Text style={{ color: "#CBBBDC" }}>{title}</Text>
          <Text style={[styles.valueColor, valueStyle]} numberOfLines={1}>
            {value}
          </Text>
        </>
      )}
    </View>
  );
};

const EmailView = ({ value, isVerified, emailStyle }) => {
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
          <TouchableOpacity style={styles.submitBtn} onPress={submitOtp}>
            <Text>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          width: wp(85),
          marginTop: hp(3),
          justifyContent: "space-between",
        }}
      >
        {/* <TextInput
          numberOfLines={1}
          style={[styles.input, emailStyle]}
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
        <OutlinedInput EndAdornment={VerifyActionButtonView} type="email" /> */}
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
  const { emailStyle } = props;
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
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContainer_menu,setmodalContainer_menu]=useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);
  useEffect(() => {
    getAccountDetails();
  }, []);

  const getAccountDetails = async () => {
    setIsLoading(true);
    try {
      const { res, err } = await authRequest("/users/getStripeAccount", GET);
      if (err) return setMessage(` ${err.message}`);
      setIsLoading(false);
      setAccount(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return [navigation.navigate("exchangeLogin"),setMessage(`${err.status}: ${err.message}`)];
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

  const data = [
    // {
    //   bankname: "HDFC",
    //   bankholder: "Rosie Jackson",
    //   payoutType: "Standard",
    //   country: "India",
    //   currency: "INR",
    // },
  ];
  const navigation = useNavigation();
  const copyToClipboard = () => {
    Clipboard.setString(profile.walletAddress);
    alert("success", "Copied");
  };
  return (
    <>
       <View style={styles.headerContainer1_TOP}>
  <View
    style={{
      justifyContent: "space-around",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <TouchableOpacity onPress={() => navigation.navigate("/")}>
      <Icon
        name={"left"}
        type={"antDesign"}
        size={28}
        color={"white"}
      />
    </TouchableOpacity>
  </View>

  {Platform.OS === "android" ? (
    <Text style={styles.text_TOP}>Profile</Text>
  ) : (
    <Text style={[styles.text_TOP, styles.text1_ios_TOP]}>Profile</Text>
  )}

  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    <Image source={darkBlue} style={styles.logoImg_TOP} />
  </TouchableOpacity>

  <View style={{ alignItems: "center" }}>
   
     <TouchableOpacity
      onPress={() => {
       setmodalContainer_menu(true)
      }}
    >
      <Icon
        name={"menu"}
        type={"materialCommunity"}
        size={30}
        color={"#fff"}
      />
    </TouchableOpacity>
  </View>
</View>
<Modal
      animationType="fade"
      transparent={true}
      visible={modalContainer_menu}>
       
      <TouchableOpacity style={styles.modalContainer_option_top}  onPress={()=>{setmodalContainer_menu(false)}}> 
      <View style={styles.modalContainer_option_sub}>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"pencil"}
        type={"materialCommunity"}
        size={30}
        color={"gray"}
      />
      <Text style={styles.modalContainer_option_text}>Asset</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Image source={Bridge} style={{width:"13%",height:"190%"}} />
      <Text style={styles.modalContainer_option_text}>Bridge Tokens</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"anchor"}
        type={"materialCommunity"}
        size={30}
        color={"gray"}
      />
      <Text style={styles.modalContainer_option_text}>Anchor Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"badge-account-outline"}
        type={"materialCommunity"}
        size={30}
        color={"gray"}
      />
      <Text style={styles.modalContainer_option_text}>KYC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}>
      <Icon
        name={"playlist-check"}
        type={"materialCommunity"}
        size={30}
        color={"gray"}
      />
      <Text style={styles.modalContainer_option_text}>My Subscription</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view}   onPress={() => {
        console.log('clicked');
        const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
        AsyncStorage.removeItem(LOCAL_TOKEN);
        setmodalContainer_menu(false)
        navigation.navigate('exchangeLogin');
      }}>
      <Icon
        name={"logout"}
        type={"materialCommunity"}
        size={30}
        color={"#fff"}
      />
      <Text style={[styles.modalContainer_option_text,{color:"#fff"}]}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalContainer_option_view} onPress={()=>{setmodalContainer_menu(false)}}>
      <Icon
        name={"close"}
        type={"materialCommunity"}
        size={30}
        color={"#fff"}
      />
      <Text style={[styles.modalContainer_option_text,{color:"#fff"}]}>Close Menu</Text>
      </TouchableOpacity>
      </View>
      </TouchableOpacity>
    </Modal>

    <ScrollView>
      <View style={styles.content}>
        <Text style={{ color: "#fff" }}>{message}</Text>

        <View style={styles.profileContainer}>
          <Image source={Profile} style={styles.img}  />
          <View style={[styles.fnlnTextView,{marginTop:Platform==="android"||-19}]}>
            <FieldView
              value={profile.firstName +" "+ profile.lastName}
              valueStyle={styles.nameText}
              numberOfLines={1}
            />
          
          </View>

          <View style={{ flexDirection: "row", marginLeft: wp(10) }}>
            
            <Text style={styles.verifiedText}>   Verified!</Text>


          </View>
        </View>



        <View style={styles.emailphoneView}>
         
          <Text style={{color:"white",fontSize:16}}>Email</Text>
          <Text style={{color:"white",marginTop:4,fontSize:16}}>{profile.email}</Text>
         
        </View>

        <View>
    <Image source={darkBlue} style={{ height: hp("9"),width: wp("12"),alignSelf:"flex-end",position:"absolute"}} />
        <View style={{justifyContent:"center",marginTop:hp(2.7)}}>

        <Text style={{color:"#35CA1D",fontSize:16,alignSelf:"flex-end",position:"absolute"}}>SwiftEx</Text>
        <FieldView
          title="KYC Status"
          value={profile.isVerified}
          applyForKyc={applyForKyc}
          type="kyc"
        />
        </View>
        </View>

        <View style={styles.walletCard}>
          {/* <LinearGradient
            start={[1, 0]}
            end={[0, 1]}
            colors={["rgba(223, 172, 196, 1)", "rgba(192, 197, 234, 1)"]}
            style={styles.linearContainer}
          > */}

<View  style={[styles.linearContainer,{backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)"}]}>
            <View style={styles.iconwithTextContainer}>
              <View style={styles.walletContainer}>
                <Text style={styles.myWallet}>My Wallet </Text>
                <Icon
                      name={"wallet"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                    />
                {/* <Image source={walletImg} style={styles.walletImg} /> */}
              </View>
              <View style={styles.walletContainer}>
              
                <Text style={styles.connectedText}>Connected!</Text>
              </View>
            </View>

            <View style={styles.copyRideContainer}>
             
              <View style={{borderColor:"#485DCA",borderWidth:0.9,borderRadius:5,flexDirection:"row"}}>

               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: wp(70),marginTop:1.9}}>
                   <Text style={{color:"#fff",margin:5,padding:3}}>{profile.walletAddress}</Text>
                    </ScrollView>
              <View style={{ marginHorizontal:1,marginLeft:10 }}>
              
                <TouchableOpacity onPress={()=>{copyToClipboard()}}>
                <Icon
                      name={"content-copy"}
                      type={"materialCommunity"}
                      color={"rgba(129, 108, 255, 0.97)"}
                      size={24}
                      style={{marginTop:0.3}}
                      />
                <Text style={styles.copyText}>copy</Text>
                </TouchableOpacity>
              </View>
                      </View>
            </View>
            </View>
          {/* </LinearGradient> */}
        </View>
        <View>
          <EmailView
            numberOfLines={1}
            emailStyle={styles.emailText}
            value={profile.email}
            isVerified={profile.isEmailVerified}
          />
        </View>
      {isLoading===true?<ActivityIndicator color="green"/>:
        
        account ? (
          <>
          <View style={styles.deleteContainer}>
            <Text style={styles.accountText}>Account Details</Text>
            <View style={{ alignItems: "center" }}>
              <Icon
                name={"delete"}
                type={"materialCommunity"}
                size={hp(2)}
                color={"#E96A6A"}
              />
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </View>
            <View style={styles.tableContainer}>

              <View  style={{
                  borderRadius: wp(3),
                  borderColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
                  borderWidth: 1,
                  backgroundColor:"#212B53"
                }} >
                <View style={styles.assetTextContainer}>

                   <Text style={styles.amountText}>Bank</Text>
                  <Text style={styles.amountText}>Holder</Text>
                  <Text style={styles.amountText}>Payout</Text>
                  <Text style={styles.amountText}>Country</Text>
                  <Text style={styles.amountText}>Currency</Text>
                </View>
                {account.external_accounts.data.map((item, index) => {
                  return (
                    <View style={styles.activeTextConatiner} key={index}>
                      <Text style={styles.amountText}>{item.bank_name}</Text>
                      <Text style={styles.amountText}>
                        {item.account_holder_name}
                      </Text>
                      <Text style={styles.amountText}>
                        {item.available_payout_methods[0]}
                      </Text>
                      <Text style={styles.amountText}>{item.country}</Text>
                      <Text style={styles.amountText}>{item.currency}</Text>
                    </View>
                  );
                })}
              {/* </LinearGradient> */}
              </View>
            </View>
            <View style={styles.enableContainer}>
              <Text style={styles.enableText}>Charges Enabled: No</Text>
              <Text style={styles.payoutText}>Payout Enabled: No</Text>
            </View>
          </>
        ) : (
          <View>
            <Text style={styles.addedText}>No Bank Account Added!</Text>

               <View style={styles.addacountBtn}>
              <TouchableOpacity
                style={{
                  paddingVertical: hp(1),
                  width: wp(50),
                  alignItems: "center",
                  backgroundColor:"#212B53",
                  borderRadius: hp(2),
                  borderColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
                  borderWidth:0.9
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.accounttextColor}>Add Bank Account</Text>
              </TouchableOpacity>
              </View>
            {/* </LinearGradient> */}
            <NewAccountModal
              onCrossIcon={() => {
                setModalVisible(false);
              }}
              isVisible={modalVisible}
              setModalVisible={setModalVisible}
              getAccountDetails={getAccountDetails}
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
    </ScrollView>
    </>
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
    backgroundColor: "#011434",
    alignItems: "center",
    textAlign: "center",
    height: hp(100),
    width: wp(100),
  },
  fieldView: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
  },
  input: {
    marginBottom: hp("2"),
    marginTop: hp("1"),
    borderColor: "#407EC9",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  img: {
    height: hp(6),
    width: wp(12),
    borderRadius: hp(5),
    // marginLeft: wp(3),
    borderColor:"gray",
    borderWidth:1.9
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    // marginTop: hp(2),
    width: wp(90),
    // marginLeft: wp(3),
  },
  verifiedText: {
    color: "#35CA1D",
    fontSize: hp(2),
    width: wp(25),
  },
  fnlnTextView: {
    flexDirection: "row",
    marginRight: wp(19),
    justifyContent: "space-evenly",
    width: wp(21),
  },
  emailphoneView: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: hp(4),
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
    paddingBottom: hp(1.6),
    borderColor: "#659DEA",
    width: wp(88),
  },
  editimgStyle: {
    height: hp(4),
    width: wp(8),
    alignSelf: "flex-end",
    marginRight: hp(2),
  },
  valueColor: { color: "#CBBBDC" },
  nameText: {
    width: wp(30),
    marginLeft: wp(10),
    fontSize:16,
    color:"white",
    fontWeight:"bold"
  },
  walletCard: {
    width: wp(95),
    marginTop: hp(1.5),
    alignSelf: "center",
  },
  linearContainer: {
    marginTop: hp(1),
    padding: hp(2),
    borderWidth: StyleSheet.hairlineWidth * 1,
    paddingVertical: hp(4),
    borderRadius: hp(2),
    borderColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
    borderWidth:0.9
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
    fontWeight: "bold",
    fontSize:20,
    color:"#fff"
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
    color: "#fff",
    textAlign: "center",
    marginBottom:1
  },
  emailText: {
    color: "#fff",
  },
  accountText: {
    color: "#fff",
    fontSize: hp(2.3),
  },
  deleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(0),
    width: wp(85),
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
    borderBottomColor: "rgba(72, 93, 202, 1)rgba(67, 89, 205, 1)",
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  tableContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    alignSelf: "center",
    marginTop: hp(1),
  },
  statustext: {
    width: wp(20),
    color: "#fff",
  },
  amountText: {
    color: "#fff",
    width: wp(16),
    // textAlign:"center"
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
    fontSize: hp(1.5),
    margin: 5,
  },
  enableContainer: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    justifyContent: "space-evenly",
  },
  payoutText: {
    color: "#CBBBDC",
    fontSize: hp(1.5),
    margin: 5,
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
    // color: "#008C62",
        color: "#35CA1D",
  },
  readyText: {
    color: "#fff",
    fontSize: hp(2.3),
    textAlign: "center",
    marginVertical: hp(2),
  },
  KYC: {
    color: "#fff",
  },
  submitBtn: {
    backgroundColor: "#659DEA",
    // alignSelf: "flex-end",
    alignItems: "center",
    width: wp(20),
    paddingVertical: hp(0.7),
    borderRadius: hp(1),
    marginLeft: wp(30),
  },
  resend: {
    backgroundColor: "blue",
    width: wp(24),
    alignItems: "center",
    borderRadius: hp(1),
    padding: hp(1),
    marginTop: hp(1),
  },
  resend1:{
    backgroundColor: "blue",
    width: wp(20),
    alignItems: "center",
    borderRadius: hp(1),
    padding: hp(0.7),
    marginTop: hp(1),
  },
  headerContainer1_TOP: {
    backgroundColor: "#4CA6EA",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: wp(100),
    paddingHorizontal: wp(2),
  },
  logoImg_TOP: {
    height: hp("8"),
    width: wp("12"),
    marginLeft: wp(21.4),
  },
  text_TOP: {
    color: "white",
    fontSize:19,
    fontWeight:"bold",
    alignSelf: "center",
    // textAlign: "center",
    // marginStart:wp(34)
    marginStart:wp(34)
  },
  text1_ios_TOP: {
    color: "white",
    fontWeight: "700",
    alignSelf: "center",
    marginStart: wp(31),
    top:19,
    fontSize:17
  },
  modalContainer_option_top: {
    // flex: 1,
    alignSelf:"flex-end",
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width:"100%",
    height:"100%",
  },
  modalContainer_option_sub:{
    alignSelf:"flex-end",
    backgroundColor: 'rgba(33, 43, 83, 1)',
  padding: 10,
  borderRadius: 10,
  width:"65%",
  height:"70%"
},
modalContainer_option_view:{
  flexDirection:"row",
  marginTop:25,
  alignItems:"center",
},
modalContainer_option_text:{
fontSize:20,
fontWeight:"bold",
color:"gray",
marginStart:5
}
});
