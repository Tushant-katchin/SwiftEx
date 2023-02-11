import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers"
import { saveFile, encryptFile } from "../../../utilities/utilities";
import { urls,RPC, WSS } from "../../../Dashboard/constants";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
const xrpl = require("xrpl")

const logIn = async (user) => {
  console.log("user info", user)
  let response
  const { username, password } = user;
  try{

  
  response = await fetch(`http://${urls.testUrl}/user/login`, {
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
             emailId: username,
             password: password})
   }).then((response) => response.json())
   .then(async (responseJson) => {
    console.log(responseJson)
   
    if (responseJson.responseCode===200) {
      AsyncStorage.setItem("user", JSON.stringify(responseJson.responseData.user));
      AsyncStorage.setItem("emailId", JSON.stringify(username));
      return {
        status: "success",
        message: "You are redirecting to home page",
        emailId: username,
        user:responseJson.responseData.user,
        token:responseJson.responseData.token
      };
    }
   else{
    if (responseJson.responseCode===400) {
      return {
        status: "Not Found",
        message: "user not found ",
        emailId: null
      };
    }
    if (responseJson.responseCode===401) {
      return {
        status: "verifyotp",
        message: "please verify your account first ",
        emailId: null
      };
    }
    if (responseJson.responseCode===405) {
      return {
        status: "invalid",
        message: "please provide valid credentials ",
        emailId: null
      };
    }
   }
    
  
  }).catch((error)=>{
    alert(error)
  })
}catch(e){
  console.log(e)
  alert(e)
}
  console.log(response)
  return response

  
};

const setToken = async(token) =>{
if(token)
{
  AsyncStorage.setItem("token", token);
      return {
        status: "success",
        message: "token saved",
        token: token,
      };
}
}

const setPlatform = async(platform) =>{
  if(platform)
  {
    AsyncStorage.setItem("platform", platform);
        return {
          status: "success",
          message: "platform saved",
          platform: platform,
        };
  }
  }
  

const setUser = async(user) =>{
 
    AsyncStorage.setItem("user", user);
        return {
          status: "success",
          message: "user saved",
          user: user,
        };
  
  }

  const setWalletType = async(type) =>{
 
    AsyncStorage.setItem("walletType", JSON.stringify(type));
        return {
          status: "success",
          message: "wallet type saved",
          walletType: type,
        };
  
  }


  const setProvider = async(provider) =>{
 
    AsyncStorage.setItem("provider", JSON.stringify(provider));
        return {
          status: "success",
          message: "provider saved",
          provider: provider,
        };
  
  }
  

const confirmOtp = async (user) => {
  console.log("user info", user);
  const { emailId,OTP } = user;
  const response = await fetch(`http://${urls.testUrl}/user/confirmotp`, {
    method: 'POST',
    headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
    },
   body: JSON.stringify({
    emailId:emailId,       
    otp:OTP})  
   }).then((response) => response.json())
   .then((responseJson) => {
    console.log(responseJson)
    if (responseJson.responseCode===200) {
      AsyncStorage.setItem("otp", JSON.stringify(OTP));
      return {
        status: "success",
        message: "otp confirmed",
        OTP: OTP,
      };
      
    }
    if (responseJson.responseCode===405) {
      return {
        status: "invalid",
        message: "Invalid Otp"
      };
    }
  
  });
  console.log(response)
  return response

  
};

const logOut = async () => {

  return {
    status: "success",
    message: "You are logged out",
  };
};

const Extend = async () => {

 

  return {
    status: "success",
    message: "Topbar Extended",
    extended:true
  };
};

const Collapse = async () => {

 

  return {
    status: "success",
    message: "Topbar Collapsed",
    extended:false
  };
};



