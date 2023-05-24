import Web3 from "web3"
import { RPC } from "../Dashboard/constants"
import Moralis from 'moralis';
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";

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


  export function checkAddressValidity(address)
  {
      const validity = ethers.utils.isAddress(address)
      return validity
  }
  