// import AsyncStorageLib from "@react-native-async-storage/async-storage";
// import React from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useDispatch } from "react-redux";
// import { logout } from "./src/components/Redux/actions/auth";
// import { REACT_APP_LOCAL_TOKEN } from "./src/Dashboard/exchange/crypto-exchange-front-end-main/src/ExchangeConstants";

// const Settings = (props) => {
//   const dispatch = useDispatch();
//   return (
//     <View style={styles.container}>
//       <View style={styles.accountBox}>
//         <TouchableOpacity
//           onPress={() => {
//             props.navigation.navigate("AllWallets");
//           }}
//         >
//           <Text style={styles.text}>My Wallets</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("63"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.accountBox2}>
//         <TouchableOpacity
//           onPress={() => {
//             props.navigation.navigate("Transactions");
//           }}
//         >
//           <Text style={styles.text}>Transactions</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("65"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.accountBox2}>
//         <TouchableOpacity
//           onPress={async () => {
//             const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
//             const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
//             console.log(token);

//             if (token) {
//               props.navigation.navigate("exchange");
//             } else {
//               props.navigation.navigate("exchangeLogin");
//             }
//           }}
//         >
//           <Text style={styles.text}>Exchange</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("65"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.accountBox2}>
//         <TouchableOpacity
//           onPress={() => {
//             //alert("coming soon");
//             props.navigation.navigate("Biometric");

//           }}
//         >
//           <Text style={styles.text}>Biometric Authenticaton</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("65"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.accountBox2}>
//         <TouchableOpacity
//           onPress={() => {
//             //props.navigation.navigate('ImportWallet')
//             alert("coming soon");
//           }}
//         >
//           <Text style={styles.text}>Payment Methods</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("65"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.accountBox3}>
//         <TouchableOpacity
//           onPress={() => {
//             const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
//             // AsyncStorageLib.removeItem('user')
//             AsyncStorageLib.removeItem(LOCAL_TOKEN);
//             props.navigation.navigate("Passcode");
//             /* dispatch(logout()).then((res)=>{
//       }).catch((e)=>{
//         console.log(e)
//       })*/
//           }}
//         >
//           <Text style={styles.text}>Logout</Text>
//           <Icon
//             name="chevron-right"
//             size={hp("4")}
//             color="white"
//             style={{ marginLeft: wp("65"), marginTop: hp("-4") }}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Settings;
// const styles = StyleSheet.create({
//   container: {
//     display: "flex",
//     backgroundColor: "white",
//     height: hp("500"),
//     width: wp("100"),
//     alignContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     color: "white",
//     fontSize: hp("2.3"),
//     fontWeight: "bold",
//     fontFamily: "sans-serif",
//     fontStyle: "italic",
//     marginLeft: wp("10"),
//   },
//   accountBox: {
//     borderWidth: 5,
//     width: wp(95),
//     paddingTop: hp("2"),
//     borderRadius: 20,
//     borderColor: "#131E3A",
//     height: hp("9"),
//     marginTop: hp(7),
//     backgroundColor: "#000C66",
//     textAlign: "center",
//     display: "flex",
//     alignItems: "center",
//   },
//   accountBox2: {
//     borderWidth: 5,
//     paddingTop: hp("2"),
//     borderRadius: 20,
//     borderColor: "#131E3A",
//     height: hp("9"),
//     width: wp(95),
//     marginTop: 8,
//     backgroundColor: "#000C66",
//     textAlign: "center",
//     display: "flex",
//     alignItems: "center",
//   },
//   accountBox3: {
//     borderWidth: 5,
//     paddingTop: hp("2"),
//     borderRadius: 20,
//     borderColor: "#131E3A",
//     height: hp("9"),
//     marginLeft: 40,
//     marginRight: 40,
//     marginTop: 10,
//     backgroundColor: "#000C66",
//     textAlign: "center",
//     display: "flex",
//     alignItems: "center",
//   },
// });

import AsyncStorageLib from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import ToggleSwitch from "toggle-switch-react-native";
import { Switch } from "react-native-paper";
import { REACT_APP_LOCAL_TOKEN } from "./src/Dashboard/exchange/crypto-exchange-front-end-main/src/ExchangeConstants";
import Icon from "./src/icon";

