import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Picker, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import Icon from "../../../../../icon";
import { FlatList } from 'native-base';
const classic = ({ visible }) => {
  ///////////////////////////////////////
  const [visible_fist,setvisible]=useState(visible);
  const [input_modal,setinput_modal]=useState(false);
  const [con_modal,setcon_modal]=useState(false);

  const [choose_modalVisible, setchoose_ModalVisible] = useState(false);
  const [choose_selectedItemId, setchoose_SelectedItemId] = useState(null);
  const [choose_selectedItemIdsecnd, setchoose_SelectedItemIdsecnd] = useState(null);
  const [choose_selectedItemIdcho, setchoose_selectedItemIdcho] = useState(null);
  const [choose_searchQuery, setchoose_SearchQuery] = useState('');
  const [id_index,setid_index]=useState(null);


  const choose_itemList = [
    { id: 1, name: "Bitcoin",url:"https://tokens.pancakeswap.finance/images/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png" },
    { id: 2, name: "Ethereum",url:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" },
    { id: 3, name: "Aave",url:"https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110" },
    { id: 4, name: "Alchemy Pay",url:"https://assets.coingecko.com/coins/images/12390/thumb/ACH_%281%29.png?1599691266" },
    { id: 5, name: "Ambire AdEx",url:"https://assets.coingecko.com/coins/images/847/thumb/Ambire_AdEx_Symbol_color.png?1655432540" },
    { id: 6, name: "Aergo",url:"https://assets.coingecko.com/coins/images/4490/thumb/aergo.png?1647696770" },
    { id: 7, name: "Alchemix",url:"https://assets.coingecko.com/coins/images/14113/thumb/Alchemix.png?1614409874" },
    { id: 8, name: "ApeCoin",url:"https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455" },
    { id: 9, name: "AirSwap",url:"https://assets.coingecko.com/coins/images/1019/thumb/Airswap.png?1630903484" }
]


const choose_itemList_ETH = [
  { id: 1, name: "Ethereum",url:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" },
  { id: 2, name: "USDC",url:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
]

  useEffect(()=>{
   setinput_modal(false)
   setchoose_SearchQuery('')
  },[])
  const confim_handle = () => {
    setinput_modal(false);
    setcon_modal(true);
    setTimeout(() => {
      setcon_modal(false);
    }, 1000);
  };


  const choose_renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {handleupdate(item.name)}} style={{marginVertical:3,flexDirection:"row",alignContent:"center",borderColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",borderWidth:0.9,borderBottomColor:"#fff",marginBottom:4}}>
<Image
  style={{
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginTop:3,
    marginBottom:3
  }}
  source={{
    uri: item.url,
  }}
/>
      <Text style={{marginLeft:10,fontSize:19,color:"#fff",}}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleupdate=async(id)=>{
    if(id_index===1)
    {
      setchoose_SelectedItemId(id);
      setchoose_ModalVisible(false);
      setvisible(true)
      setid_index(null);
    }
    if(id_index===2)
    {
      setchoose_SelectedItemIdsecnd(id);
      setchoose_ModalVisible(false);
      setvisible(true)
      setid_index(null);
    }
    if(id_index===3)
    {
      setchoose_selectedItemIdcho(id);
      setchoose_ModalVisible(false);
      setvisible(true)
      setid_index(null);
    }

  }
  const choose_filteredItemList = choose_itemList.filter(
    (item) =>
      item.name.toLowerCase().includes(choose_searchQuery.toLowerCase())
  );
  return (
    <View>
     
      <Modal
      animationType="fade"
      transparent={true}
      visible={visible_fist}
      // visible={true}

      onRequestClose={() => {}}>
      <TouchableOpacity style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection:"row",alignContent:"center",justifyContent:"space-between"}}>
          <Text style={styles.text_modal}>Choose blockchain and asset</Text>
          <Icon
              name={"close"}
              type={"antDesign"}
              size={28}
              color={"white"}
              onPress={()=>{setvisible(false)}}
            />
          </View>
            <Text style={styles.text_modal} >From</Text>
            <TouchableOpacity style={[styles.modal_open,{backgroundColor:"#ededeb"}]} onPress={()=>{setvisible(false),setchoose_ModalVisible(true),setid_index(1)}}>
              <Text>{choose_selectedItemId===null?"Select":choose_selectedItemId}</Text>
            </TouchableOpacity>

            <Text style={styles.text_modal}>To</Text>
            {/* <TouchableOpacity style={styles.modal_open} onPress={()=>{setvisible(false),setchoose_ModalVisible(true),setid_index(2)}}> */}
            <TouchableOpacity style={[styles.modal_open,{backgroundColor:"#ededeb"}]} onPress={()=>{}}>
              {/* <Text>{choose_selectedItemIdsecnd===null?"Select":choose_selectedItemIdsecnd}</Text> */}
              <Text>Stellar</Text>

            </TouchableOpacity>
            <Text style={styles.text_modal}>Choose asset</Text>
            <TouchableOpacity style={[styles.modal_open,{backgroundColor:"#ededeb"}]} onPress={()=>{setvisible(false),setchoose_ModalVisible(true),setid_index(3)}}>
              <Text>{choose_selectedItemIdcho===null?"Select":choose_selectedItemIdcho}</Text>
            </TouchableOpacity>
          {/* <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>{loadingText}</Text> */}
          <TouchableOpacity disabled={choose_selectedItemId === null && choose_selectedItemIdcho === null} onPress={()=>{
            if(choose_selectedItemId!==null&&choose_selectedItemIdcho!==null)
            {
              setvisible(false),setinput_modal(true)
            }
          }} style={{alignSelf:"center"}}>
          <Text style={[styles.loadingText,{backgroundColor:"green",color:"#fff"}]}>Next</Text> 
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
    <Modal
      animationType="fade"
      transparent={true}
      visible={input_modal}>
      <View style={styles.modalContainer}> 
      <TouchableOpacity style={{ backgroundColor: 'rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width:"90%",
    height:"35%"}} onPress={()=>{setinput_modal(false)}}>
      <Text style={{fontSize:20,fontWeight:"bold",color:"#fff"}}>Confirme Transaction</Text>
      <View style={{width:"90%",borderRadius:19,borderColor:"gray",borderWidth:1,justifyContent:"center",marginTop:21,padding:10,backgroundColor:"#ededeb"}}>
      <TextInput placeholder='Anchor id' placeholderTextColor={"gray"} style={{backgroundColor:"#ededeb"}}/>
      </View>
      <View style={{width:"90%",borderRadius:19,borderColor:"gray",borderWidth:1,justifyContent:"center",marginTop:19,padding:10,backgroundColor:"#ededeb"}}>
      <TextInput placeholder='Amount' placeholderTextColor={"gray"} keyboardType="number-pad" style={{backgroundColor:"#ededeb"}}/>
      </View>  
      <TouchableOpacity style={{width:"50%",borderRadius:19,borderColor:"gray",borderWidth:1,justifyContent:"center",marginTop:19,padding:10,backgroundColor:"green"}} onPress={()=>{confim_handle()}}>
        <Text style={{textAlign:"center",color:"#fff"}}>Confirme</Text>
      </TouchableOpacity>   
      </TouchableOpacity>
      </View>
    </Modal>

    <Modal
      animationType="fade"
      transparent={true}
      visible={con_modal}>
      <View style={styles.modalContainer}> 
      <View style={{ backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width:"90%",
    height:"20%",
    justifyContent:"center"}}>
      <Icon
        name={"check-circle-outline"}
        type={"materialCommunity"}
        size={60}
        color={"green"}
      />
      <Text style={{fontSize:20,fontWeight:"bold",marginTop:10}} onPress={()=>{setcon_modal(false)}}>Transaction Success</Text>
      </View>
      </View>
    </Modal>

    {/* choose modal */}
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={choose_modalVisible}
      >
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={()=>{setchoose_ModalVisible(false)}}>
          <View style={{ backgroundColor: 'rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
              placeholder="Search..."
              onChangeText={(text) => setchoose_SearchQuery(text)}
              value={choose_searchQuery}
              autoCapitalize='none'
            />
            <FlatList
              data={choose_selectedItemId==="Ethereum"?choose_itemList_ETH:choose_filteredItemList}
              renderItem={choose_renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* {choose_selectedItemId && <Text>Selected Item ID: {choose_selectedItemId}</Text>} */}
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)',
    padding: 20,
    borderRadius: 10,
    // alignItems: 'center',
    width:"90%",
    // height:"50%"

  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    marginTop:-90
  },
  loadingText: {
    marginTop: 19,
    fontSize: 16,
    fontWeight: 'bold',
    width:"50%",
    paddingVertical:10,
    paddingHorizontal:50,
    borderRadius:10
  },
  text_modal:{
    marginTop:10,
    color:"#fff",
    fontSize:19,
    
  },
  modal_open:{
    width:"90%",
    height:"10%",
    backgroundColor:"gray",
    justifyContent:"center",
    borderRadius:10,
    paddingLeft:10,
    marginTop:10
  }
});
export default classic;