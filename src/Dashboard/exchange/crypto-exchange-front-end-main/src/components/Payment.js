
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const Payment = () => {
  // alert("Use 4242 4242 4242 4242 Card Number for Payment");
  Alert.alert("Card Info","Use this 4242 4242 4242 4242 Card Number Test for Payments")
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://buy.stripe.com/test_eVag2k8fHcwVg7eeUW' }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Payment;
