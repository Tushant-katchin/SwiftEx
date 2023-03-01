// import { Transaction } from '@ethereumjs/tx'
import { useState } from 'react'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { ERC20_ABI, ETH_ERC20_ADDRESSES } from './utils/constants'
import { Button } from 'react-native'
import { StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const PRIVATE_KEY = "0x0cc27a4468a19efa2b727e57eb226c2fc07441228de6681f581c6763b4572bd4"
  //'e35f135a0db8fdee9a7f5ee8fcb9890f16694203372fae3c211949f34a6b9acb'

const ALLOWED_NETWORK_ID = 5
export const ConnectToWallet = ({ setMessage }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAccount, setConnectedAccount] = useState(null)

  const connect = async () => {
     
     try {
    if (!window.ethereum) throw new Error('No MetaMask Wallet found')
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      window.web3 = new Web3(window.ethereum)
      setConnectedAccount(accounts[0])
      const chain = await window.web3.eth.getChainId()

      if (chain !== ALLOWED_NETWORK_ID) {
        // Todo: request for chain switch
        throw new Error(
          `Only Goerli Chain Allowed to Connect, connected chain Id: ${chain}`,
        )
      }

      window.isWeb3Connected = true
      setIsConnected(true)
    } catch (error) {
      return setMessage(
        error.message || 'Something went wrong while connecting to wallet',
      )
    }
  }

  const disConnect = async () => {
    window.isWeb3Connected = false
    setIsConnected(false)
  }

  return (
    <View >
      {isConnected ? (
        <View style={{width:'40'}}>

       

          <Button onPress={disConnect} title='Disconnect' >
           
          </Button>
       
          <View >
            Connected Account: {connectedAccount}
          </View>
        </View>
        
      ) : (
        <View style={{width:wp(40), display:'flex', alignContent:'center',alignItems:'center'}} >
        <Button onPress={connect} title={'connect'} color={'green'} >
         
        </Button>
        </View>
      )}
</View>
  )
}

export const isWalletConnected = () => window.isWeb3Connected
export const getWeb3Provider = () =>
  window.isWeb3Connected ? window.web3 : null

export const transfer = (tokenName, receiver, amount, sender) => {
  const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/_i0W-PX5wH9bEjGnf7_ir4V6w4ZPyyfP')

  if (tokenName === 'ETH') return _transferEth(receiver, amount, web3,sender)

  const tokenAddress = ETH_ERC20_ADDRESSES[tokenName.toUpperCase()]
  if (!tokenAddress) throw new Error(`Invalid token name: ${tokenName}`)

  return _transferEthToken(tokenAddress, receiver, amount, web3,sender)
}

// <------------------------------< Helpers >------------------------------>

const _transferEth = async (reciever, amount, web3,sender) => {
  
  try {
    const blockNumber = await web3.eth.getBlockNumber()
     const block = await web3.eth.getBlock(blockNumber)
     const txGasLimit = +block.gasLimit/block.transactions.length

    const rawTx = {
      to: reciever,
      value: web3.utils.toWei(amount, 'ether'),
      gasLimit: Math.floor(txGasLimit),
    }

    const signedTx = await web3.eth.accounts.signTransaction(rawTx, sender)
    console.log(signedTx)

    return { signedTx }
  } catch (err) {
    console.log(err)
    return { err }
  }
}

const _transferEthToken = async (tokenAddress, receiver, amount, web3,sender) => {
  try {

    const token = new web3.eth.Contract(
      JSON.parse(JSON.stringify(ERC20_ABI)),
      tokenAddress,
    )

    const decimals = await token.methods.decimals().call()
    const amountInWei = _getWeiValue(amount, decimals, web3).toString()
    console.log(amountInWei)

    // Get tx data
    const txData = await token.methods
      .transfer(receiver, amountInWei)
      .encodeABI()

     const blockNumber = await web3.eth.getBlockNumber()
     const block = await web3.eth.getBlock(blockNumber)
     const txGasLimit = +block.gasLimit/block.transactions.length

    // Create raw tx
    const rawTx = {
      to: tokenAddress,
      data: txData,
      gasLimit: Math.floor(txGasLimit),
    }

    // Sign tx
    const signedTx = await web3.eth.accounts.signTransaction(rawTx, sender)

    return { signedTx }
  } catch (err) {
    console.log(err)
    return { err }
  }
}

const _getWeiValue = (amount, decimals, web3) => {
  const multiple = 10 ** decimals

  if (Number(amount) < 1) return Math.floor(amount * 10 ** decimals)
  return web3.utils.toBN(amount).mul(web3.utils.toBN(multiple))
}
