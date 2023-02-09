import AsyncStorage from "@react-native-async-storage/async-storage";
import {  utils } from "ethers"
import { Network, Alchemy } from 'alchemy-sdk';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { EthereumSecret, PolygonSecret } from '../constants';
import { getNonce, getGasPrice } from '../../utilities/utilities';
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values"
import "@ethersproject/shims"
var ethers = require('ethers');

const xrpl = require("xrpl")
const sendEth = async (privateKey,amount,addressTo,addressFrom, navigation) =>{
  let alchemyProvider

  const settings = {
    apiKey: EthereumSecret.apiKey,
    network: Network.ETH_GOERLI,
};

 alchemyProvider = new Alchemy(settings); 
  const  walletPrivateKey = new ethers.Wallet(privateKey)
 

  const nonce = await alchemyProvider.core.getTransactionCount(
    walletPrivateKey.address,
    "latest"
  );
  const maxFee = await alchemyProvider.core.getFeeData(walletPrivateKey.address)
  console.log(maxFee)
  let transaction = {
    to: addressTo,
    value: utils.parseEther(amount),
    gasLimit: 21000,
    maxPriorityFeePerGas: maxFee.maxPriorityFeePerGas,
    maxFeePerGas: maxFee.maxFeePerGas,
    nonce: nonce,
    type: 2,
    chainId: 5,
  };
  console.log(transaction)

  let rawTransaction = await walletPrivateKey.signTransaction(transaction);
  const info = {
    type:'Eth',
    fee:maxFee.maxPriorityFeePerGas,
    rawTransaction:rawTransaction,
    addressTo:addressTo,
    addressFrom:addressFrom,
    amount:amount,
    provider:alchemyProvider
  }
  return info

}

const sendBNB = async (privateKey,amount,addressTo,addressFrom, navigation) =>{
 let provider = new ethers.providers.JsonRpcProvider('https://bsc.getblock.io/a011daa0-3099-4f55-b22c-c3a3d55898d0/testnet/')
 //console.log(provider)
 console.log(addressFrom,addressTo,privateKey)
  const  walletPrivateKey = new ethers.Wallet(privateKey,provider)
const nonce = await getNonce(addressFrom)
console.log(nonce)

const gasPrice = await provider.getGasPrice(addressFrom)
console.log("hi",gasPrice)
let transaction = {
gasLimit: 21000,
gasPrice: gasPrice,//await provider.getGasPrice(addressFrom),
nonce:nonce,//provider.getTransactionCount(addressFrom),
to: addressTo,
data: "0x",
value: ethers.utils.parseEther(amount)
};
console.log(transaction)
const signer = await walletPrivateKey.signTransaction(transaction)
console.log(signer)

const info = {
type:'BSC',
fee:gasPrice,
rawTransaction:signer,
addressTo:addressTo,
addressFrom:addressFrom,
amount:amount,
provider:provider
}
return info

}

