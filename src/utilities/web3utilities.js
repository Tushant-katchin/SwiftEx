import Web3 from "web3"
import { RPC } from "../Dashboard/constants"
import Moralis from 'moralis';
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { getBalance, getEthBalance, getMaticBalance, getXrpBalance } from "../components/Redux/actions/auth";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
const xrpl = require("xrpl");
// import { alert } from "../../src/Dashboard/reusables/Toasts";
// import { SaveTransaction } from "../utilities/utilities";
// find_transitions();

// export const find_transitions=()=>{
//   const addressToMonitor="0x9dAfD83899C3d01DeC08a90a5d59fe5bd2F58cF2";
// const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://eth-goerli.g.alchemy.com/v2/favrOyEWGeWQfG-rjh2KkqhJyUriu72j'))
// web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
//   if (!error) {
//     try{
//     web3.eth.getBlock(blockHeader.number, true)
//       .then((block) => {
//         block.transactions.forEach((transaction) => {
//           setDelay(200)
//           if(transaction.to===addressToMonitor)
//           {
//             console.log('Transaction to the monitored address detected:', transaction.from);
//             alert("Success","Eth Transactions Recieved Check history.");
//             SaveTransaction("Recieved",transaction.hash,"App","null","Multi-coin","Eth");
//             // setTimeout(()=>{
//             // },6000);
//           }
//         });
//       })
//       .catch((err) => {
//         console.error('Error fetching block:', err);
//       });
//   }catch(e)
//   {
//     console.log(e)
//   }
// } else {
//     console.error('Error:', error);
//   }
// })
// .on('error', (err) => {
//   console.error('Error:', err);
// });

// async function setDelay(time){
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({});
//     }, time);
//   });

// }
// }





// const addressToMonitor = '0x05cBb7CbEEE7C8f1B2DBf0Bb4bb820ac918D7c0e';
// const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/47dae78319124500ac4a20ef91175f8c'))
// web3.eth.subscribe('logs', (error, log) => {
//   if (!error) {
//     console.log("=========================================================================.......>>>>>>>>>>>>>>>>>>>>>",typeof(log.address))
//     // if(log.address === addressToMonitor || log.address === "0x9dAfD83899C3d01DeC08a90a5d59fe5bd2F58cF2"){
//       console.log('Log ..event from user address:', log);
//     // }else{
//       // console.log("=== did not match address ===>")
//     // }
//   }
//   else{
//     console.log("error",error);
//   }
// });


// web3.eth.subscribe('pendingTransactions', (error, transactionHash) => {
//   if (error) {
//     console.error(error);
//   }
//   web3.eth.getTransaction(transactionHash, (err, transaction) => {
//     if (err) {
//       console.error(err);
//     }
//     if (transaction && transaction.to && transaction.to.toLowerCase() === addressToMonitor.toLowerCase()) {

//       console.log('Transaction to the monitored address detected:', transaction.from);
//       // getEthBal();
//     }

//   });
// });
// const getEthBal = async (address) => {
//   try {
//     if (address) {
//       const provider = ethers.getDefaultProvider("goerli");
//       const EthBalance = await provider.getBalance(address);
//       const balanceInEth = ethers.utils.formatEther(EthBalance);
//       console.log(balanceInEth);
//       AsyncStorage.setItem("EthBalance", balanceInEth);
//       return {
//         status: "success",
//         message: "Eth Balance fetched",
//         EthBalance: balanceInEth,
//       };
//     } else {
//       return {
//         status: "error",
//         message: "Eth Balance fetched",
//         EthBalance: 0,
//       };
//     }
//   } catch (error) {
//     return {
//       status: "error",
//       message: "failed to fetch balance",
//       EthBalance: 0,
//     };
//   }
// }