const getBalance = async (address) => {
  console.log(address)
  try{

    if(address) {
      const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC); 
      const balancee=await provider.getBalance(address)
      const balanceInEth = ethers.utils.formatEther(balancee);
      console.log(balanceInEth)
      // AsyncStorage.setItem('balance', balance);
      
      AsyncStorage.setItem('balance', balanceInEth);
      return {
        status: "success",
        message: "Balance fetched",
        walletBalance: balanceInEth
      };
    }
    else{
      return{
        status:"error",
        message:'failed to fetch balance',
        walletBalance:0
        
      }
    }
  }catch(e)
{
  console.log(e)
}  
/*
 const token = await AsyncStorageLib.getItem('token')

  const response = await fetch(`http://${urls.testUrl}/user/Balance`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token:token,
      address:address})
    }).then((response) => response.json())
    .then( (responseJson) => {
      console.log(responseJson)
     

        if(responseJson.walletBalance){
          const balance = parseFloat(responseJson.walletBalance)
          console.log(balance.toFixed(3))
          AsyncStorage.setItem('balance', responseJson.walletBalance);
          
          return {
            status: "success",
            message: "Balance fetched",
            walletBalance: balance
          };
        }
        else
        {
          return {
            status: "success",
            message: "Balance fetched",
            walletBalance: 0.00
          }; 
        }
     
        
        
        
        
        
      }).catch((e)=>{
        console.log(e)
        //alert('unable to update balance')
    })
    
    
    
    return response
    */

  
  
 
  
  };

  const getEthBalance = async (address) =>{
    try{

      if(address){
        
        const provider = ethers.getDefaultProvider('goerli');
        const EthBalance = await provider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(EthBalance)
        
        console.log(balanceInEth)
        AsyncStorage.setItem('EthBalance', balanceInEth);
        
        return {
          status: "success",
          message: "Eth Balance fetched",
          EthBalance: balanceInEth
        };
      }else{
        return {
          status: "success",
          message: "Eth Balance fetched",
          EthBalance: 0
        }; 
      }
    }catch(error){
      return {
        status: "error",
        message: "failed to fetch balance",
        EthBalance: 0
      }; 
    }
      /* const token = await AsyncStorageLib.getItem('token')
      
    const response = await fetch(`http://${urls.testUrl}/user/getEthBalance`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token:token,
      address:address})
    }).then((response) => response.json())
    .then( (responseJson) => {
      console.log(responseJson)
     

        if(responseJson.responseData){
          const balance = parseFloat(responseJson.responseData)
          console.log(balance.toFixed(3))
          AsyncStorage.setItem('EthBalance', balance.toFixed(3));
          
          return {
            status: "success",
            message: "Eth Balance fetched",
            EthBalance: balance.toFixed(3)
          };
        }
        else
        {
          return {
            status: "success",
            message: "Eth Balance fetched",
            EthBalance: 0
          }; 
        }
     
        
        
        
        
        
      }).catch((e)=>{
        console.log(e)
        //alert('unable to update balance')
    })
    
 


  return response

  */

  }
  
  

const Generate_Wallet = async (name,password,emailId, dispatch, getDirectoryUri, FolderUri) => {
  console.log('starting')
  const wallet = ethers.Wallet.createRandom();

console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);

const encrypt = encryptFile(wallet.privateKey,password)
console.log(encrypt)
//const accountFromMnemonic = ethers.Wallet.fromMnemonic(wallet.mnemonic.phrase);
const Wallet={
  address:wallet.address,
  name:name,
privateKey: encrypt}
//U2FsdGVkX1/SRbuXM6TDBLUvaesi/GDEZvnfyv5cQsJfuJ/EmJKOu4Dsa0H69vd17YHoou1e9TD44Sc4fgM0AXQkKyPE2kWYkkOvB/3hyuoX4sfjFSTJMVhEfwKKHoy0
//console.log("accountFromMnemonic", accountFromMnemonic.address);
//return wallet.mnemonic.phrase
console.log(wallet)

  if (wallet) {
    AsyncStorage.setItem("Wallet", JSON.stringify(Wallet))
    AsyncStorage.setItem("Wallet address", JSON.stringify(wallet.address));

  
    saveFile(name,encrypt,wallet.mnemonic.phrase,password,emailId,dispatch, getDirectoryUri, FolderUri)
    return {
      status: "success",
      message: "Wallet generation successful",
      wallet: Wallet,
    };
  }

};