const sendMatic = async (privateKey,amount,addressTo,addressFrom, navigation) =>{
  const  walletPrivateKey = new ethers.Wallet(privateKey)

  const settings = {
    apiKey: PolygonSecret.apiKey,
    network: Network.MATIC_MUMBAI,
  };
  
  const alchemy = new Alchemy(settings);
  const nonce = await alchemy.core.getTransactionCount(
    walletPrivateKey.address,
    "latest"
  );
  const gasPrice = ethers.utils.hexlify(parseInt(await alchemy.core.getGasPrice()))
  const transaction = {
    chainId: 80001,
    from: addressFrom,
    nonce: nonce,
    to: addressTo, 
    data: '0x',
    value: ethers.utils.parseEther(amount),
    gasLimit: ethers.utils.hexlify(21000),
    gasPrice: gasPrice,
  }
  let rawTransaction = await walletPrivateKey.signTransaction(transaction);
  const info = {
    type:'Matic',
    fee:gasPrice,
    rawTransaction:rawTransaction,
    addressTo:addressTo,
    addressFrom:addressFrom,
    amount:amount,
    provider:alchemy
  }
  return info

 

}
const sendXRP = async (privateKey,amount,addressTo, navigation) =>{
  console.log('started')
  console.log(privateKey)
  const Wallet = xrpl.Wallet.fromSecret(privateKey)
  console.log("hi"+Wallet)
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
 await client.connect()
const wallet = await AsyncStorageLib.getItem('wallet')
console.log(JSON.parse(wallet).classicAddress)
const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": JSON.parse(wallet).classicAddress,
  "Amount": xrpl.xrpToDrops(`${amount}`),
  "Destination": addressTo
}).catch((e)=>{
  console.log(e)
})
const max_ledger = prepared.LastLedgerSequence
console.log("Prepared transaction instructions:", prepared)
console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
console.log("Transaction expires after ledger:", max_ledger)
const signed = Wallet.sign(prepared)
console.log("Identifying hash:", signed.hash)
console.log("Signed blob:", signed.tx_blob)
const info = {
  type:'XRP',
  fee:prepared.Fee,
  rawTransaction:signed,
  addressTo:addressTo,
  addressFrom:Wallet.classicAddress,
  amount:amount,
  provider:client
}
return info
 


}
const SendCrypto = async (recieverAddress, amount, decrypt, balance, setLoading, walletType, setDisable, myAddress,Token,navigation) => {
    let provider  

   // const walletType = await AsyncStorage.getItem('walletType')
    console.log(walletType)
    if(walletType=='BSC'){
      provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
    }
      setLoading(true)

     
      const privateKey=decrypt?decrypt:alert('no wallets connected')
     console.log(privateKey)
     const addressTo = recieverAddress//"0x0E52088b2d5a59ee7706DaAabC880Aaf5A1d9974"//address;
   
     
   const addressFrom = myAddress?myAddress:alert('please choose a wallet first');
   
      if(walletType=='Ethereum'){
      
       await sendEth(privateKey,amount,addressTo,addressFrom, navigation)
       .then((response)=>{
        console.log(response)
        const info = response
        navigation.navigate('Confirm Tx',{
          info
        })
      })
       }else if(walletType=='Matic'){
        try{
       
          await sendMatic(privateKey,amount,addressTo,addressFrom,navigation)
          .then((response)=>{
            console.log(response)
            const info = response
            navigation.navigate('Confirm Tx',{
              info
            })
          })
          
        }catch(e){
          setDisable(true)

          console.log(e)
          setLoading(false)
        }
          
        }
        else if(walletType=='BSC'){
          await sendBNB(privateKey,amount,addressTo,addressFrom,navigation)
          .then((response)=>{
            console.log(response)
            const info = response
            navigation.navigate('Confirm Tx',{
              info
            })
          })
         
         }else if(walletType=='Xrp'){
          await sendXRP(privateKey,amount,addressTo,navigation)
          .then((response)=>{
            console.log(response)
            const info = response
            navigation.navigate('Confirm Tx',{
              info
            })
          })
        
         }else if(walletType==='Multi-coin'){
          if(Token==='Ethereum'){
            await sendEth(privateKey,amount,addressTo,addressFrom,navigation)
            .then((response)=>{
              console.log(response)
              const info = response
              navigation.navigate('Confirm Tx',{
                info
              })
            })
          }
          else if(Token==='BNB'){
            await sendBNB(privateKey,amount,addressTo,addressFrom, navigation)
            .then((response)=>{
              console.log(response)
              const info = response
              navigation.navigate('Confirm Tx',{
                info
              })
            })
          }
          else if(Token==='Matic'){
            await sendMatic(privateKey,amount,addressTo,addressFrom, navigation)
            .then((response)=>{
              console.log(response)
              const info = response
              navigation.navigate('Confirm Tx',{
                info
              })
            })
          }
          else if(Token==='Xrp'){
            await sendXRP(privateKey,amount,addressTo,navigation)
            .then((response)=>{
              console.log(response)
              const info = response
              navigation.navigate('Confirm Tx',{
                info
              })
            })
          }

         }
         else{
          setDisable(true)

          setLoading(false)
          return alert('chain not supported yet')
         }
         
      
    };
    export {
        SendCrypto
    }