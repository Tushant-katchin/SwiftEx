import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeView } from "./pages/home";
import { ProfileView } from "./pages/profile";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { OfferView } from "./pages/offers";
import { TransactionView } from "./pages/transaction";
import { AccountView } from "./pages/account";

const Tab = createBottomTabNavigator();

export function ExchangeNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="/"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "white" }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 33;
          if (route.name === "/") {
            iconName = focused ? "ios-home-sharp" : "ios-home-sharp";
            iconName = "ios-home-sharp";
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
          if (route.name === "account") {
            iconName = focused ? "ios-home-sharp" : "ios-home-outline";
            iconName = "wallet";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "white",
          height: heightPercentageToDP("12"),
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopColor: "black",
          borderTopWidth: 1,
        },
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="/"
        component={HomeView}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="offers"
        component={OfferView}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionView}
        options={{
          headerShown: false,
          //Tab bar styles can be added here
        }}
      />
      <Tab.Screen
        name="account"
        component={AccountView}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileView}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
