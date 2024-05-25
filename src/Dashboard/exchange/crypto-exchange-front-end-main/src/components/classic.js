import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Picker, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import Icon from "../../../../../icon";
import { FlatList } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Bridge from "../../../../../../assets/Bridge.png";

const classic = () => {
  const nav=useNavigation();
  const [chooseModalVisible, setChooseModalVisible] = useState(false);
  const [chooseSelectedItemId, setChooseSelectedItemId] = useState(null);
  const [chooseSelectedItemIdCho, setChooseSelectedItemIdCho] = useState(null);
  const [chooseSearchQuery, setChooseSearchQuery] = useState('');
  const [idIndex, setIdIndex] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [main_modal,setmain_modal]=useState(true);
  const [fianl_modal,setfianl_modal]=useState(false);
  const chooseItemList = [
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
  const chooseItemList_ETH = [
    { id: 1, name: "USDT", url: "https://example.com/usdt.png" }
  ];

  const handleUpdate = (id) => {
    if (idIndex === 1) {
      setChooseSelectedItemId(id);
      setmain_modal(true)
    } else if (idIndex === 3) {
      setChooseSelectedItemIdCho(id);
      setmain_modal(true)
    }
    setChooseModalVisible(false);
  };

  const chooseRenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUpdate(item.name)} style={styles.chooseItemContainer}>
      <Image style={styles.chooseItemImage} source={{ uri: item.url }} />
      <Text style={styles.chooseItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const chooseFilteredItemList = chooseItemList.filter(
    item => item.name.toLowerCase().includes(chooseSearchQuery.toLowerCase())
  );

  const handleNext = () => {
    setmain_modal(false)
    setConfirmModalVisible(true);
  };
  {
    fianl_modal===true&&setTimeout(()=>{
      nav.goBack()
    },1300)
  }

  return (
    <View style={{backgroundColor:"rgba(33, 43, 83, 1)rgba(28, 41, 77, 1)",flex:1,justifyContent:"center",alignItems:"center"}}>
      <Image source={Bridge}/>
      <Modal
        animationType="fade"
        transparent={true}
        visible={main_modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.textModal}>Choose blockchain and asset</Text>
              <Icon name={"close"} size={28} color={"white"} onPress={() => {nav.goBack()}} />
            </View>
            <Text style={styles.textModal}>From</Text>
            <TouchableOpacity style={styles.modalOpen} onPress={() => { setmain_modal(false),setChooseModalVisible(true); setIdIndex(1); }}>
              <Text>{chooseSelectedItemId === null ? "Select" : chooseSelectedItemId}</Text>
            </TouchableOpacity>
            <Text style={styles.textModal}>To</Text>
            <TouchableOpacity style={styles.modalOpen} onPress={() => { }}>
              <Text>Stellar</Text>
            </TouchableOpacity>
            <Text style={styles.textModal}>Choose asset</Text>
            <TouchableOpacity style={styles.modalOpen} onPress={() => { setmain_modal(false),setChooseModalVisible(true); setIdIndex(3); }}>
              <Text>{chooseSelectedItemIdCho === null ? "Select" : chooseSelectedItemIdCho}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.nextButton, { backgroundColor: chooseSelectedItemId && chooseSelectedItemIdCho ? 'green' : 'grey' }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.confirmModalContent} onPress={() => nav.goBack()}>
            <Text style={styles.confirmText}>Confirm Transaction</Text>
            <View style={styles.inputContainer}>
              <TextInput placeholder='Anchor id' placeholderTextColor="gray" style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder='Amount' placeholderTextColor="gray" keyboardType="number-pad" style={styles.input} />
            </View>  
            <TouchableOpacity style={styles.confirmButton} onPress={() =>{ setConfirmModalVisible(false),setfianl_modal(true)}}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>   
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
      animationType="fade"
      transparent={true}
      visible={fianl_modal}>
       
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
      <Text style={{fontSize:20,fontWeight:"bold",marginTop:10}} onPress={()=>{nav.goBack()}}>Transaction Success</Text>
      </View>
      </View>
    </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={chooseModalVisible}
      >
        <TouchableOpacity style={styles.chooseModalContainer} onPress={() => nav.goBack()}>
          <View style={styles.chooseModalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={"gray"}
              onChangeText={text => setChooseSearchQuery(text)}
              value={chooseSearchQuery}
              autoCapitalize='none'
            />
            <FlatList
              data={chooseSelectedItemId === "Ethereum" ? chooseItemList_ETH : chooseFilteredItemList}
              renderItem={chooseRenderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(33, 43, 83, 1)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textModal: {
    marginTop: 10,
    color: "#fff",
    fontSize: 19,
  },
  modalOpen: {
    width: '90%',
    height: '10%',
    backgroundColor: '#ededeb',
    justifyContent: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  nextButton: {
    width: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    alignSelf:"center"
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmModalContent: {
    backgroundColor: 'rgba(33, 43, 83, 1)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    width: '90%',
    borderRadius: 19,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 19,
    padding: 10,
    backgroundColor: '#ededeb',
  },
  input: {
    backgroundColor: '#ededeb',
  },
  confirmButton: {
    width: '50%',
    borderRadius: 19,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 19,
    padding: 10,
    backgroundColor: 'green',
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
  },
  chooseModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chooseModalContent: {
    backgroundColor: 'rgba(33, 43, 83, 1)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  chooseItemContainer: {
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(28, 41, 77, 1)',
    borderWidth: 0.9,
    borderBottomColor: '#fff',
    marginBottom: 4,
  },
  chooseItemImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginVertical: 3,
  },
  chooseItemText: {
    marginLeft: 10,
    fontSize: 19,
    color: '#fff',
  },
});
export default classic;