const Generate_Wallet2 = async () => {
  console.log('starting')
  const wallet = ethers.Wallet.createRandom();
  const words = wallet.mnemonic.phrase
console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);
console.log(ethers.utils.mnemonicToSeed(words))
let node = ethers.utils.HDNode.fromMnemonic(words)
let account1 = node.derivePath("m/44'/60'/0'/0/0") 
let account2 = node.derivePath("m/44'/60'/0'/0/1")
console.log(account1, account2, node)
const Wallet={
  address:account1.address,
  privateKey: account1.privateKey,
  mnemonic: account1.mnemonic.phrase,
  walletType:'Multi-coin'
}
//U2FsdGVkX1/SRbuXM6TDBLUvaesi/GDEZvnfyv5cQsJfuJ/EmJKOu4Dsa0H69vd17YHoou1e9TD44Sc4fgM0AXQkKyPE2kWYkkOvB/3hyuoX4sfjFSTJMVhEfwKKHoy0
//console.log("accountFromMnemonic", accountFromMnemonic.address);
//return wallet.mnemonic.phrase
console.log(wallet)

  if (wallet) {
    AsyncStorage.setItem("Wallet", JSON.stringify(Wallet))

  
    return {
      status: "success",
      message: "Wallet generation successful",
      wallet: Wallet,
    };
  }

};


async function ImportWallet(privatekey, mnemonic, name, wallets,user){
  if(mnemonic){
    let allWallets=[]
if(wallets[0].name!==undefined){
  wallets.map((item)=>{
    allWallets.push(item)
    })
    
}
    const accountFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(accountFromMnemonic)
    let wallet={
     
      address:accountFromMnemonic.address,
      name:name
    }
    allWallets.push(wallet)
    AsyncStorage.setItem(`${user}-wallets`, JSON.stringify(allWallets))

    return{
      status:'success',
      message: "Wallet generation successful",
      wallets: allWallets,
    }

  }
  else{
console.log(wallets)
let allWallets=[]
if(wallets[0].name!==undefined){
  wallets.map((item)=>{
    allWallets.push(item)
    })
    
}

    const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC); 
    let privateKey = privatekey;
    //"0x8bf620dcb1b55ebddbc16f347c642438cad00d2b647cd6d272bed27bf5d75067";
    let walletWithProvider = new ethers.Wallet(privateKey, provider);
    let wallet={
      name:name,
      address:walletWithProvider.address,
      
      
    }
    
    
    allWallets.push(wallet)
    AsyncStorage.setItem("Wallet", JSON.stringify(wallet))
    AsyncStorage.setItem(`${user}-wallets`, JSON.stringify(allWallets))

    return{
      status:'success',
      message: "Wallet generation successful",
      wallets: allWallets,
    }
  }
  }
  
  async function CheckWallets(privatekey){
    const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC); 
  let privateKey = privatekey;
  //"0x8bf620dcb1b55ebddbc16f347c642438cad00d2b647cd6d272bed27bf5d75067";
  let walletWithProvider = new ethers.Wallet(privateKey, provider);
  let wallet={
    privateKey:privateKey,
    address:walletWithProvider.address,
    wallet:walletWithProvider

  }

  console.log(walletWithProvider)
  console.log(wallet)
  AsyncStorage.setItem("Wallet", JSON.stringify(wallet))
  return{
    status:'success',
    message: "Wallet generation successful",
    wallet: wallet,
  }
}