const Settings = (props) => {
  const [Checked, setCheckBox] = useState(false);

  const dispatch = useDispatch();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.setHeading}>Settings</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("AllWallets");
        }}
        style={styles.accountBox}
      >
        <Icon
          name="wallet-outline"
          type={"materialCommunity"}
          size={hp(2)}
          color="black"
        />
        <Text style={styles.text}>Wallets</Text>
      </TouchableOpacity>
      <View style={styles.bottomBorder}>
        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("Transactions");
          // }}
          style={styles.accountBox1}
        >
          <View style={{flexDirection:"row",alignItems:"center"}}>

          <Icon name="moon-o" type={"fa"} size={hp(2)} color="black" />
          <Text style={styles.text}>Dark Mode</Text>
          </View>

          <ToggleSwitch
            isOn={Checked}
            onColor="green"
            offColor="gray"
            labelStyle={{ color: "black", fontWeight: "900" }}
            size="small"
            onToggle={() => {
              setCheckBox(!Checked);
            }}
            // onToggle={(isOff) => console.log("changed to : ", isOff)}
          />

          {/* <View style={styles.switchContainer}>
            <Switch            
              value={Checked}
              onValueChange={() => setCheckBox(!Checked)}
              style={styles.Switchbtn}
            />
          </View> */}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.accountBox}
        onPress={async () => {
          const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
          const token = await AsyncStorageLib.getItem(LOCAL_TOKEN);
          console.log(token);

          if (token) {
            props.navigation.navigate("exchange");
          } else {
            props.navigation.navigate("exchangeLogin");
          }
        }}
      >
        <Icon type={"fa"} name="exchange" size={hp(2)} color="black" />
        <Text style={styles.text}>Exchange</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          //alert("coming soon");
          // props.navigation.navigate("Biometric");
        }}
      >
        <Icon
          type={"material"}
          name="person-outline"
          size={hp(2)}
          color="black"
        />
        <Text style={styles.text}>Contacts</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          //alert("coming soon");
          props.navigation.navigate("Biometric");
        }}
      >
        <Icon type={"ionicon"} name="finger-print" size={hp(2)} color="black" />
        <Text style={styles.text}>Biometric Authenticaton</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          props.navigation.navigate("Transactions");
          //alert("coming soon");
        }}
      >
        <Icon type={"fa"} name="dollar" size={hp(2)} color="black" />
        <Text style={styles.text}>Transactions</Text>
      </TouchableOpacity>
      <View style={styles.bottomBorder}>
        <TouchableOpacity
          style={styles.accountBox}
          onPress={() => {
            const LOCAL_TOKEN = REACT_APP_LOCAL_TOKEN;
            //AsyncStorageLib.removeItem('user')
            AsyncStorageLib.removeItem(LOCAL_TOKEN);
            props.navigation.navigate("Passcode");
            /* dispatch(logout()).then((res)=>{
      }).catch((e)=>{
        console.log(e)
      })*/
          }}
        >
          <Icon name="chevron-right" size={hp(2)} color="black" />
          <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          //props.navigation.navigate('ImportWallet')
          // alert("coming soon");
        }}
      >
        <Icon type={"antDesign"} name="setting" size={hp(2)} color="black" />
        <Text style={styles.text}>Preference</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          //props.navigation.navigate('ImportWallet')
          // alert("coming soon");
        }}
      >
        <Icon
          type={"material"}
          name="lock-outline"
          size={hp(2)}
          color="black"
        />
        <Text style={styles.text}>Security</Text>
      </TouchableOpacity>
      <View style={styles.bottomBorder}>
        <TouchableOpacity
          style={styles.accountBox}
          onPress={() => {
            //props.navigation.navigate('ImportWallet')
            // alert("coming soon");
          }}
        >
          <Icon
            type={"materialCommunity"}
            name="bell-outline"
            size={hp(2)}
            color="black"
          />
          <Text style={styles.text}>Push Notification</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.accountBox}
        onPress={() => {
          //props.navigation.navigate('ImportWallet')
          // alert("coming soon");
        }}
      >
        <Icon type={"feather"} name="help-circle" size={hp(2)} color="black" />
        <Text style={styles.text}>Help Center</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#fff",
    // height: hp(100),
    width: wp(100),
    alignContent: "center",
    paddingBottom:100
  },
  setHeading: {
    fontSize: hp(2.5),
    marginHorizontal: wp(6),
    marginTop: hp(4),
  },
  text: {
    color: "black",
    fontSize: hp("2"),
    fontWeight: "600",
    fontFamily: "sans-serif",
    marginHorizontal: wp(3),
  },
  accountBox: {
    width: wp(95),
    flexDirection: "row",
    marginHorizontal: wp(6),
    borderRadius: 20,
    marginTop: hp(5),
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  accountBox1:{
    width: wp(90),
    flexDirection: "row",
    marginHorizontal: wp(6),
    justifyContent:"space-between",
    borderRadius: 20,
    marginTop: hp(5),
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingBottom: hp(3),
  },
  switchContainer: {
    marginHorizontal: hp(24),
    borderRadius: hp(20),
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#EBE8FC",
  },
  Switchbtn: {
    height: hp(4.5),
  },
});
