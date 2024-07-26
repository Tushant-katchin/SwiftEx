import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Button, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import ReactNativePinView from 'react-native-pin-view';
import { alert } from './reusables/Toasts';
import Icon from '../icon';
import darkBlue from '../../assets/darkBlue.png';
const PinModal = ({ onPinComplete, onClose }) => {
    const [pin, setPin] = useState('');
    const pinViewRef = useRef(null);

    useEffect(async () => {
        if (pin.length === 6) {
            await passcode_check()
        }
    }, [pin]);

    const passcode_check = async () => {
        const Pin = await AsyncStorageLib.getItem("pin");
        if (JSON.parse(Pin) === pin) {
            onComplete(pin)
        } else {
            pinViewRef.current.clearAll();
           setTimeout(()=>{
            alert("error", "Incorrect Pin try again.");
           },300)
        }
    }

    const onComplete = (enteredPin) => {
        setPin(enteredPin);
        onPinComplete(enteredPin);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            animationIn="slideInRight"
            animationOut="slideOutRight"
            animationInTiming={200}
            animationOutTiming={200}
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { onClose() }} style={{ alignSelf: "flex-end", marginTop: -20, marginRight: -19 }}>
                        <Icon
                            name={"close"}
                            type={"materialCommunity"}
                            size={30}
                            color={"#fff"}
                        />
                    </TouchableOpacity>
                    <View>
                        <Image style={{
                            width: 40,
                            height: 30,
                            padding: 40,
                            marginTop: 2,
                        }}
                            source={darkBlue} />
                    </View>
                    <ReactNativePinView
                        ref={pinViewRef}
                        pinLength={6}
                        buttonTextColor="#FFF"
                        buttonBgColor="#000"
                        inputBgColor="#FFF"
                        inputActiveBgColor="#F00"
                        style={styles.pinView}
                        onValueChange={(value) => { setPin(value) }}
                        inputViewFilledStyle={{
                            backgroundColor: "#fff",
                            width: 25,
                            height: 25
                        }}
                        inputViewEmptyStyle={{
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor: "#fff",
                            width: 25,
                            height: 25
                        }}
                        onButtonPress={async (key) => {
                            if (key ===  "custom_right") {
                              pinViewRef.current.clear();
                            }}}
                            customRightButton={
                                pin.length!=0 ? (
                                  <Icon type={"materialCommunity"} name={"backspace"} size={25} color={"gray"} />
                                ) : undefined
                              }
                    />
                    <View style={styles.textView}>
                        <Text style={styles.simpleText}>Passcode adds an extra layer of security</Text>
                        <Text style={styles.simpleText}>when using the app</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#011434',
        borderRadius: 10,
        alignItems: 'center',
    },
    pinView: {
        width: '100%',
        marginBottom: 20,
    },
    textView: {
        marginTop: "1%"
    },
    simpleText: {
        textAlign: "center",
        color: "#fff"
    }
});

export default PinModal;