async function setCurrentWallet(address, name, privateKey, classicAddress){
  console.log(address)
  let wallet
  if(classicAddress){

    wallet={
      classicAddress:classicAddress,
      address:address,
      name:name,
      privateKey:privateKey
    }
    }else{
      wallet={
  
        address:address,
        name:name,
        privateKey:privateKey
      }
    }
 

   
  AsyncStorage.setItem("wallet", JSON.stringify(wallet))
  return{
    status:'success',
    message: "Wallet Selection successful",
    wallet: wallet,
  }
}


async function importAllWallets(accounts, emailId){
  const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC); 
  
  let allWallets=[]
  console.log(accounts)
  accounts.map(async (element )=> {
    console.log(element)
        
    let walletWithProvider =  new ethers.Wallet(element.privateKey, provider);
  let wallet={
    name:element.name,
    privateKey:element.privateKey,
    address:walletWithProvider.address,

  }

allWallets.push(wallet)
  //console.log(walletWithProvider)
  console.log(wallet)
  console.log(allWallets)
  
   
    
    
    

});
AsyncStorage.setItem(`${emailId}-wallets`, JSON.stringify(allWallets))
return{
  status:'success',
  message: "Wallet import successful",
  wallets: allWallets,
}
}

async function AddToAllWallets(wallets,user){
  console.log(wallets[0].wallets)
  let allWallets=wallets[0].wallets?wallets[0].wallets:[]
  console.log(wallets)
  console.log('hi'+user)
  
if(wallets[0].classicAddress){

  allWallets.push({name:wallets[0].name,
    privateKey:wallets[0].privateKey,
    address:wallets[0].address,
    classicAddress:wallets[0].classicAddress,
    walletType:wallets[0].walletType
  })
}else{
  allWallets.push({name:wallets[0].name,
    privateKey:wallets[0].privateKey,
    address:wallets[0].address,
    walletType:wallets[0].walletType

  })
}
  //console.log(walletWithProvider)
  
  
   
    
    
    

AsyncStorage.setItem(`${user}-wallets`, JSON.stringify(allWallets))
return{
  status:'success',
  message: "Wallet import successful",
  wallets: allWallets,
}
}


async function ImportUsingFile(wallets,user){
  
  let allWallets = wallets.allWallets?wallets.allWallets:[]
  //allWallets.push(wallets.allWallets)
  console.log(wallets.allWallets)
 
  
  const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC); 
  let privateKey = wallets.privateKey;
  //"0x8bf620dcb1b55ebddbc16waf347c642438cad00d2b647cd6d272bed27bf5d75067";
  let walletWithProvider = new ethers.Wallet(privateKey, provider);
  let wallet={
    privateKey:privateKey,
    address:walletWithProvider.address,
    name:wallets.name

  }

  
  //console.log(wallet)
  allWallets.push({ privateKey:wallets.privatekey,
    address:walletWithProvider.address,
    name:wallets.name}) 

AsyncStorage.setItem(`${user}-wallets`, JSON.stringify(allWallets))
return{
  status:'success',
  message: "Wallet import successful",
  wallets: allWallets,
}
}


async function getWalletsData(wallets,user){
  let wallet
  let allWallets =[]
  wallets.map((item)=>{
    
       wallet={
        name:item.name,
        privateKey:item.privateKey    
      }
      allWallets.push(wallet)
  
  })
  


  //console.log(walletWithProvider)
  console.log(wallet)
  console.log(allWallets)
  
   
    
    
    

AsyncStorage.setItem(`${user}-walletsData`, JSON.stringify(allWallets))
return{
  status:'success',
  message: "Wallet data fetched",
  walletsData: allWallets,
}
}


async function getDirectoryUri(uri){
console.log(uri)
AsyncStorage.setItem("directoryUri", uri)
return{
  status:'success',
  message: "Directory uri saved",
  directoryUri: uri,
}
}

