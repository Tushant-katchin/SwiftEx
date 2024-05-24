import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeView } from "./pages/home";
import { ProfileView } from "./pages/profile";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { OfferView } from "./pages/offers";
import { TransactionsListView } from "./pages/transaction";
import { AccountView } from "./pages/account";
import { TransactionView } from "./pages/transaction";
import { ExchangeHeader, ExchangeHeaderIcon } from "../../../header";
import Payout from "./pages/payout";
import AddFunds_screen from "./components/AddFunds_screen";
const Tab = createBottomTabNavigator();

export function ExchangeNavigation() {
  return (
    <Tab.Navigator
      // initialRouteName="/"
      activeColor="#f0edf6"
      // inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "#fff" }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 27;
          if (route.name === "/") {
            iconName = focused ? "ios-home-sharp" : "ios-home-sharp";
            iconName = "ios-home-sharp";
          }
          if (route.name === "Deposits") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "card-outline";
          }
          if (route.name === "profile") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "person-circle";
          }
          if (route.name === "offers") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "briefcase";
          }
          if (route.name === "Transactions") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "card-sharp";
          }
          if (route.name === "Withdrawal") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "receipt";
          }
          if (route.name === "Profile") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "wallet";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          // position: "absolute",
          backgroundColor: "white",
          height: hp(9),
          backgroundColor: "#4CA6EA",
        },
        headerTitleAlign: "center",


      })}
    >
      <Tab.Screen
        name="/"
        component={HomeView}
        options={{
          tabBarLabel: "Home",
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
        }}
      />
       <Tab.Screen
        name="Deposits"
        component={AddFunds_screen}
        options={{
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
        }}
      />
      <Tab.Screen
        name="offers"
        component={OfferView}
        options={{
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionView}
        options={{
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
          //Tab bar styles can be added here
        }}
      />

      <Tab.Screen
        name="Withdrawal"
        component={Payout}
        options={{
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          headerShown: true,
          header: () => {
            // return <ExchangeHeaderIcon />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
