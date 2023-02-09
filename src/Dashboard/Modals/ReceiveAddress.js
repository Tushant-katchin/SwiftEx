import React,{useRef, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Animated} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Avatar,  Card, Title, Paragraph, CardItem, WebView } from 'react-native-paper';
import Bnbimage from '../../../assets/bnb-icon2_2x.png'
import Etherimage from '../../../assets/ethereum.png'
import maticImage from '../../../assets/matic.png'
import titleIcon from '../../../assets/title_icon.png'
import Modal from "react-native-modal";
import QRCode from 'react-native-qrcode-svg';
import "@ethersproject/shims"
import { ethers } from "ethers"
//'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
const RecieveAddress = ({ modalVisible, setModalVisible, iconType}) => {

    const[BscWallet, setBscWalletVisible] = useState(false)
    const[EthereumWallet,setEthereumWallet] = useState(false)
    const WalletAddress =  useSelector((state) =>   state.wallet.address)
    const [selected,setSelected] = useState(false)
    const [selected1,setSelected1] = useState(false)
    const [selected2,setSelected2] = useState(false)
    const [qrvalue, setQrvalue] = useState('');
    const [leftContent,setLeftContent] = useState()
    const dispatch = useDispatch();

    let EtherLeftContent = props => <Avatar.Image {...props} source={  Etherimage} size={50}/>
    let BnbLeftContent = props => <Avatar.Image {...props} source={  Bnbimage} size={50}/>
    let maticLeftContent = props => <Avatar.Image {...props} source={  maticImage} size={50}/>
   //iconType==='BNB'?BnbLeftContent:iconType==='ETH'?EtherLeftContent:maticLeftContent

    const fadeAnim = useRef(new Animated.Value(0)).current

   const check = async () =>{
var url = "wss://goerli-light.eth.linkpool.io/ws";


var customWsProvider = new ethers.providers.WebSocketProvider(url);
  
customWsProvider.on("pending", (tx) => {
  customWsProvider.getTransaction(tx).then(function (transaction) {
    console.log(transaction);
  });
});

customWsProvider._websocket.on("error", async () => {
  console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
  setTimeout(init, 3000);
});
customWsProvider._websocket.on("close", async (code) => {
  console.log(
    `Connection lost with code ${code}! Attempting reconnect in 3s...`
  );
  customWsProvider._websocket.terminate();
  setTimeout(init, 3000);
})
  

   }

    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();

       
      }, [fadeAnim])


      useEffect(async () => {

        if(WalletAddress){
          setQrvalue(WalletAddress)
        }
       //  await check()
       
      }, [])
      

  return (
    
    <Animated.View                 // Special animatable View
      style={{opacity:fadeAnim}}
    >
        <Modal
    animationIn="slideInLeft"
  animationOut="slideOutRight"
  animationInTiming={500}
  animationOutTiming={650}
  isVisible={modalVisible}
  useNativeDriver={true}
  statusBarTranslucent={true}
 onBackdropPress={()=>setModalVisible(false)}
  onBackButtonPress={() => {
      
      setModalVisible(false)
  }}>
      <View style={style.Body}>

  
  <TouchableOpacity style={style.Box3} onPress={()=>{
   
  }}>  
        <Card  style={{width:wp(90), height:hp(70), backgroundColor:'white', borderRadius:10}}>
<Card.Title titleStyle={{ color: "black" }}  title={iconType}  left={iconType==='BNB'?BnbLeftContent:iconType==='ETH'?EtherLeftContent:maticLeftContent}  />
<Card.Content style={{display:'flex',flexDirection:'row',color:'#fff'}}>
<Title style={{color:'#fff'}}></Title>
</Card.Content>
</Card>
  
  </TouchableOpacity>
  
  <QRCode
          //QR code value
          value={qrvalue ? qrvalue : 'NA'}
          //size of QR Code
          size={250}
          //Color of the QR Code (Optional)
          color="black"
          //Background Color of the QR Code (Optional)
          backgroundColor="white"
          //Logo of in the center of QR Code (Optional)
          logo={{
            url:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
          }}
          //Center Logo size  (Optional)
          logoSize={30}
          //Center Logo margin (Optional)
          logoMargin={2}
          //Center Logo radius (Optional)
          logoBorderRadius={15}
          //Center Logo background (Optional)
          logoBackgroundColor="yellow"
        />
  <Text style={{marginTop:hp(3)}}>Address: {WalletAddress?WalletAddress:''}</Text>
  <View style={style.Button}>
    <TouchableOpacity style={{width:wp(14),height:hp(7),backgroundColor:selected?'green':'#D4F1F4', marginTop:10, borderRadius:20,marginLeft:wp(-5),margin:10}} onPress={()=>{
        setSelected(true)
        setSelected1(false)
    }}>
        <View style={{alignItems:'center',alignContent:'center',marginTop:12}}>
        <Text style={{color:selected?'white':'black'}}>Copy</Text>
        </View>
    </TouchableOpacity>
    <TouchableOpacity style={{width:wp(14),height:hp(7),backgroundColor:selected1?'green':'#D4F1F4', marginTop:10, borderRadius:20,margin:10}} onPress={()=>{
        setSelected1(true)
        setSelected(false)
    }}>
        <View style={{alignItems:'center',alignContent:'center',marginTop:12}}>
        <Text style={{color:selected1?'white':'black'}}>Share</Text>
        </View>
    </TouchableOpacity>
    </View>
        </View>
        
        </Modal>
        </Animated.View>
  )
}

export default RecieveAddress

const style = StyleSheet.create({
    Body:{
        display:'flex',
        backgroundColor:'white',
        height:hp(83),
        width:wp(90),
        alignItems:'center',
        textAlign:'center',
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        borderBottomEndRadius:10,
        borderBottomLeftRadius:10,
        zIndex:100
        
    },
    welcomeText:{
        fontSize:20,
        fontWeight:'200',
        color:'black',
        marginTop:hp(5)
    },
    welcomeText2:{
        fontSize:15,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1)
    },
    Button:{
        marginTop:hp(10),
        width:wp(20),
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        justifyContent:"space-between"
    },
    tinyLogo: {
        width: wp('5'),
        height: hp('5'),
        padding:30,
        marginTop:hp(10)
      },
      Text:{
        marginTop:hp(5),
        fontSize:15,
        fontWeight:'200',
        color:'white',
      },
      input: {
        height: hp('5%'),
        marginBottom: hp('2'),
        color:'black',
        marginTop:hp('2'),
        width:wp('70'),
        paddingRight:wp('7'),
        backgroundColor:'white',
        
      },
      Box:{
        height: hp('15%'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white'
      },
      Box2:{
        height: hp('15%'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(1),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white',
      },
      Box3:{
        height: hp('15%'),
        width:wp('75'),
        fontSize:20,
        fontWeight:'200',
        color:'white',
        marginTop:hp(2),
        display:'flex', 
        alignItems:'center', 
        alignContent:'center',
        backgroundColor:'white',
        borderTopWidth:1
      }
      
})