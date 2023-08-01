import React, { useEffect } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Radio,
  Center,
  NativeBaseProvider,
  FormControl,
  Input,
  View,
} from "native-base";
import { useState } from "react";
import { FaucetDropdown } from "../reusables/faucetDropdown";
import { Linking } from "react-native";
import { faucets } from "../constants";

export const FaucetModal = ({ showModal, setShowModal }) => {
  const [network, setNetwork] = useState("");
  const [url,setUrl] = useState('')

  useEffect(()=>{
 //setShowModal(false);
 
if (network === "BSC") {
  setUrl(faucets.bscFaucet)
} else if (network === "Ethereum") {
  setUrl(faucets.ethFaucetGoerli)
} else if(network==='Matic') {
  setUrl(faucets.polygonFaucet)
}else{
  setUrl(' ')
}
  },[network])
  return (
    <Center>
      <Button
        onPress={() => setShowModal(true)}
        style={{ backgroundColor: "#145DA0" }}
      >
        Test Faucet
      </Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Select Faucet Network</Modal.Header>
          <Modal.Body>
            <FaucetDropdown network={network} setNetwork={setNetwork} />
            <View style={{display:'flex',alignContent:'center',alignItems:'center',marginTop:10}}>
              <Text selectable={true} style={{textAlign:'center'}}>{url?url:'please select a network'}</Text>
            </View>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  //setShowModal(false);
                  if (!network) {
                    setShowModal(false);

                    return alert("please select a network to proceed");
                  }
                  if (network === "BSC") {
                    setShowModal(false);

                    Linking.openURL(faucets.bscFaucet);
                  } else if (network === "Ethereum") {
                    setShowModal(false);

                    Linking.openURL(faucets.ethFaucetGoerli);
                  } else {
                    setShowModal(false);

                    Linking.openURL(faucets.polygonFaucet);
                  }
                }}
              >
                open
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