export const watchEtherTransfers = ()=> {
    // Instantiate web3 with WebSocket provider
    const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'))
  
    // Instantiate subscription object
    const subscription = web3.eth.subscribe('pendingTransactions')
  
    // Subscribe to pending transactions
    subscription.subscribe((error, result) => {
      if (error) console.log(error)
    })
    .on('data', async (txHash) => {
      try {
        // Instantiate web3 with HttpProvider
        const web3Http = new Web3(RPC.ETHRPC)
  
        // Get transaction details
        const trx = await web3Http.eth.getTransaction(txHash)
  
        const valid = validateTransaction(trx)
        // If transaction is not valid, simply return
        if (!valid) return
  
        console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
        console.log('Transaction value is: ' + process.env.AMOUNT)
        console.log('Transaction hash is: ' + txHash + '\n')
  
        // Initiate transaction confirmation
        confirmEtherTransaction(txHash)
  
        // Unsubscribe from pending transactions.
        subscription.unsubscribe()
      }
      catch (error) {
        console.log(error)
      }
    })
  }
  
  export const checkPendingTransactions = async (address)=>{
    console.log('starting....')
    const web3 = new Web3(RPC.ETHRPC)
        let block = await web3.eth.getBlock('latest');
        let number = block.number;
        let transactions = block.transactions;
        console.log('Search Block: ' + number);

    
        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                //console.log(txHash)
                let tx = await web3.eth.getTransaction(txHash);
                console.log(address.toLowerCase(),tx.to.toLowerCase())
                console.log(tx.to)
                if (address.toLowerCase() == tx.to.toLowerCase()) {
                    console.log('found')
                    console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
                }
            }
        }
      
    
  }

  export const getEthTokenBalance = async (address,tokenAddress)=>{
    try {
      console.log('Starting token balance search')
      console.log(address)
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        "chain": "5",
        "tokenAddresses": tokenAddress?[tokenAddress]:[],
        "address": address
      });
      console.log(response.raw);
      if(response.raw[0])
      return response.raw[0].balance

      return 0
    } catch (e) {
      console.error(e);
    }
  }

  export const getBnbTokenBalance = async (address,tokenAddress)=>{
    try {
      console.log('Starting token balance search')
      console.log(address)
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        "chain": "97",
        "tokenAddresses": tokenAddress?[tokenAddress]:[],
        "address": address
      });
      console.log(response.raw);
      if(response.raw[0])
      return response.raw[0].balance

      return 0
    } catch (e) {
      console.error(e);
    }
  }

export const checkXrpAddress = (address)=>{
     const valid =  xrpl.isValidAddress(address)
       console.log(valid)
       return valid
}
  export function checkAddressValidity(address)
  {
      const validity = ethers.utils.isAddress(address)
      return validity
  }
  
  export const GetBalance =async (state,dispatch)=>{
    const address = await state.wallet.address
    dispatch(getEthBalance(address))
    dispatch(getMaticBalance(address))
    dispatch(getBalance(address))
   // dispatch(getXrpBalance(address))
  }

  export const getAllBalances = async (state,dispatch) => {
    try {
      const wallet = await AsyncStorageLib.getItem("wallet");
      const xrpAddress = await state.wallet.xrp.address?await state.wallet.xrp.address:''
      const address = (await state.wallet.address)
        ? await state.wallet.address
        : "";

      AsyncStorageLib.getItem("walletType").then(async (type) => {
        console.log("hi" + JSON.parse(type));
        if (!state.wallet.address) {
          console.log('no wallet selected');
        } else if (JSON.parse(type) == "Matic") {
          await dispatch(getMaticBalance(address))
            .then(async (res) => {
              let bal = await AsyncStorageLib.getItem("MaticBalance");
              console.log(bal);
              if (res) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (JSON.parse(type) == "Ethereum") {
          dispatch(getEthBalance(address))
            .then(async (e) => {
              const Eth = await e.EthBalance;
              let bal = await AsyncStorageLib.getItem("EthBalance");

              if (Eth) {
                console.log(res);
              } else {
                console.log("coudnt get balance");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (JSON.parse(type) == "BSC") {
          const balance = await state.walletBalance;
          if (balance) {
            console.log(res);
          }
        } else if (JSON.parse(type) == "Xrp") {
          console.log("entering xrp balance");
          try {
            const resp = dispatch(getXrpBalance(address))
              .then((response) => {
                console.log(response);
              })
              .catch((e) => {
                console.log(e);
              });
          } catch (e) {
            console.log(e);
          }
          //await getXrpBal(address)
          /* await getXrpBal(address)
          .catch((e)=>{
            console.log(e)
          })*/
        } else if (JSON.parse(type) == "Multi-coin") {

          dispatch(getMaticBalance(address))
            
          dispatch(getEthBalance(address))
            
          dispatch(getBalance(address))
            
          dispatch(getXrpBalance(xrpAddress))
         
        } else {
          console.log('error')
         // setType("");
          /*const wallet = await state.wallet.address;

          if (wallet) {
            await dispatch(getBalance(wallet))
              .then(async () => {
                const bal = await state.walletBalance;

                if (bal) {
                  GetBalance(bal);
                } else {
                  GetBalance(0);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }*/
          //alert('No wallet selected')
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
