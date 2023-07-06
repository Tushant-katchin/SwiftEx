import React from "react";
import { Button, Modal, VStack, HStack, Text, Radio, Center, NativeBaseProvider, FormControl, Input } from "native-base";
import { useState } from "react";
import { FaucetDropdown } from "../reusables/faucetDropdown";
import { Linking } from "react-native";
import { faucets } from "../constants";
import { ShowToast } from "../reusables/Toasts";

export  const FaucetModal = ({showModal,setShowModal}) => {
    const [network, setNetwork] = useState('')
  return <Center>
      <Button onPress={() => setShowModal(true)}>Button</Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Select Faucet Network</Modal.Header>
          <Modal.Body>
           <FaucetDropdown network={network} setNetwork={setNetwork}/>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
              <Button onPress={() => {
              //setShowModal(false);
              if(!network)
              {
                return  alert('please select a network to proceed')
                
              }
              if(network==='BSC')
              {
                  
                  Linking.openURL(faucets.bscFaucet)
              }else if(network==='Ethereum')
              {
                Linking.openURL(faucets.ethFaucetGoerli)

              }else{
                Linking.openURL(faucets.polygonFaucet)

              }
            }}>
                open
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      </Center>;
};

    