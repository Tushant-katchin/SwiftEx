
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Payment = () => {
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
