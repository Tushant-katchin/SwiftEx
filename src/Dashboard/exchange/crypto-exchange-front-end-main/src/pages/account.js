import { Button, Linking, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { authRequest, GET, POST } from "../api";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { DataTable } from "react-native-paper";

const ExternalAccountsListView = ({ externalAccounts }) => {
  return (
    <>
      <Text>External Accounts</Text>
      <DataTable style={styles.container}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title style={{ fontWeight: 600 }}>
            Bank Name
          </DataTable.Title>
          <DataTable.Title style={{ fontWeight: 600 }}>
            Bank Holder Name
          </DataTable.Title>
          <DataTable.Title style={{ fontWeight: 600 }}>
            Payout Metods
          </DataTable.Title>
          <DataTable.Title style={{ fontWeight: 600 }}>Country</DataTable.Title>
          <DataTable.Title style={{ fontWeight: 600 }}>
            Currency
          </DataTable.Title>
        </DataTable.Header>
        {externalAccounts.length ? (
          <>
            {externalAccounts.map((accounts) => {
             let account = JSON.parse(JSON.stringify(accounts))
              return(
                <View style={{ width: wp(100),
                  height: hp(80),
                  color: "black"}}>

                <DataTable.Row key={account.id}>
                <DataTable.Cell>{account.bank_name}</DataTable.Cell>
                <DataTable.Cell>{account.account_holder_name}</DataTable.Cell>
                <DataTable.Cell>
                  {account.available_payout_methods[0]}
                </DataTable.Cell>
                <DataTable.Cell>{account.country}</DataTable.Cell>
                <DataTable.Cell>{account.currency}</DataTable.Cell>
              </DataTable.Row>
                </View>
                )
})}
          </>
        ) : (
          <DataTable.Row>
            <DataTable.Cell>No accounts here</DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>
    </>
  );
};

export const AccountView = (props) => {
  const [message, setMessage] = useState();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [connectLink, setConnectLink] = useState(null);
  const [user, setUser] = useState(null);
  const [hasExternalAccount, setHasExternalAccount] = useState(false);

  useEffect(() => {
    getUserDetails();
    getAccountDetails();
  }, []);

  const getAccountDetails = async () => {
    try {
      const { res, err } = await authRequest("/users/getStripeAccount", GET);
      if (err) return setMessage(` ${err.message}`);
      if (res.external_accounts.data.length) setHasExternalAccount(true);
      setAccount(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const { res, err } = await authRequest("/users/getUserDetails", GET);
      if (err) return setMessage(`${err.message}`);
      setUser(res);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    try {
      setIsCreatingAccount(true);
      const { res, err } = await authRequest(
        "/users/createStripeAccount",
        POST
      );
      if (err) return setMessage(`${err.status}: ${err.message}`);
      setConnectLink(res.connectLink);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text>My Account</Text>
        <Text>{message}</Text>
        {connectLink ? (
          <View>
            <Text style={{ color: "black" }}>
              Congradualtions! account was created successfully please use the
              link below to connect your bank account to your stripe account
            </Text>
            <Text
              style={{ color: "blue" }}
              onPress={() => Linking.openURL(connectLink)}
            >
              {connectLink}
            </Text>
          </View>
        ) : (
          <Text></Text>
        )}
        <View>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {account ? (
                <View>
                  {hasExternalAccount ? (
                    <>
                      <View>
                        <Text>Charges Enabled:</Text>
                        <Text>{account.charges_enabled ? "Yes" : "No"}</Text>
                        <Text>Payouts Enabled:</Text>
                        <Text>{account.payouts_enabled ? "Yes" : "No"}</Text>
                      </View>
                      <ExternalAccountsListView
                        externalAccounts={account.external_accounts.data}
                      />
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          marginTop: 10,
                          display: "flex",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ marginTop: 10 }}>
                          <Text>
                            Your account is not connected to an actual bank
                            account please click below to get a connection link.
                          </Text>
                        </View>
                        <View style={{ marginTop: 10, width: wp(50) }}>
                          <Button
                            title="get Connect link"
                            color={"blue"}
                            onPress={() => createAccount()}
                          ></Button>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ) : (
                <View>
                  <Button
                    title="create account"
                    color={"blue"}
                    onPress={() => createAccount()}
                  ></Button>
                </View>
              )}
            </>
          )}
        </View>
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
    width: wp(100),
    height: hp(100),
  },
  scrollView: {
    width: wp(90),
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
  },
  table: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  content: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: hp(100),
  },
});
/*
loading={isCreatingAccount}
                        onClick={createAccount}
                        variant="outlined"
*/
