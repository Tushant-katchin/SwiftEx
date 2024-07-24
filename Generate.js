import { useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
// const YOUR_WYRE_API_KEY = "TEST-AK-N9EEWWLD-X2RDAMBG-3PRVGN9Q-RT8PA37X";
// const YOUR_WYRE_SECRET_KEY = "TEST-SK-LD2CJA4U-GQMQ3J4F-NLBVE8QP-FZL4WRRY";
//TEST-AK-Q9FG94D6-GCHZ4EVP-UD7QURJM-ENDGATVZ
//TEST-SK-VUUR9TMN-BYN4LM8R-RJ424LXR-8X92ZYXA

export default function Generate() {
  const [url, setUrl] = useState("https://www.moonpay.com/buy");
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      {loading&&<ActivityIndicator size="large" color={"blue"} />}
       <WebView
       source={{ uri: url }}
       onLoad={() => setLoading(true)}
       onLoadEnd={() => setLoading(false)}
     />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    height: 10,
  },
  content: {
    padding: 40,
  },
  list: {
    marginTop: 30,
  },
});
