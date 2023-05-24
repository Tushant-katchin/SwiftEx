import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { Text, View } from "native-base"
import { useEffect, useState } from "react"
import { Switch } from "react-native-paper"
import { heightPercentageToDP } from "react-native-responsive-screen"
import { getBiometrics, turnOffBiometrics } from "../biometrics/biometric"
import { useFocusEffect } from "@react-navigation/native";

export default function BiometricPage()
{
    const [Checked, setCheckBox] = useState(false)

    function checkBiometric(Checked){
      if(!Checked){
        getBiometrics()
        }
        else{
          turnOffBiometrics()
        }
    }

  useEffect(()=>{
    AsyncStorageLib.getItem('Biometric')
    .then((response)=>{
      console.log(response)
      if(response==='SET'){
        setCheckBox(true)
      }
    })
  },[])

  

    return(
        <View style={{backgroundColor:'white', height:heightPercentageToDP(100)}}>
            <View style={{  display:'flex', flexDirection:'row', justifyContent:'space-evenly', marginTop:50}}>
             <View>
            <Text style={{fontSize:17}}>Enable Biometric Authentication</Text>
            </View>   
            <Switch
              value={Checked}
              onValueChange={() => {
                setCheckBox(!Checked)
                checkBiometric(Checked)
            }}
            />
          </View>
        </View>
    )
}