const getMaticBalance = async (address) =>{
  try{

    if(address){
      
      const provider = new ethers.providers.JsonRpcProvider(RPC.MATICRPC);
      const MaticBalance = await provider.getBalance(address);
      const balanceInEth = ethers.utils.formatEther(MaticBalance)
      AsyncStorage.setItem('MaticBalance', balanceInEth);
      
      return {
        status: "success",
        message: "Matic Balance fetched",
        MaticBalance: balance.toFixed(3)
      };
    }else{
      return {
        status: "error",
        message: "Matic Balance fetch  failed",
        MaticBalance: 0
      }; 
    }
  }catch(error){
    return {
      status: "error",
      message: "Matic Balance fetch  failed",
      MaticBalance: 0
    }; 
  }
 /* const token = await AsyncStorageLib.getItem('token')
  const response = await fetch(`http://${urls.testUrl}/user/getMaticBalance`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token:token,
      address:address})
    }).then((response) => response.json())
    .then( (responseJson) => {
      console.log(responseJson)
     

        if(responseJson.responseData){
          const balance = parseFloat(responseJson.responseData)
          console.log(balance.toFixed(3))
          AsyncStorage.setItem('MaticBalance', balance.toFixed(3));
          
          return {
            status: "success",
            message: "Matic Balance fetched",
            MaticBalance: balance.toFixed(3)
          };
        }
        else
        {
          return {
            status: "success",
            message: "Matic Balance fetched",
            MaticBalance: 0
          }; 
        }
     
        
        
        
        
        
      }).catch((e)=>{
        console.log(e)
        //alert('unable to update balance')
    })
    
 


  return response

  */

  }
  const getXrpBalance = async (address) =>{
    try{

      if(address){
        
        const client = new xrpl.Client(WSS.XRPWSS)
        await client.connect()
        const my_balance = (await client.getXrpBalance(address))  
        console.log(my_balance)
        //sEdTYTnQENSBnjLSaVBtMtC4P5ViaFZ
        //rP7n7Z4Hu4DziJbMJaCGfZhwd94aHzoN9b     
        client.disconnect()
        AsyncStorage.setItem('XrpBalance', my_balance);
        
        return {
          status: "success",
          message: "Xrp Balance fetched",
          XrpBalance: my_balance
        };
      }else{
        return {
          status: "error",
          message: "Xrp Balance fetch failed",
          XrpBalance: 0
        }; 
      }
    }catch(error){
      return {
        status: "error",
        message: "Xrp Balance fetch failed",
        XrpBalance: 0
      };
    }
  /*  const token = await AsyncStorageLib.getItem('token')
    const response = await fetch(`http://${urls.testUrl}/user/getXrpBalance`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token:token,
      address:address})
    }).then((response) => response.json())
    .then( (responseJson) => {
      console.log(responseJson)
     

        if(responseJson.responseData){
          const balance = parseFloat(responseJson.responseData)
          console.log(balance.toFixed(3))
          AsyncStorage.setItem('XrpBalance', balance.toFixed(3));
          
          return {
            status: "success",
            message: "Xrp Balance fetched",
            XrpBalance: balance.toFixed(3)
          };
        }
        else
        {
          return {
            status: "success",
            message: "Xrp Balance fetched",
            XrpBalance: 0
          }; 
        }
     
        
        
        
        
        
      }).catch((e)=>{
        console.log(e)
        //alert('unable to update balance')
    })
    
 


  return response
*/
  

  }

export default {
  logIn,

  logOut,

 Generate_Wallet,

 ImportWallet,

 getBalance,

 Extend,

 Collapse,

 confirmOtp,

 importAllWallets,

 setCurrentWallet,

 AddToAllWallets,

 CheckWallets,

 getWalletsData,

 ImportUsingFile,

 getDirectoryUri,

 setToken,

 Generate_Wallet2,

 setUser,

 setProvider,

 setWalletType,

 getEthBalance,

 getMaticBalance,

 getXrpBalance,

 setPlatform

};