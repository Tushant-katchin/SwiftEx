



import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';


const YOUR_WYRE_API_KEY = 'TEST-AK-N9EEWWLD-X2RDAMBG-3PRVGN9Q-RT8PA37X';
const YOUR_WYRE_SECRET_KEY = 'TEST-SK-LD2CJA4U-GQMQ3J4F-NLBVE8QP-FZL4WRRY';
//TEST-AK-Q9FG94D6-GCHZ4EVP-UD7QURJM-ENDGATVZ
//TEST-SK-VUUR9TMN-BYN4LM8R-RJ424LXR-8X92ZYXA

export default function Generate() {
  const [url,setUrl]=useState('')
  async function getUrl(){
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer TEST-SK-VUUR9TMN-BYN4LM8R-RJ424LXR-8X92ZYXA'
      },
      body: JSON.stringify({referrerAccountId: 'AC_VGE3AD4TD2X'})
    };
    
    fetch('https://api.testwyre.com/v3/orders/reserve', options)
      .then(response => response.json())
      .then(response =>{ 
        console.log(response)
       console.log(response.url)
       setUrl(response.url)
      })
      .catch(err => console.error(err));
    
  }
  useEffect(() => {
  getUrl()
  }, [])
  

  return (
    
   
    <View style={styles.container}>
    <WebView
    
    originWhitelist={['*']}
    source={{
    uri: url
  }}
      />
         
      </View>
  );
    }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:50,
    height:10,
  },
 content:{
padding:40,
 },
 list:{
marginTop:30,
 }
});
